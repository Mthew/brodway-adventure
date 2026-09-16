# Estado actual

> Máximo 50 líneas. Al rebasarlo, se archiva en `history/` (ver `CLAUDE.md` §Flujo de trabajo).

**Actualizado:** 2026-09-16 · **Fase:** 1 (MVP) · **Plan:** [`docs/product/plan-fase-1.md`](docs/product/plan-fase-1.md)

## En qué punto va

| Entregable | Estado | Rama / PR |
|---|---|---|
| Sitio, docs del cliente, panel admin, **E1**+**E2** ([`006`](history/006-supabase-y-arquitectura-cliente.md)) | ✅ Mergeado | PR #1-#22 |
| Marca: fuente de verdad, 7 specs, 7 decisiones ([`007`](history/007-fuente-de-verdad-de-marca.md)) | ✅ Mergeado | PR #24 |
| Arquitectura module-first: 5 ADR + guardrails deterministas en `docs/architecture/` | ✅ Mergeado | PR #23 |
| Migración de arquitectura integrada en los 7 specs de marca + grafo de ejecución (`docs/brand/specs/grafo.md`, 33 nodos) | 🔓 Abierto | PR #25 |

## Lo que hay que saber para no romper nada

- **Cada fase de marca con cambio de código son dos PRs, no uno**: migración a `src/` primero (sin cambio de comportamiento), marca después — regla en `docs/brand/intent.md` §0.bis.
- **Antes de ejecutar la Fase 1 o la Fase 7 de marca**, resolver los hallazgos H-1 y H-4 de `docs/brand/specs/grafo.md` §8: su propio `check:marca` fallaría contra el PR que lo crea si no se corrigen antes.
- **`src/` todavía no existe.** La migración module-first es incremental (ADR-0005): cada archivo migra con su propio PR de "solo mover", verificado antes de cualquier cambio de comportamiento encima.
- **La marca tiene un documento rector:** [`sistema-de-identidad.md`](docs/brand/sistema-de-identidad.md). Los hex del código siguen sin ser los de la marca (`#003062`/`#00aac3`/`#ff6a03` → `#0D3B66`/`#16B4C6`/`#FF8A00`) — se corrige en la Fase 1 de marca (dos PRs, ver arriba), no de paso.
- **Node 24.14.1.** Si tu shell tiene otra: `export PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH"`
- **El contenido vive en Supabase, no en el repo.** `lib/mock/` es SEMILLA; `lib/offers`/`lib/destinations` son la única puerta. `COLUMNAS_OFERTA` (`lib/supabase/client.ts`) se mantiene a mano: toda columna pública nueva, concederla a `anon` y añadirla ahí.
- **Slugs reservados** (`lib/destinations/categorias.ts`): `internacionales`, `nacionales`, `pueblos-de-antioquia`.
- **13 secciones en la home, intercaladas a propósito** — recontar al tocar `page.tsx`.
- **No correr `shadcn init`** ([`history/001`](history/001-shadcn-cli-descartado.md)). Cero librerías de animación (`@supports` en `.line-draw*`). El hero usa `<picture>` a mano, no `next/image`.
- **Sin IDs de medición no se carga etiqueta ni se emite evento** (`.env.example`).
- **Tipografía: decidido Manrope**; el código sigue en Montserrat/Lato/Caveat hasta la Fase 6 de marca. Verde = WhatsApp, naranja = enviar formulario.
- **Contraste: verifica contra la superficie real, no contra blanco** ([`history/005`](history/005-velo-del-hero.md)).

## Bloqueos externos (ninguno se resuelve con código)

- **Con fecha límite:** enviar a NextGen las columnas del Google Sheet ([`brecha`](docs/product/brecha-estructura-funcional.md)).
- **Abiertos:** contrato de `/api/lead` · texto legal sin abogado · titularidad GA4/Meta/TikTok · **archivos maestros de marca** (kit recibido 2026-09-15, falta SVG/vertical/mono) · fotografía propia · RNT · testimonios · horario · pagos · correo.

## Decisiones abiertas

- Ninguna de marca ni de arquitectura: las siete decisiones de marca (D-A…D-G) y las reglas de ADR-0001-0005 están cerradas. Lo pendiente es material (SVG, fotografía propia) o ejecución (correr las fases con sus PRs de migración), no criterio.
- Pendiente con marca: el precio va como "1.290.000 COP" sin el `$` del brief.
