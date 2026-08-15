# Estado actual

> Máximo 50 líneas. Al rebasarlo, se archiva en `history/` (ver `CLAUDE.md` §Flujo de trabajo).

**Actualizado:** 2026-08-15 · **Fase:** 1 (MVP) · **Plan:** [`docs/product/plan-fase-1.md`](docs/product/plan-fase-1.md)

## En qué punto va

| Paso | Estado | Rama / PR |
|---|---|---|
| 0-1 a 9 · Fase 1 completa: entorno, oferta, LeadForm, paquetes, destinos, institucionales, home, landing, tracking, Pre-Flight | ✅ Mergeado | PR #1-#10 |
| Guion demo GoHighLevel · Dirección visual (fotografía + motion CSS-only) | ✅ Mergeado | PR #11, #12 |
| Motion más potente (diales 7/7) + spec del home ([`spec-home-v1.md`](docs/design/spec-home-v1.md)) | 🔧 En curso | `fase-1/motion-potente` |

## Lo que hay que saber para no romper nada

- **Node 24.14.1.** Si tu shell tiene otra: `export PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH"`
- **No correr `shadcn init`.** Probado y revertido: destruye `lib/utils.ts`. Ver
  [`history/001`](history/001-shadcn-cli-descartado.md).
- **Cero librerías de animación** (sigue así con los diales en 7/7). El movimiento es
  `animation-timeline: view()`/`scroll()` en CSS, siempre dentro de `@supports`: sin soporte el
  contenido queda VISIBLE. Medido antes de subir los diales: JS ±0 kB, CSS +1.7 kB.
- **El hero usa `<picture>` escrito a mano, NO `next/image`.** Es la única forma de servir el
  recorte vertical en móvil sin que el teléfono se baje además el apaisado. No lo "arregles".
- **Sin IDs de medición no se carga ninguna etiqueta ni se emite ningún evento** (`.env.example`).
- **Tipografías:** Montserrat (títulos, nav, botones, etiquetas), Lato (lectura), Caveat (firma
  narrativa). Mínimo 14px en todo el sitio.
- **Dos cromos:** `(sitio)` con navbar y pie, `lp/[campana]` sin ninguno. Todo layout nuevo DEBE
  llamar a `setRequestLocale` o el sitio deja de ser estático sin dar ningún error.
- **Verde = WhatsApp, naranja = enviar formulario.** Un solo color por intención en todo el sitio.
- **Contraste: verifica contra la superficie real**, no contra blanco. El velo del hero ya no es
  plano sino un degradado con paradas medidas (`.hero-scrim`): al moverlas, vuelve a medir.
- **El banner de cookies fija el alto del hero en móvil**: si crece, recomprueba que los CTA
  se vean sin scroll a 375px. Pre-Flight limpio en las 12 páginas a 375/1440px, método en
  [`history/004`](history/004-preflight-fase-1.md); falta confirmar el foco visible a ojo.

## Bloqueos externos (ninguno se resuelve con código)

Los resueltos el 2026-08-05 están en [`history/003`](history/003-datos-del-cliente-y-marca.md).

**Siguen abiertos:** contrato de `/api/lead` con GoHighLevel (sus campos no se convierten después
de creados) · texto legal sin validar por abogado · titularidad de cuentas GA4/Meta/TikTok · hex
oficiales y logo SVG · **fotografía propia** · horario · medios de pago · afiliaciones · correo.

## Decisiones abiertas

- `.agents/`, `.claude/`, `.codex/` (8.5 MB de skills) sin trackear: falta decidir si entran.
- El precio se formatea como "1.290.000 COP", sin el `$` del brief. Falta confirmarlo con marca.
- **Las fotos de `public/destinos/` son de Unsplash, no del cliente.** Sirven para juzgar el diseño, no para publicar.
