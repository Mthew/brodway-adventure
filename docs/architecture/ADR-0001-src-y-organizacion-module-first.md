# ADR-0001 — Adoptar `src/` como raíz de código, con organización module-first

**Estado:** Aceptado
**Fecha:** 2026-09-15

## Contexto

El código vive hoy en la raíz del repo (`app/`, `components/`, `lib/`) mezclado con la
configuración del proyecto (`next.config.ts`, `tsconfig.json`, `package.json`, `.env*`). La
organización actual es **por tipo de archivo** (páginas / componentes / lógica), no por capacidad
de negocio: el concepto "Oferta" está repartido en al menos siete carpetas sin ninguna que lo
agrupe (`lib/types/offer.ts`, `lib/offers/`, `lib/admin/ofertas.ts`, `lib/supabase/mapeo.ts`,
`components/oferta/`, `components/ui/price-disclosure.tsx`, `app/admin/ofertas/**` — ver
[`mapeo-arquitectura-actual.md`](mapeo-arquitectura-actual.md) §1). El proyecto se
espera que crezca mucho a largo plazo; esta dispersión escala mal: cada capacidad nueva añade
carpetas en cuatro sitios distintos en vez de una.

Next.js soporta nativamente mover el código a `src/` sin reescribir lógica
(`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md` y
`.../src-folder.md`): es la base mecánica sobre la que se apoya esta decisión.

## Decisión

1. Todo el código de aplicación se mueve a `src/`: `src/app/`, `src/modules/`, `src/platform/`,
   `src/shared/`, `src/proxy.ts`. `public/`, `package.json`, `next.config.ts`, `tsconfig.json` y
   `.env*` se quedan en la raíz — Next.js lo exige, no es una preferencia.
2. Dentro de `src/`, la carpeta de primer nivel bajo `modules/` es una **capacidad de negocio**
   (`offers`, `destinations`, `campaigns`, `leads`, `tracking`, `demo-crm`), no un tipo de archivo.
   El árbol completo y el criterio de cuándo algo es módulo vs. `platform/` vs. `shared/` está en
   [`arquitectura-modular.md`](arquitectura-modular.md) §2 y §4.
3. El alias `@/*` de `tsconfig.json` pasa de `["./*"]` a `["./src/*"]` — único cambio de
   configuración que exige la mudanza (103 archivos usan hoy este alias).

Alternativa descartada: mantener `app/`/`components`/`lib` en la raíz y solo reorganizar por
capacidad dentro de `lib/`. Se descarta porque no resuelve la dispersión entre `lib/`,
`components/` y `app/admin/` para la misma capacidad — el problema no es la profundidad de `lib/`,
es que el eje de organización es transversal al de negocio.

## Consecuencias

- **Se gana**: un desarrollador nuevo (o un agente) que necesite tocar "todo lo de Ofertas" abre
  una carpeta, no siete. Escala mejor: una capacidad nueva es una carpeta nueva bajo `modules/`, no
  cuatro carpetas nuevas repartidas.
- **Se paga**: una migración mecánica pero de diff grande (mover ~100 archivos, actualizar sus
  imports). Se ejecuta de forma incremental, módulo por módulo — ver ADR-0005, nunca en un solo PR.
- **Riesgo aceptado**: mientras dura la migración, el repo convive con código en `src/` y código
  todavía en la raíz. Next.js no permite `app/` y `src/app/` simultáneos, así que la migración de
  `app/` en sí (a diferencia de `lib/`/`components/`) no puede ser gradual archivo por archivo:
  es atómica el día que se ejecuta, aunque el contenido que llega ya esté reorganizado en módulos
  de antemano bajo una carpeta temporal.
