# ADR-0002 — Capas pragmáticas por módulo: domain / application / infrastructure / presentation

**Estado:** Aceptado
**Fecha:** 2026-09-15

## Contexto

`app/api/lead/route.ts` mezcla, en el mismo archivo, la validación de HTTP (parseo del body,
códigos de estado), la regla de negocio "sin consentimiento explícito no hay lead que capturar"
(línea 48) y el armado del payload de dominio (líneas 81-108) antes de delegar a `sendLeadToCrm`.
Es el único módulo donde esto pasa: `lib/admin/{ofertas,destinos}.ts` ya separan esto correctamente,
y `plan-backoffice.md` §2.2 ya escribió la regla que lo evita — *"Una Server Action no contiene
reglas de negocio... si crece más de ~25 líneas, la regla se fue al archivo equivocado"* y
*"`lib/admin/**` no importa nada de `app/`"* — pero solo la aplicó a `offers`/`destinations`, no a
`leads`. Sin nombrar la regla de forma explícita y pareja, cada módulo nuevo puede repetir el mismo
acoplamiento antes de que alguien lo note.

## Decisión

Cada módulo bajo `src/modules/<nombre>/` puede tener hasta cuatro carpetas, con una regla de
dependencia estricta: **las flechas de import apuntan hacia adentro**.

```
presentation/  →  application/  →  infrastructure/  →  domain/
```

**Corrección 2026-09-15:** la primera versión de este ADR escribió la cadena como
`presentation/ → infrastructure/ → application/ → domain/` (infraestructura entre presentación y
aplicación), y el diagrama de capas de `arquitectura-modular.md` §1 dibujaba `infrastructure/ →
application/`. Los dos contradicen cómo tiene que funcionar el código: `application/` necesita
**importar** `infrastructure/` para poder llamarla (`listActiveOffers` en `application/queries.ts`
importa `consultarOfertas` de `infrastructure/supabase-offers-repository.ts` — así lo muestra el
propio diagrama de secuencia de `arquitectura-modular.md` §5), no al revés. La cadena correcta,
verificada contra ese diagrama de secuencia, es la de arriba. El error no lo detectaba ningún
guardrail — el lint de este ADR solo bloquea imports de *framework* (`next`/`react`/`@supabase/*`)
hacia `domain/`/`application/`, no la direccionalidad entre capas — por eso se suman las reglas de
`dependency-cruiser` más abajo, que sí la verifican.

- **`domain/`**: tipos y reglas puras (`Offer`, `isExpired`, `isPublishable`). Cero imports de
  Next.js, React o Supabase.
- **`application/`**: casos de uso — funciones async que orquestan el dominio (`listActiveOffers`,
  `submitLead`, `publishOffer`). Reciben datos, no `Request` de Next.js ni `FormData` cruda. Es la
  capa que hace posible ADR-0003.
- **`infrastructure/`**: implementa el acceso a datos real (repositorio de Supabase, cliente del
  webhook a GoHighLevel). Sabe hacer el `SELECT`; no decide qué es "publicable".
- **`presentation/`**: lo único que puede importar Next.js/React — Server Components, Server
  Actions, *route handlers*, `.tsx`. Traduce HTTP/formulario hacia `application/` y de vuelta.

