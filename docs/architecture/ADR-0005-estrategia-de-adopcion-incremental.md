# ADR-0005 — Adopción incremental (strangler), no reescritura

**Estado:** Aceptado
**Fecha:** 2026-09-15

## Contexto

ADR-0001 a ADR-0004 cambian dónde vive el código, cómo se separa en capas y en qué idioma se
nombra. Aplicado de golpe sobre ~100 archivos que ya funcionan en producción (el sitio está en
Fase 1, con panel admin en uso real — `CURRENT.md`), un solo PR gigante es exactamente el riesgo
que `plan-backoffice.md` Fase 0 ya evitó a menor escala: ese refactor se hizo **sin añadir
funcionalidad**, en un PR separado, verificado en navegador antes de mergear, precisamente para que
el diff fuera legible y ningún PR de feature arrastrara un refactor encima.

## Decisión

1. **Ningún PR mezcla migración de arquitectura con funcionalidad nueva.** Un PR que mueve
   `lib/offers/` a `src/modules/offers/` no agrega ni cambia comportamiento — mismo criterio que
   `plan-backoffice.md` Fase 0.
2. **Orden por dependencia, no por preferencia**: primero los módulos que ya tienen la forma
   correcta (`offers`, `destinations` — ya separan lectura/escritura, ya tienen `lib/admin/*` sin
   JSX), después los que hoy mezclan capas (`leads`, por el acoplamiento descrito en ADR-0002).
   Migrar primero lo fácil valida el patrón antes de tocar el código más frágil.
3. **`code you touch, you migrate`**: fuera de las migraciones dedicadas, cualquier archivo que se
   edite por una razón distinta (un bug, una feature) se puede mover/renombrar a su ubicación
   objetivo como parte de ese mismo cambio, si el diff sigue siendo revisable. No es obligatorio —
   es una oportunidad, no una regla que bloquee trabajo no relacionado.
4. **Una rama y un PR por módulo migrado**, seguido el flujo general del repo
   (`CLAUDE.md` §Flujo de trabajo): rama nueva desde `main`, nombre descriptivo (ej.
   `refactor/arquitectura-modulo-offers`), PR a `main` al terminar ese módulo — no una rama única
   "migración de arquitectura" que viva semanas y acumule conflictos.
5. **Criterio de terminado por PR**: `pnpm build` en `EXIT=0` (incluye `pnpm check`, que ya corre
   `pnpm check:deps` y `pnpm test` — ver ADR-0002 "Consecuencias") y el recorrido del módulo migrado
   verificado en navegador — igual que el criterio que ya usó `plan-backoffice.md` Fase 0. **Para un
   PR que crea o modifica un archivo bajo `domain/` de algún módulo**, se suma `pnpm test:coverage`
   en verde (umbral en `vitest.config.mts`) y `pnpm lint` sin errores nuevos en los archivos
   tocados — el build por sí solo verifica tipos, no que una regla de negocio (`isExpired`,
   `isPublishable`, la construcción de `ConsentRecord`) haga lo que dice.
6. **La migración de `app/` a `src/app/` es la única que no puede ser parcial** (ADR-0001,
   Consecuencias): Next.js no permite `app/` y `src/app/` simultáneos. Se ejecuta como el último
   paso, cuando todos los módulos de `modules/`/`platform/`/`shared/` ya existen en `src/` y solo
   falta mover las rutas que los consumen.

Alternativa descartada: una rama larga de "arquitectura" que reorganice todo antes de mergear.
Se descarta por la razón que ya cita `CLAUDE.md`: "es preferible un conflicto visible a una rama
larga que nadie puede revisar" — y porque el sitio sigue recibiendo features durante la migración
(no hay una ventana de código congelado disponible).

## Consecuencias

- **Se gana**: cada PR es revisable en aislamiento, y el sitio nunca queda en un estado a medio
  migrar sin poder desplegarse — cada PR deja el `main` funcional.
- **Se paga**: la migración completa toma varios PRs a lo largo de semanas, no una tarde. Durante
  ese tiempo, el repo convive con módulos ya migrados y módulos todavía en su ubicación antigua —
  hay que aceptar la inconsistencia temporal como costo del enfoque incremental, no como error.
- **Riesgo aceptado**: sin una fecha límite explícita, la migración puede estancarse a medio camino
  si no se prioriza contra el resto del roadmap. Mitigación: cada módulo migrado es una mejora
  completa por sí sola (no depende de que los demás también migren), así que un estancamiento no
  deja código roto, solo deja la migración incompleta.
