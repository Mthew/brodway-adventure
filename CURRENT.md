# Estado actual

> Máximo 50 líneas. Al rebasarlo, se archiva en `history/` (ver `CLAUDE.md` §Flujo de trabajo).

**Actualizado:** 2026-08-17 · **Fase:** 1 (MVP) · **Plan:** [`docs/product/plan-fase-1.md`](docs/product/plan-fase-1.md)

## En qué punto va

| Entregable | Estado | Rama / PR |
|---|---|---|
| Sitio según los docs anteriores al 2026-08-16 | ✅ Mergeado | PR #1-#17 |
| Documentos del cliente, brecha y backoffice-features | ✅ Mergeado | PR #16 |
| **E1** arquitectura del cliente + **E2** Supabase ([`history/006`](history/006-supabase-y-arquitectura-cliente.md)) | 🔧 En revisión | `fase-1/e1-arquitectura-informacion` |

## Lo que hay que saber para no romper nada

- **Node 24.14.1.** Si tu shell tiene otra: `export PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH"`
- **El contenido vive en Supabase, no en el repo.** `lib/mock/` es SEMILLA: editarlo NO cambia el
  sitio. `lib/offers` y `lib/destinations` son la única puerta; ninguna página la salta.
- **`COLUMNAS_OFERTA` (`lib/supabase/client.ts`) se mantiene a mano.** `anon` tiene SELECT por
  COLUMNA, así que `select("*")` falla. Toda columna pública nueva: concederla a `anon` Y añadirla ahí.
- **Slugs reservados** (`lib/destinations/categorias.ts`): `internacionales`, `nacionales` y
  `pueblos-de-antioquia`. Un destino así se prerenderiza y NUNCA se sirve, sin error.
- **13 secciones en la home, intercaladas a propósito**: apilar las 5 comerciales rompe el
  Pre-Flight §11.B. Al tocarla, recontar (cabecera de `page.tsx`). LCP aún sin medir.
- **No correr `shadcn init`:** destruye `lib/utils.ts` ([`history/001`](history/001-shadcn-cli-descartado.md)).
- **Cero librerías de animación.** `animation-timeline` en `@supports`: sin soporte el contenido
  queda VISIBLE. Si el panel no compone frames, dan `null` sin estar rotas. Pre-Flight: [`004`](history/004-preflight-fase-1.md).
- **El hero usa `<picture>` a mano, NO `next/image`:** evita que el móvil se baje además el apaisado.
- **Sin IDs de medición no se carga etiqueta ni se emite evento** (`.env.example`).
- **Tipografías:** Montserrat (títulos, nav, botones), Lato (lectura), Caveat (firma). Mínimo 14px.
- **Dos cromos:** `(sitio)` con navbar y pie, `lp/[campana]` sin ninguno. Todo layout nuevo DEBE
  llamar a `setRequestLocale` o el sitio deja de ser estático sin dar error.
- **Verde = WhatsApp, naranja = enviar formulario.** Un solo color por intención en todo el sitio.
- **Contraste: verifica contra la superficie real**, no contra blanco ([`history/005`](history/005-velo-del-hero.md)).

## Bloqueos externos (ninguno se resuelve con código)

**Con fecha límite:** enviar a NextGen las columnas que le faltan al Google Sheet **antes** de su
sesión de levantamiento ([`brecha`](docs/product/brecha-estructura-funcional.md)).

**Abiertos:** contrato de `/api/lead` con NextGen · texto legal sin abogado · titularidad de
GA4/Meta/TikTok · hex oficiales y logo SVG · **fotografía propia** · **RNT sin verificar** ·
**testimonios reales** · horario · medios de pago · afiliaciones · correo.

## Decisiones abiertas

- `.agents/`, `.claude/`, `.codex/` (8.5 MB de skills) sin trackear: falta decidir si entran.
- Pendientes con marca: el precio va como "1.290.000 COP" sin el `$` del brief, y `--text-hero`
  (hasta 72px) supera el H1 48/56 del manual.
