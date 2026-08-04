# BroWay Adventures — Fases de entrega (Next.js / Vercel)

Basado en el análisis de investigación y en el alcance definido: (1) darle seriedad/credibilidad a la empresa con un sitio web propio, (2) landing pages para captar leads de pauta paga, y (3) campañas con CTA directo a WhatsApp.

## Dos líneas de tiempo en paralelo

Estas fases describen **el sitio web**. El sitio no se lanza en el vacío: corre en paralelo a la implementación del sistema comercial del cliente ([`sistema-comercial.md`](../research/sistema-comercial.md)), cuyo hito 2 de 11 es la fundación de GoHighLevel.

```
Sitio:            Fase 0 (base) ──> Fase 1 (MVP) ────────> Fase 2 ──> Fase 3
Sistema comercial:  GHL + WhatsApp ──> agente + scoring ──> ofertas + remarketing
                                        │
                              ▼ PAUTA SE ENCIENDE AQUÍ (no antes)
```

**La pauta no arranca cuando el sitio está publicado: arranca cuando el sistema atiende.** El roadmap del cliente marca como riesgo explícito "lanzar pauta antes del CRM → desperdicio de presupuesto", y exige que antes de la primera campaña funcionen captación, respuesta inicial, pipeline, atribución, scoring, transferencia humana y medición de conversiones. El sitio puede (y debe) publicarse antes de eso — da credibilidad institucional desde el día 1 y recibe tráfico orgánico y directo. Lo que espera es el gasto en anuncios.

---

## Fase 1 — MVP (lanzamiento y seriedad de marca)

**Objetivo:** tener un sitio publicado que dé credibilidad institucional y que **esté listo** para recibir tráfico pago con CTA a WhatsApp — el encendido de la pauta depende del gate de arriba, no de esta fase. Sin pagos online ni automatizaciones avanzadas todavía.

**Sitio corporativo (da seriedad):**
- Home con propuesta de valor, destinos destacados, trust badges.
- `/nosotros` — historia, RNT visible, afiliaciones (ANATO/IATA si aplica).
- `/destinos` + `/destinos/[slug]` — páginas por destino (3-6 iniciales).
- `/contacto` — WhatsApp + formulario corto.
- `/gracias` — confirmación post-lead (dispara la conversión, fija expectativa de respuesta, puentea a WhatsApp con contexto).
- `/faq` — preguntas frecuentes globales.
- `/legal` — política de tratamiento de datos (Ley 1581 de 2012), términos, ESCNNA, RNE.

**Captación de leads (landings + WhatsApp):**
- `/lp/[campana]` — landing dedicada por campaña, con *message match* (mismo destino/oferta/visual del anuncio).
- Ficha de paquete básica (`/paquetes/[slug]`): galería, "desde $", itinerario resumido, qué incluye/no incluye, CTA. Con `offerId`, vigencia, bloque de disclosure del precio y estado de tarifa vencida desde el principio — no es refinamiento de Fase 2: una tarifa publicada sin vigencia es un problema regulatorio y de conversión, no una mejora.
- Envío de leads a **GoHighLevel** por webhook desde `/api/lead`, con `offerId`, UTMs, `event_id` y el registro de consentimiento. El CRM lo monta el proveedor del sistema comercial; lo que esta fase entrega es el contrato del payload cumplido.
- Botón WhatsApp flotante sticky en todo el sitio, con mensaje pre-llenado según página/campaña.
- Formulario corto (2-4 campos) como alternativa a WhatsApp para leads que prefieren no chatear.

**Campañas con CTA a WhatsApp:**
- Links `wa.me` parametrizados por campaña (para poder identificar origen manualmente).
- GA4 + Meta Pixel + TikTok Pixel (client-side) con evento de clic en WhatsApp y `generate_lead`.
- Banner de consentimiento de cookies (Consent Mode v2).

**Rendimiento y base técnica:**
- Next.js 16 + React 19 con SSG/ISR, `next/image`, deploy en Vercel (versiones fijadas en [`spec-tecnica.md`](../architecture/spec-tecnica.md) §2.0).
- Mobile-first, velocidad sub-2s.
- SEO básico: metadata dinámica, sitemap.xml, robots.txt.

**Fuera de esta fase:** pagos online, tracking server-side de embudo (CAPI/Events API más allá del `Lead` inicial), quiz, blog, cupos en tiempo real.

**Ya no está fuera de esta fase:** el CRM. GoHighLevel se monta en paralelo desde el arranque (hito 2 del roadmap del cliente) y esta fase debe entregar el sitio ya conectado a él. Lo que sí sigue siendo de Fase 2 es lo que se construye *encima* del CRM: quiz, lead magnets, automatizaciones de nurturing.

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
- Meta Conversions API (CAPI) vía API route de Next.js para el evento `Lead`, con `event_id` para deduplicación.
- TikTok Events API (mismo patrón).
- Persistencia de UTMs desde landing hasta el evento de lead.
- Los eventos posteriores al lead (`QualifiedLead`, `QuoteSent`, `DepositPaid`, `Sale`) los emite **GoHighLevel**, no el sitio — comparten `event_id`/`external_id` con el `Lead` del sitio. Ver `mvp-features.md` §5.

**Gestión de leads:**
- GoHighLevel ya conectado desde Fase 1; en esta fase se construye encima: etiquetado automático de campaña de origen, Smart Lists, segmentos de remarketing y audiencias de Meta.
- Quiz "encuentra tu viaje ideal" + lead magnets en PDF, para segmentar leads que aún no están listos para WhatsApp.

**Contenido y SEO:**
- Blog de viajes (reaprovechando contenido de redes/reels).
- Schema completo: `TouristTrip`, `Product`+`Offer`, `FAQPage`, `Review`, `LocalBusiness`.
- Más landings por campaña + primeras pruebas A/B (headline, CTA, oferta).

**CMS headless:**
- Migrar la edición de destinos y blog a un CMS (Sanity, Contentful o Strapi) para que marketing publique sin developer. Las **tarifas** no migran aquí: viven en la base de ofertas (ver `mvp-features.md` §Stack).

**Pagos:**
- El evento `DepositPaid` lo dispara el CRM al confirmarse el abono, no la pasarela directamente contra Meta — la pasarela notifica a GoHighLevel y este emite la conversión, para que el embudo quede completo en un solo lugar.

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

**Gate 0 — encender la pauta.** Es anterior a todos los demás y no depende del sitio. No se gasta un peso en anuncios hasta que estén funcionando y probados: captación de las fuentes (Meta, Google, web, WhatsApp), respuesta inicial automática, pipeline con oportunidades, atribución de origen, scoring, transferencia a un asesor humano y medición de conversiones. Con el sitio publicado pero el CRM a medias, la pauta compra tráfico que nadie atiende y que no se puede medir.

- Pasar de Fase 1 a Fase 2 cuando: ya pasó el Gate 0, hay tráfico pago sostenido, y se necesita saber qué campaña/canal convierte mejor con calidad (no solo costo por lead sino costo por lead calificado y por cotización) — o cuando el volumen de "separar viaje" justifica automatizar el cobro del 30%.
- Pasar de Fase 2 a Fase 3 cuando: el volumen de reservas justifica gestionar cupos en tiempo real, o cuando se decide activar el canal de creadores/influencers como fuente de tráfico adicional.
- Si en cualquier fase la conversión de landing cae por debajo del 2%, priorizar ajustes de velocidad/mensaje antes de avanzar de fase o aumentar pauta.
