# Estado actual

> Máximo 50 líneas. Al rebasarlo, se archiva en `history/` (ver `CLAUDE.md` §Flujo de trabajo).

**Actualizado:** 2026-09-18 · **Fase:** 1 (MVP) · **Plan:** [`docs/product/plan-fase-1.md`](docs/product/plan-fase-1.md)

## En qué punto va

| Entregable | Estado | Rama / PR |
|---|---|---|
| Sitio, docs del cliente, panel admin, **E1**+**E2** ([`006`](history/006-supabase-y-arquitectura-cliente.md)) | ✅ Mergeado | PR #1-#22 |
| Marca: fuente de verdad, 7 specs, 7 decisiones ([`007`](history/007-fuente-de-verdad-de-marca.md)) | ✅ Mergeado | PR #24 |
| Arquitectura module-first: 5 ADR + guardrails deterministas en `docs/architecture/` | ✅ Mergeado | PR #23 |
| Migración integrada en los 7 specs de marca + grafo de ejecución (`docs/brand/specs/grafo.md`, 33 nodos), con sus 5 hallazgos y 4 decisiones ya resueltos | ✅ Mergeado | PR #25, #26 |

## Próximo paso: ejecutar el grafo de marca

- **Listo para arrancar.** `docs/brand/specs/grafo.md` no tiene pendientes — los 12 nodos día 1 (`N-01.0a`, `N-01.0b`, `N-03.0`, `N-04.0`, `N-01.2`, `N-02.1`, `N-03.1`, `N-03.4`, `N-04.3`, `N-05.1`, `N-06.1`, `N-07.2`) pueden empezar ya. Camino crítico: 5 nodos (`N-01.0b→N-01.1→N-02.4→N-02.5→N-02.V`).
- **El grafo migra a `src/` solo lo que cada spec de marca ya toca** — no es una migración completa de arquitectura. `campaigns`, `demo-crm`, la capa de negocio (`domain/application/infrastructure`) de todos los módulos, y el paso atómico `app/`→`src/app/` quedan sin tocar por este grafo, a propósito (confirmado con el usuario 2026-09-18). No ampliar el alcance de un nodo de migración más allá de lo que su spec de marca necesita.
- **Cada fase de marca con cambio de código son dos PRs**: migración a `src/` primero (sin cambio de comportamiento), marca después — `docs/brand/intent.md` §0.bis.
- **La marca tiene un documento rector:** [`sistema-de-identidad.md`](docs/brand/sistema-de-identidad.md). Los hex del código ya son los de la marca (`#0D3B66`/`#16B4C6`/`#FF8A00`) — corregido en `N-01.1`.

## Lo que hay que saber para no romper nada

- **Node 24.14.1.** Si tu shell tiene otra: `export PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH"`
- **El contenido vive en Supabase, no en el repo.** `lib/mock/` es SEMILLA; `lib/offers`/`lib/destinations` son la única puerta. `COLUMNAS_OFERTA` (`lib/supabase/client.ts`) se mantiene a mano: toda columna pública nueva, concederla a `anon` y añadirla ahí.
- **Slugs reservados** (`lib/destinations/categorias.ts`): `internacionales`, `nacionales`, `pueblos-de-antioquia`.
- **13 secciones en la home, intercaladas a propósito** — recontar al tocar `page.tsx`.
- **No correr `shadcn init`** ([`history/001`](history/001-shadcn-cli-descartado.md)). Cero librerías de animación (`@supports` en `.line-draw*`). El hero usa `<picture>` a mano, no `next/image`.
- **Tipografía: decidido Manrope**; el código sigue en Montserrat/Lato/Caveat hasta `N-06.1`. Verde = WhatsApp, naranja = enviar formulario.
- **Contraste: verifica contra la superficie real, no contra blanco** ([`history/005`](history/005-velo-del-hero.md)).

## Bloqueos externos (ninguno se resuelve con código)

- **Con fecha límite:** enviar a NextGen las columnas del Google Sheet ([`brecha`](docs/product/brecha-estructura-funcional.md)).
- **Abiertos:** contrato de `/api/lead` · texto legal sin abogado · titularidad GA4/Meta/TikTok · **archivos maestros de marca** (kit recibido 2026-09-15, falta SVG/vertical/mono) · fotografía propia · RNT · testimonios · horario · pagos · correo.

## Decisiones abiertas

- Ninguna: las siete decisiones de marca (D-A…D-G), las reglas de ADR-0001-0005 y las 4 decisiones que el grafo dejó pendientes ya están cerradas. Lo que sigue es material (SVG, fotografía propia) o ejecución del grafo, no criterio.
- Pendiente con marca: el precio va como "1.290.000 COP" sin el `$` del brief.
