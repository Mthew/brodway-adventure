# 003 · Datos reales del cliente y tipografías de marca

**Archivado el 2026-08-05.** El cliente entregó los datos que llevaban bloqueando la publicación
desde la Fase 0. Se archiva el detalle porque ya está aplicado en el código; en `CURRENT.md`
queda sólo lo que sigue abierto.

## Lo que se confirmó

| Dato | Valor | Dónde vive |
|---|---|---|
| WhatsApp | `573054513307` (E.164 sin `+`) | `lib/config.ts` |
| RNT | 297515 | `lib/config.ts`, footer, bloque de precio, `/nosotros`, `/legal` |
| NIT | 1040742725-1 | `lib/config.ts`, `/nosotros` |
| Dirección | Cl 2B Sur #78B-06, Medellín | `lib/config.ts`, `/contacto` |
| Teléfono | 305 4513307 | `lib/config.ts`, `/contacto` |
| Primera respuesta | Entre 1 y 5 minutos | `/gracias`, `/contacto`, microcopy |
| Frontera CMS | **No existe** | El contenido editorial se queda en el repositorio |

El desbloqueo de mayor impacto fue el número de WhatsApp: 16 archivos dependían de él y hasta ese
momento **todos los CTA del sitio eran enlaces muertos**.

El cliente entregó la dirección sin repetir la ciudad; se mantiene Medellín, que es la sede según
toda la documentación.

## La decisión de CMS queda cerrada

`spec-tecnica.md` §7.4 llevaba abierta la frontera CMS / base de ofertas desde la Fase 0. El
cliente responde que **no existe** ninguna de las dos hoy.

Consecuencia: el contenido editorial (destinos, campañas) sigue en el repositorio, que es
exactamente lo que `fases-entrega.md` ya preveía para la Fase 1. Y la arquitectura no cambia,
porque el acceso ya está encapsulado en `lib/destinations/`, `lib/offers/` y `lib/campaigns/`:
cuando aparezca la fuente real, cambia el interior de esas capas y ninguna página se toca.

Lo que **no** desaparece es el ciclo de vida de la oferta: `offerId`, `vigenciaHasta` y
`validadaEl` siguen siendo obligatorios aunque hoy los escriba una persona en un archivo. Una
tarifa sin vigencia es un problema regulatorio, no una comodidad de edición.

## Tipografías oficiales

Sustituyen a Outfit e Inter, que eran suplentes de la Fase 0.

| Familia | Uso | Pesos cargados |
|---|---|---|
| **Montserrat** | Títulos, navegación, botones, etiquetas | 600, 700, 800 |
| **Lato** | Párrafos, condiciones, FAQ, textos largos | 400, 700 |
| **Caveat** | Firma narrativa | 700 |

Sólo se cargan los pesos que el manual autoriza: cada peso extra es descarga que paga el 83% de
tráfico móvil.

**Lato no tiene SemiBold.** El manual lo recomienda, pero la familia salta de 400 a 700. Se cargan
esos dos en vez de sintetizar un peso intermedio, que es justo el tipo de deformación artificial
que el manual prohíbe.

### La escala, y por qué no es la del manual al pie de la letra

El manual da una escala de escritorio (H1 48/56, H2 36/44, H3 28/36, H4 22/30, cuerpo 18/28,
pequeño 14/20, botón 16/20). Un H1 de 48px no cabe en 375px, y el 83% del tráfico es móvil.

Los tokens usan `clamp()` con **el máximo del manual** y un mínimo de móvil, así que en escritorio
la escala es la del manual y en móvil se reduce sin contradecirlo.

### Dos incumplimientos que esto destapó

1. **`--text-caption` estaba en 13px** y el manual fija **14px como mínimo digital**. Se subió a
   14px. Afectaba a todas las páginas.
2. **Botones, navegación y etiquetas renderizaban en Lato**, cuando el manual asigna Montserrat
   SemiBold a los tres. Además el botón estaba a 15px contra los 16 del manual. Corregido en
   `button.tsx`, `badge.tsx` y `navbar.tsx`.

También se declaró en `globals.css` que los párrafos nunca se justifican, porque el manual lo
prohíbe y no puede depender de que nadie escriba `text-justify`.

## Dos fallos de accesibilidad que salieron de paso

Estaban ocultos porque las comprobaciones anteriores excluían el footer:

- El copyright usaba `text-white/50`, que sobre navy rinde **4.40:1** y no llega al 4.5 de AA.
  Subido a `/60`, que da 5.64:1.
- El enlace del banner de cookies medía 41px, bajo el mínimo táctil de 44px.

Sigue pendiente para el Paso 9 la deuda conocida: los **siete enlaces del footer miden 23px**.
