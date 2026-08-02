# BroWay Adventures — Fases de entrega (Next.js / Vercel)

Basado en el análisis de investigación y en el alcance definido: (1) darle seriedad/credibilidad a la empresa con un sitio web propio, (2) landing pages para captar leads de pauta paga, y (3) campañas con CTA directo a WhatsApp.

---

## Fase 1 — MVP (lanzamiento y seriedad de marca)

**Objetivo:** tener un sitio publicado que dé credibilidad institucional y ya pueda recibir tráfico pago con CTA a WhatsApp. Sin pagos online ni automatizaciones avanzadas todavía.

**Sitio corporativo (da seriedad):**
- Home con propuesta de valor, destinos destacados, trust badges.
- `/nosotros` — historia, RNT visible, afiliaciones (ANATO/IATA si aplica).
- `/destinos` + `/destinos/[slug]` — páginas por destino (3-6 iniciales).
- `/contacto` — WhatsApp + formulario corto.
- `/legal` — política de tratamiento de datos (Ley 1581 de 2012), términos, ESCNNA.

**Captación de leads (landings + WhatsApp):**
- `/lp/[campana]` — landing dedicada por campaña, con *message match* (mismo destino/oferta/visual del anuncio).
- Ficha de paquete básica (`/paquetes/[slug]`): galería, "desde $", itinerario resumido, qué incluye/no incluye, CTA.
- Botón WhatsApp flotante sticky en todo el sitio, con mensaje pre-llenado según página/campaña.
- Formulario corto (2-4 campos) como alternativa a WhatsApp para leads que prefieren no chatear.

**Campañas con CTA a WhatsApp:**
- Links `wa.me` parametrizados por campaña (para poder identificar origen manualmente).
- GA4 + Meta Pixel + TikTok Pixel (client-side) con evento de clic en WhatsApp y `generate_lead`.
- Banner de consentimiento de cookies (Consent Mode v2).

**Rendimiento y base técnica:**
- Next.js con SSG/ISR, `next/image`, deploy en Vercel.
- Mobile-first, velocidad sub-2s.
- SEO básico: metadata dinámica, sitemap.xml, robots.txt.

**Fuera de esta fase:** pagos online, CRM, tracking server-side (CAPI/Events API), quiz, blog, cupos en tiempo real.

---

## Fase 2 — Escalamiento de captación y conversión

**Objetivo:** una vez el MVP esté validado con tráfico real, subir la tasa de conversión y la calidad de atribución, y facilitar el cierre de venta.

**Conversión y ficha de paquete completa:**
- Itinerario día a día con mapa, fechas de salida y cupos disponibles (editable, sin countdown falso).
- FAQ con schema, reseñas, políticas de cancelación.
- Financiación visible: "Sepáralo con el 30%, cuotas sin interés".

**Pagos:**
- Integración con Wompi o PayU para generar el link de pago del 30% de abono (enviado por WhatsApp o desde la web).

**Tracking server-side confiable:**
- Meta Conversions API (CAPI) vía API route de Next.js, con `event_id` para deduplicación.
- TikTok Events API (mismo patrón).
- Persistencia de UTMs desde landing hasta el evento de lead.

**Gestión de leads:**
- CRM conversacional (Kommo o Leadsales) conectado por webhook desde el formulario y desde WhatsApp.
- Etiquetado automático del lead con la campaña de origen.
- Quiz "encuentra tu viaje ideal" + lead magnets en PDF, para segmentar leads que aún no están listos para WhatsApp.

**Contenido y SEO:**
- Blog de viajes (reaprovechando contenido de redes/reels).
- Schema completo: `TouristTrip`, `Product`+`Offer`, `FAQPage`, `Review`, `LocalBusiness`.
- Más landings por campaña + primeras pruebas A/B (headline, CTA, oferta).

**CMS headless:**
- Migrar la edición de destinos/paquetes/blog a un CMS (Sanity, Contentful o Strapi) para que marketing publique sin developer.

---

## Fase 3 — Roadmap de largo plazo

**Objetivo:** convertir el sitio en una plataforma de reserva y fidelización, no solo de captación.

- **Booking engine con cupos y salidas en tiempo real**, reserva online parcial o completa (evaluar Trekksoft, Bókun o Checkfront vs. desarrollo propio).
- **Programa creator-led** (estilo TrovaTrip) si el modelo de pauta se expande a influencers: itinerarios de biblioteca, margen del creador, pagos y soporte gestionados por BroWay Adventures.
- **Personalización dinámica y remarketing avanzado**: contenido y ofertas según comportamiento del usuario, audiencias de remarketing por destino visitado.
- **App/portal de cliente**: seguimiento de reserva, documentos de viaje, soporte 24/7 post-compra.
- **Lead scoring avanzado** y automatizaciones de nurturing en el CRM.

---

## Umbrales para decidir cuándo avanzar de fase

- Pasar de Fase 1 a Fase 2 cuando: el sitio ya recibe tráfico pago sostenido y se necesita saber qué campaña/canal convierte mejor (es decir, cuando la atribución client-side empieza a quedarse corta) o cuando el volumen de "separar viaje" justifica automatizar el cobro del 30%.
- Pasar de Fase 2 a Fase 3 cuando: el volumen de reservas justifica gestionar cupos en tiempo real, o cuando se decide activar el canal de creadores/influencers como fuente de tráfico adicional.
- Si en cualquier fase la conversión de landing cae por debajo del 2%, priorizar ajustes de velocidad/mensaje antes de avanzar de fase o aumentar pauta.
