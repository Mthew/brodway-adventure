# Estado actual

> Máximo 50 líneas. Al rebasarlo, se archiva en `history/` (ver `CLAUDE.md` §Flujo de trabajo).

**Actualizado:** 2026-09-19 · **Fase:** 1 (MVP) · **Plan:** [`docs/product/plan-fase-1.md`](docs/product/plan-fase-1.md)

## En qué punto va

| Entregable | Estado | Rama / PR |
|---|---|---|
| Sitio, docs del cliente, panel admin, **E1**+**E2** ([`006`](history/006-supabase-y-arquitectura-cliente.md)) | ✅ Mergeado | PR #1-#22 |
| Marca: fuente de verdad, 7 specs, 7 decisiones ([`007`](history/007-fuente-de-verdad-de-marca.md)) | ✅ Mergeado | PR #24 |
| Arquitectura module-first: 5 ADR + guardrails deterministas en `docs/architecture/` | ✅ Mergeado | PR #23 |
| Grafo de ejecución de marca (`docs/brand/specs/grafo.md`, 33 nodos) | ✅ Mergeado | PR #25, #26 |
| **27/33 nodos del grafo ejecutados**: todo N-01/N-02.1-4/N-03/N-05/N-06/N-07.2-3, N-04.0-2 | ✅ Mergeado | PR #28-#56 |

## Próximo paso: 6 nodos restantes del grafo

- **Listos para arrancar ya**: `N-02.5` (og:image por página, espera `N-02.4` ✅), `N-04.3` (radios normalizados).
- `N-04.3` corre **sola, no en paralelo con otro nodo** — su reemplazo mecánico toca casi cualquier archivo con clases Tailwind (`docs/brand/specs/grafo.md` §5).
- Encadenados detrás: `N-02.V` (espera `N-02.5`), `N-04.4` (espera `N-04.3`), `N-07.1`→`N-07.4` (esperan `N-04.3`).
- **La marca tiene un documento rector:** [`sistema-de-identidad.md`](docs/brand/sistema-de-identidad.md). Los hex del código ya son los de la marca (`#0D3B66`/`#16B4C6`/`#FF8A00`) — corregido en `N-01.1`. `pnpm check:marca` (R-1/R-2) corre dentro de `pnpm build` desde `N-01.1`/`N-01.2`.
- **Navbar usa el símbolo, no la firma horizontal completa** — `logo-horizontal.png` es incompatible con la barra de 80px por el margen interno del archivo del kit (`N-02.2`). El símbolo vive en `public/brand/simbolo.png`.

## Lo que hay que saber para no romper nada

- **Node 24.14.1.** Si tu shell tiene otra: `export PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH"`
- **El contenido vive en Supabase, no en el repo.** `lib/mock/` es SEMILLA; `lib/offers`/`lib/destinations` son la única puerta. `COLUMNAS_OFERTA` (`lib/supabase/client.ts`) se mantiene a mano: toda columna pública nueva, concederla a `anon` y añadirla ahí.
- **Slugs reservados** (`lib/destinations/categorias.ts`): `internacionales`, `nacionales`, `pueblos-de-antioquia`.
- **13 secciones en la home, intercaladas a propósito** — recontar al tocar `page.tsx`.
- **No correr `shadcn init`** ([`history/001`](history/001-shadcn-cli-descartado.md)). Cero librerías de animación (`@supports` en `.line-draw*`). El hero usa `<picture>` a mano, no `next/image`.
- **Tipografía: Manrope**, ya aplicada en los dos layouts (`N-06.1`), Caveat retirada. Verde = WhatsApp, naranja = enviar formulario.
- **Contraste: verifica contra la superficie real, no contra blanco** ([`history/005`](history/005-velo-del-hero.md)).

## Bloqueos externos (ninguno se resuelve con código)

- **Con fecha límite:** enviar a NextGen las columnas del Google Sheet ([`brecha`](docs/product/brecha-estructura-funcional.md)).
- **Abiertos:** contrato de `/api/lead` · texto legal sin abogado · titularidad GA4/Meta/TikTok · **archivos maestros de marca** (kit recibido 2026-09-15, falta SVG/vertical/mono) · fotografía propia · RNT · testimonios · horario · pagos · correo.

## Decisiones abiertas

- Ninguna: las siete decisiones de marca (D-A…D-G), las reglas de ADR-0001-0005 y las 4 decisiones que el grafo dejó pendientes ya están cerradas. Lo que sigue es material (SVG, fotografía propia) o ejecución del grafo, no criterio.
- Pendiente con marca: el precio va como "1.290.000 COP" sin el `$` del brief.
