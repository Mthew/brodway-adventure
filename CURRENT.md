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
| **32/33 nodos del grafo ejecutados**: falta solo `N-07.4` | ✅ Mergeado | PR #28-#62 |

## ⚠️ Producción en Vercel congelada en PR #46 — no confundir con `main`

`main` tiene todo el trabajo de marca; **el sitio público (`browayadventures.com`/`*.vercel.app`) no**.
`N-02.V` encontró y arregló un bug real (`lib/config.ts`, `??`→`||` ante `NEXT_PUBLIC_SITE_URL=""`
en Vercel) que rompía el build desde `N-02.4`, pero el deploy a producción sigue sin dispararse
incluso con el fix — la API de Vercel devolvió `402 api-deployments-free-per-day, remaining: 0`
(cuota diaria agotada, probablemente por el volumen de ramas de esta sesión). Se resuelve solo
(reset de cuota) o redesplegando a mano desde el dashboard — no es un problema de código.

## Próximo paso: 1 nodo restante del grafo

- `N-07.4` (`sistema-de-identidad.md` §7 enlaza `aprobaciones.md` y `check-marca.mjs`) — depende de `N-07.1` ✅, listo para arrancar.
- **La marca tiene un documento rector:** [`sistema-de-identidad.md`](docs/brand/sistema-de-identidad.md). Los hex del código ya son los de la marca (`#0D3B66`/`#16B4C6`/`#FF8A00`). `pnpm check:marca` (10 reglas, R-1 a R-10) corre dentro de `pnpm build`.
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
