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
| 4 · Home | ✅ Mergeado | PR #6 |
| 7 · `/lp/[campana]` | ✅ Mergeado | PR #7 |
| 8 · Tracking + cookies | ✅ En revisión | PR #8 |
| Datos del cliente + tipografía | ✅ Mergeado | PR #9 |
| 9 · Pre-Flight + sitemap | ✅ En revisión | `fase-1/paso-9-preflight` |

## Lo que hay que saber para no romper nada

- **Node 24.14.1.** Si tu shell tiene otra: `export PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH"`
- **No correr `shadcn init`.** Probado y revertido: destruye `lib/utils.ts`. Ver
  [`history/001`](history/001-shadcn-cli-descartado.md).
- **Sin IDs de medición no se carga ninguna etiqueta ni se emite ningún evento** (`.env.example`).
- **Tipografías:** Montserrat (títulos, nav, botones, etiquetas), Lato (lectura), Caveat (firma
  narrativa). Mínimo 14px en todo el sitio.
- **Dos cromos:** `(sitio)` con navbar y pie, `lp/[campana]` sin ninguno. Todo layout nuevo DEBE
  llamar a `setRequestLocale` o el sitio deja de ser estático sin dar ningún error.
- **Verde = WhatsApp, naranja = enviar formulario.** Un solo color por intención en todo el sitio.
- **Contraste: verifica contra la superficie real**, no contra blanco.
- **Pre-Flight limpio** en las 12 páginas a 375px y 1440px. Método y hallazgos en
  [`history/004`](history/004-preflight-fase-1.md). Falta confirmar el foco visible a ojo.

## Bloqueos externos (ninguno se resuelve con código)

Resueltos el 2026-08-05: WhatsApp, RNT, NIT, dirección, teléfono, tiempo de respuesta y
tipografías. Detalle en [`history/003`](history/003-datos-del-cliente-y-marca.md).

**Siguen abiertos:** contrato de `/api/lead` con GoHighLevel (sus campos no se convierten después
de creados) · texto legal sin validar por abogado · titularidad de cuentas GA4/Meta/TikTok · hex
oficiales, fotografía y logo SVG · horario · medios de pago · afiliaciones · correo.

## Decisiones abiertas

- `.agents/`, `.claude/`, `.codex/` (8.5 MB de skills) sin trackear: falta decidir si entran.
- El precio se formatea como "1.290.000 COP", sin el símbolo `$` que usa el brief. Es lo que
  rinde `Intl` en español y es consistente en todo el sitio. Falta confirmarlo con marca.
