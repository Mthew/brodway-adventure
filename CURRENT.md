# Estado actual

> Máximo 50 líneas. Al rebasarlo, se archiva en `history/` (ver `CLAUDE.md` §Flujo de trabajo).

**Actualizado:** 2026-08-04 · **Fase:** 1 (MVP) · **Plan:** [`docs/product/plan-fase-1.md`](docs/product/plan-fase-1.md)

## En qué punto va

| Paso | Estado | Rama / PR |
|---|---|---|
| 0 · Desbloqueo del entorno | ✅ Hecho | `fase-1` |
| 1 · Modelo de oferta extendido | ✅ Hecho | `fase-1` |
| 2 · `LeadForm` + `/gracias` | ⏭️ Siguiente | — |
| 3 · `/paquetes` + `/paquetes/[slug]` | Pendiente | — |
| 4 · Home | Pendiente | — |
| 5 · Institucionales (`/nosotros`, `/contacto`, `/como-pagar`, `/faq`) | Pendiente | — |
| 6 · `/destinos` + `/destinos/[slug]` | Pendiente | — |
| 7 · `/lp/[campana]` | Pendiente | — |
| 8 · Tracking + consentimiento de cookies | Pendiente (parcialmente bloqueado) | — |
| 9 · Pre-Flight + sitemap | Pendiente | — |

## Lo que hay que saber para no romper nada

- **Node 24.14.1 obligatorio.** Si tu shell tiene otra, usa
  `export PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH"`.
- **No correr `shadcn init`.** Sobrescribe `lib/utils.ts` y `button.tsx`, e instala
  `lucide-react` y `tw-animate-css`. Se probó y se revirtió el 2026-08-04. Detalle en
  `plan-fase-1.md` §4 Paso 0. Para primitivas accesibles: `radix-ui` directo, wrapper a mano.
- **`pnpm check:tokens`** corre dentro del `build` y protege el fallo de contraste mudo.
- Páginas construidas hasta ahora: solo `/legal` y `/design-system`. La home es un placeholder.

## Bloqueos externos (ninguno se resuelve con código)

Contrato de `/api/lead` sin firmar con quien monte GoHighLevel (los campos de GHL no se pueden
convertir después de creados) · datos legales reales, hoy todos `XXXXXX` · número de WhatsApp
`57XXXXXXXXXX`, o sea que todos los CTA son enlaces muertos · consentimiento sin validar por
abogado · tiempo de respuesta que promete `/gracias` · marca (tipografías, hex, foto, logo SVG) ·
titularidad de cuentas. Impacto de cada uno en `plan-fase-1.md` §5.

## Decisiones abiertas

- **Alcance de la ficha de paquete** (`plan-fase-1.md` §3.1): `fases-entrega.md` pide itinerario
  resumido y manda el día a día a Fase 2; `brief-v0.md` pide el día a día completo. Se sigue el
  primero, con el dato modelado entero por si se revierte.
- `.agents/`, `.claude/`, `.codex/` (8.5 MB de skills) sin trackear: falta decidir si entran.
