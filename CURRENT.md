# Estado actual

> Máximo 50 líneas. Al rebasarlo, se archiva en `history/` (ver `CLAUDE.md` §Flujo de trabajo).

**Actualizado:** 2026-08-16 · **Fase:** 1 (MVP) · **Plan:** [`docs/product/plan-fase-1.md`](docs/product/plan-fase-1.md)

## En qué punto va

| Paso | Estado | Rama / PR |
|---|---|---|
| Fase 1 según los docs pre-2026-08-16 (pasos 0-9) · demo GoHighLevel · rediseño del home ([`spec-home-v1.md`](docs/design/spec-home-v1.md)) | ✅ Mergeado | PR #1-#13 |
| Impacto visual: hero ([`history/005`](history/005-velo-del-hero.md)) · tarjetas de destino · "Cómo funciona" en secuencia vertical | ✅ Mergeado | PR #14, #15, #17 |
| **El cliente entregó su especificación de alcance** ([`estructura-funcional-cliente.md`](docs/product/estructura-funcional-cliente.md)): manda sobre `mvp-features.md`/`fases-entrega.md`. Panel administrativo a Fase 1 ([`backoffice-features.md`](docs/product/backoffice-features.md)), 3ª categoría "Pueblos de Antioquia", menú y formulario distintos. Brecha: [`brecha-estructura-funcional.md`](docs/product/brecha-estructura-funcional.md) | 🔧 Sin replanificar | — |

## Lo que hay que saber para no romper nada

- **Node 24.14.1.** Si tu shell tiene otra: `export PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH"`
- **No correr `shadcn init`.** Probado y revertido: destruye `lib/utils.ts`. Ver
  [`history/001`](history/001-shadcn-cli-descartado.md).
- **Cero librerías de animación** (diales 7/7). `animation-timeline` en CSS dentro de
  `@supports`: sin soporte el contenido queda VISIBLE. JS ±0 kB. Al verificar: si el panel no
  compone frames, TODAS las ViewTimeline dan `currentTime: null` sin estar rotas.
- **El hero usa `<picture>` escrito a mano, NO `next/image`.** Es la única forma de servir el
  recorte vertical en móvil sin que el teléfono se baje además el apaisado. No lo "arregles".
- **Sin IDs de medición no se carga ninguna etiqueta ni se emite ningún evento** (`.env.example`).
- **Tipografías:** Montserrat (títulos, nav, botones, etiquetas), Lato (lectura), Caveat (firma
  narrativa). Mínimo 14px en todo el sitio.
- **Dos cromos:** `(sitio)` con navbar y pie, `lp/[campana]` sin ninguno. Todo layout nuevo DEBE
  llamar a `setRequestLocale` o el sitio deja de ser estático, sin dar ningún error.
- **Verde = WhatsApp, naranja = enviar formulario.** Un solo color por intención en todo el sitio.
- **Contraste: verifica contra la superficie real**, no contra blanco. El velo del hero es negro
  neutro con paradas distintas en móvil y escritorio; al moverlas hay que re-medir **`/` y
  `/destinos/[slug]`** (esta última es el peor caso). Método y cifras: [`history/005`](history/005-velo-del-hero.md).
- **El banner de cookies fija el alto del hero en móvil** (68svh): si crece, recomprueba que los
  CTA se vean sin scroll a 375px. Pre-Flight: [`history/004`](history/004-preflight-fase-1.md).

## Bloqueos externos (ninguno se resuelve con código)

Los resueltos el 2026-08-05 están en [`history/003`](history/003-datos-del-cliente-y-marca.md).
**Siguen abiertos:** contrato de `/api/lead` con GoHighLevel (sus campos no se convierten después
de creados) · texto legal sin validar por abogado · titularidad de cuentas GA4/Meta/TikTok · hex
oficiales y logo SVG · **fotografía propia** · horario · medios de pago · afiliaciones · correo.

## Decisiones abiertas

- `.agents/`, `.claude/`, `.codex/` (8.5 MB de skills) sin trackear: falta decidir si entran.
- El precio se formatea como "1.290.000 COP", sin el `$` del brief. Falta confirmarlo con marca.
- **`--text-hero` (hasta 72px) supera el H1 48/56 del manual**: confirmar con marca. `--text-display` sí lo respeta.
- **Las fotos de `public/destinos/` son de Unsplash, no del cliente.** Sirven para juzgar el diseño, no para publicar.
- **¿El backoffice ES la base de ofertas o publica sobre una externa?** Decide si es CMS o herramienta a medida, y bloquea elegir CMS: [`backoffice-features.md`](docs/product/backoffice-features.md) §7.
