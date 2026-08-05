# Estado actual

> Máximo 50 líneas. Al rebasarlo, se archiva en `history/` (ver `CLAUDE.md` §Flujo de trabajo).

**Actualizado:** 2026-08-05 · **Fase:** 1 (MVP) · **Plan:** [`docs/product/plan-fase-1.md`](docs/product/plan-fase-1.md)

## En qué punto va

| Paso | Estado | Rama / PR |
|---|---|---|
| 0-1 · Entorno + modelo de oferta | ✅ Mergeado | PR #1 |
| 2 · `LeadForm` + `/gracias` | ✅ Mergeado | PR #2 |
| 3 · `/paquetes` + `/paquetes/[slug]` | ✅ Mergeado | PR #3 |
| 6 · `/destinos` + `/destinos/[slug]` | ✅ Mergeado | PR #4 |
| 5 · Institucionales (`/nosotros`, `/contacto`, `/como-pagar`, `/faq`) | ✅ Mergeado | PR #5 |
| 4 · Home | ✅ En revisión | `fase-1/paso-4-home` |
| 7 · `/lp/[campana]` | ⏭️ Siguiente | — |
| 8 · Tracking + consentimiento de cookies | Pendiente (parcialmente bloqueado) | — |
| 9 · Pre-Flight + sitemap | Pendiente | — |

## Lo que hay que saber para no romper nada

- **Node 24.14.1 obligatorio.** Si tu shell tiene otra, usa
  `export PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH"`.
- **No correr `shadcn init`.** Probado y revertido: destruye `lib/utils.ts` e instala paquetes
  prohibidos. Detalle en [`history/001-shadcn-cli-descartado.md`](history/001-shadcn-cli-descartado.md).
- **`pnpm check`** corre dentro del `build`: protege el fallo de contraste mudo y este techo.
- La home se movió al final del orden. Motivo en
  [`history/002`](history/002-alcance-ficha-y-orden-de-pasos.md).
- Construidas TODAS las páginas del sitio menos `/lp/[campana]`.
- **Verde = WhatsApp, naranja = enviar formulario.** Un solo color por intención en todo el sitio.
- **Contraste: verifica contra la superficie real.** `Badge variant="destino"` sobre un hero navy
  rinde 1.82:1; para fondos oscuros existe `destinoOscuro` (8.46:1).
- `StickyCta` marca `data-sticky-cta` en el `<body>` y `globals.css` oculta el flotante con eso.
- **Deuda pendiente del Paso 9:** los enlaces del Footer miden 23px de alto en móvil, bajo el
  mínimo táctil de 44px del Pre-Flight §11.C.

## Bloqueos externos (ninguno se resuelve con código)

Contrato de `/api/lead` sin firmar con quien monte GoHighLevel (los campos de GHL no se pueden
convertir después de creados) · datos legales reales, hoy todos `XXXXXX` · número de WhatsApp
`57XXXXXXXXXX`, o sea que todos los CTA son enlaces muertos · consentimiento sin validar por
abogado · tiempo de respuesta que promete `/gracias` · marca (tipografías, hex, foto, logo SVG) ·
titularidad de cuentas. Impacto de cada uno en `plan-fase-1.md` §5.

## Decisiones abiertas

- `.agents/`, `.claude/`, `.codex/` (8.5 MB de skills) sin trackear: falta decidir si entran.
- El precio se formatea como "1.290.000 COP", sin el símbolo `$` que usa el brief. Es lo que
  rinde `Intl` en español y es consistente en todo el sitio. Falta confirmarlo con marca.