**Regla de simplificación explícita** (para no sobre-ingenierizar): un módulo con un solo origen de
datos y un solo consumidor (ej. `demo-crm`) colapsa `domain` + `application` en un archivo. Las
cuatro carpetas se justifican cuando el módulo ya tiene lectura pública **y** escritura admin, que
es el caso real de `offers` y `destinations` hoy. **El punto en que un módulo colapsado deja de ser
trivial no queda a criterio**: un archivo `src/modules/<nombre>/application.ts` (o `domain.ts`) que
supere 60 líneas falla `pnpm lint` (`max-lines` en `eslint.config.mjs`, sección "arquitectura-modular
§3") — el mismo tipo de disparador objetivo que `plan-backoffice.md` §2.2 ya usa para Server Actions
(~25 líneas), escalado porque aquí se fusionan dos capas en vez de una.

Alternativa descartada: Clean Architecture "de libro" con `ports`/`adapters` explícitos e
inyección de dependencias por interfaz para cada repositorio. Se descarta por sobre-ingeniería
para el tamaño del equipo y del proyecto — el pedido explícito es evitarla. La regla de dependencia
(qué puede importar a qué) da el mismo beneficio de desacoplamiento sin el andamiaje de interfaces
genéricas.

## Consecuencias

- **Se gana**: ningún módulo nuevo puede repetir el monolito de 310 líneas que `plan-backoffice.md`
  ya tuvo que desarmar una vez en `app/admin/acciones.ts` — la regla es la misma para todos.
- **Se gana**: `application/` sin dependencias de framework es lo que permite, más adelante, envolver
  los mismos casos de uso en un endpoint REST sin tocarlos (ADR-0003).
- **Se paga**: cuatro carpetas por módulo maduro es más andamiaje que un solo archivo `index.ts`
  para algo simple — por eso la regla de colapso existe y se debe seguir sin excepción para
  módulos triviales.
**Cada regla de este ADR tiene su propio guardrail, no una lista de intenciones.** Las cuatro,
juntas, cierran el hallazgo de la revisión del 2026-09-15 de que solo una de ellas (la primera)
tenía verificación mecánica real:

| # | Goal (qué debe ser cierto) | Check (cómo se verifica) | Guardrail (qué lo hace determinista) |
|---|---|---|---|
| 1 | `domain/`/`application/` no importan Next, React ni Supabase | `pnpm lint` | `no-restricted-imports` en `eslint.config.mjs`, con `files` apuntando a `src/modules/*/{domain,application}/**` (existía desde la versión anterior de este ADR) |
| 2 | Un módulo no reintroduce ciclos ni entra por la puerta de atrás de otro módulo (`domain/`, `infrastructure/` o `presentation/` ajenos; solo su `application/` es alcanzable desde fuera) | `pnpm check:deps` (parte de `pnpm check` → `pnpm build`) | `.dependency-cruiser.mjs`, reglas `no-circular`, `no-cross-module-internals`, `no-presentation-skipping-application`, `no-domain-importing-siblings` — usa *group matching* de dependency-cruiser (`$1`/`$2` capturados en `from.path`) para comparar "mismo módulo vs. otro módulo" sin listar los 6 módulos a mano |
| 3 | El código de `src/modules/`, `src/platform/` y `src/shared/` usa identificadores en inglés (ADR-0004) | `pnpm lint` | `no-restricted-syntax` en `eslint.config.mjs`, dos selectores: caracteres acentuados/`ñ` en cualquier identificador, y una lista mantenida a mano de palabras ya detectadas en `mapeo-arquitectura-actual.md` §4 (mismo criterio que `COLUMNAS_OFERTA`, ver `CURRENT.md`) |
| 4 | Una regla de negocio en `domain/` (`isExpired`, `isPublishable`, etc.) hace lo que dice, no solo compila | `pnpm test:coverage` (gate exigido en el PR que migra o toca un módulo, ver ADR-0005 §5) | `vitest.config.mts`, umbral de cobertura (90% líneas/statements/funciones, 85% branches) con `include` acotado a `src/modules/*/domain/**` |

Los cuatro guardrails apuntan a `src/modules/**`, que todavía no existe: igual que la regla #1
original, no fallan por ausencia de archivos — quedan dormidos y se activan solos en cuanto el
primer módulo migra (verificado corriendo cada uno contra un módulo de prueba antes de escribir
esta fila: ciclo detectado, cruce de módulo detectado, `presentation/` saltándose `application/`
detectado, `domain/` con tilde y con palabra de la lista detectado, cobertura insuficiente
detectada — y ningún falso positivo sobre un identificador en inglés real como `destinationCity`).

- **Se paga**: cuatro carpetas por módulo maduro es más andamiaje que un solo archivo `index.ts`
  para algo simple — por eso la regla de colapso existe y se debe seguir sin excepción para
  módulos triviales.
- **Riesgo que queda, a propósito, sin guardrail todavía**: la tabla de decisión módulo vs.
  `platform/` vs. `shared/` (`arquitectura-modular.md` §4) sigue siendo un criterio de revisión, no
  uno mecánico — "¿tiene reglas de negocio propias?" no es una pregunta que un lint pueda responder.
  Se acepta como el límite razonable de lo automatizable con las herramientas ya elegidas (ESLint,
  dependency-cruiser, vitest); forzarlo requeriría una heurística ad hoc de dudoso valor.
