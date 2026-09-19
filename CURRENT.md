# Estado actual

> Máximo 50 líneas. Al rebasarlo, se archiva en `history/` (ver `CLAUDE.md` §Flujo de trabajo).

**Actualizado:** 2026-09-19 · **Fase:** 1 (MVP) · **Plan:** [`docs/product/plan-fase-1.md`](docs/product/plan-fase-1.md)

## En qué punto va

| Entregable | Estado | Rama / PR |
|---|---|---|
| Sitio, docs del cliente, panel admin, **E1**+**E2** ([`006`](history/006-supabase-y-arquitectura-cliente.md)) | ✅ Mergeado | PR #1-#22 |
| Marca: fuente de verdad, 7 specs, 7 decisiones ([`007`](history/007-fuente-de-verdad-de-marca.md)) | ✅ Mergeado | PR #24 |
| Arquitectura module-first: 5 ADR + guardrails deterministas en `docs/architecture/` | ✅ Mergeado | PR #23 |
| **Grafo de marca completo: 33/33 nodos** ([`008`](history/008-grafo-de-marca-ejecutado.md)) | ✅ Mergeado | PR #25-#64 |

## ⚠️ Producción en Vercel congelada en PR #46 — no confundir con `main`

`main` tiene todo el trabajo de marca; **el sitio público no**. Bug real ya corregido
(`lib/config.ts`, `??`→`||` ante `NEXT_PUBLIC_SITE_URL=""`), pero el deploy sigue sin dispararse:
la API de Vercel devuelve `402 api-deployments-free-per-day, remaining: 0` (cuota agotada). Se
resuelve solo o redesplegando a mano — verificar que producción refleje `main` antes de asumir que
algo de marca ya es visible para el cliente.

## Próximo paso: sin frente abierto en marca

- `pnpm check:marca` (10 reglas, R-1 a R-10) corre dentro de `pnpm build` — cualquier desviación
  futura de marca falla el build solo.
- Deuda técnica suelta, sin nodo propio: regresión de LCP en `/ofertas/[slug]` por el banner de
  cookies, 7 mensajes de error crudo en `lib/admin/{ofertas,destinos}.ts`/`sesion.ts`.
- **Navbar usa el símbolo** (`public/brand/simbolo.png`), no la firma completa — detalle en [`008`](history/008-grafo-de-marca-ejecutado.md).

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
