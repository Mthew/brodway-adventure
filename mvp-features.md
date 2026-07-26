# Brosway Adventure — Features MVP (Next.js / Vercel)

## Nota sobre el stack

El informe de investigación recomienda WordPress como base, pero descarta Next.js headless por "sobredimensionado para el MVP" bajo el supuesto de que se necesita gestión masiva de contenido sin developer. Como el proyecto ya define Next.js + Vercel como stack, este documento traduce las mismas prioridades de negocio (captación de leads calificados vía pauta paga) a una arquitectura Next.js, sin perder ninguno de los elementos que el informe marca como críticos para conversión.

Ventajas que compensan lo que se pierde de WordPress: Next.js en Vercel da velocidad sub-1s casi gratis (SSG/ISR, Edge, imágenes optimizadas), que es el factor #1 de conversión según el informe (83% del tráfico es móvil, 1s de demora puede costar hasta 20% de conversión). El contenido (destinos, paquetes, blog) se gestiona vía un headless CMS para no perder la agilidad editorial de WordPress.

## Objetivo del MVP

Convertir tráfico pago (Google, Meta, TikTok) en leads calificados, vía WhatsApp y formulario corto, con tracking server-side confiable y cumplimiento legal colombiano. No es un MVP de e-commerce/reservas online; es un MVP de captación.

## Features del MVP (priorizadas por impacto, según el informe)

### 1. Home + Landing pages de destino (3-6 iniciales)
- Rutas estáticas generadas con SSG/ISR: `/`, `/destinos/[slug]`, `/lp/[campana]`.
- Message match: cada landing de campaña refleja el ángulo exacto del anuncio (headline, imagen, oferta) para evitar el "handoff penalty" (40-60% de abandono si no coincide).
- Mobile-first, copy nivel 5º-7º grado, video vertical, prueba social above the fold.
- Contenido editable vía CMS headless (ver sección Stack) sin tocar código para nuevas landings de campaña.

### 2. Ficha de paquete (`/paquetes/[slug]`)
- Above the fold: título + beneficio en <12 palabras, galería/hero, "desde $", fechas de salida, CTA primario.
- Highlights en bullets.
- Itinerario día a día (componente acordeón/tabs, con mapa opcional).
- "Qué incluye / qué no incluye".
- Precios + fechas de salida + cupos disponibles (dato editable en CMS, sin countdown falso).
- Formas de pago / financiación ("Sepáralo con 30%, cuotas sin interés").
- Políticas de cancelación, FAQ (con schema `FAQPage`), reseñas, mapa.
- Formulario corto (2-4 campos máx.) + botón WhatsApp con mensaje pre-llenado dinámico (incluye destino/paquete).
- Trust badges (RNT, testimonios, reseñas Google).

### 3. WhatsApp como CTA dominante
- Botón flotante sticky en todo el sitio.
- Links `wa.me` con mensaje pre-llenado por página/campaña (ej. incluye el slug del paquete o UTM de origen).
- Integración con Meta Click-to-WhatsApp Ads (CTWA): la landing debe soportar parámetros de campaña para trazabilidad del origen del lead.
- CTAs secundarios de baja fricción: "Ver itinerario", "Descargar PDF", "Consultar fechas y precios".

### 4. Sellos de confianza y cumplimiento legal
- Footer + página `/nosotros`: RNT visible, ANATO/IATA si aplica, reseñas de Google embebidas.
- Página `/legal`: política de tratamiento de datos (Ley 1581 de 2012), términos y condiciones, política de cancelación, aviso ESCNNA (Ley 679/2001).
- Formularios con checkbox de autorización de datos NO pre-marcado (requisito legal), texto de finalidad claro.
- Mensajería anti-fraude ("verifica el RNT antes de reservar") en home/footer.

### 5. Tracking server-side desde el día 1
- Google Tag Manager (server-side container recomendado, o al menos client-side robusto en MVP).
- Meta Pixel + Conversions API (CAPI) con `event_id` para deduplicación — requiere un endpoint API route en Next.js (`/api/meta-capi`) que reenvíe el evento server-side.
- TikTok Pixel + Events API (mismo patrón, `/api/tiktok-events`).
- GA4 con evento `generate_lead` marcado como conversión.
- Evento de clic en WhatsApp como conversión (dispara al hacer click en el link `wa.me`).
- UTMs propagados y persistidos (ej. en cookie o localStorage) desde landing hasta el evento de lead, para no perder atribución server-side.
- Consent Mode v2 (banner de cookies) antes de disparar pixeles.

### 6. Pasarela de pago para "separar con 30%"
- Integración con Wompi o PayU (ambas tienen APIs/checkout embebible; Wompi es más simple de integrar en un proyecto Next.js vía su Widget/Checkout web).
- Flujo: desde la ficha de paquete o desde WhatsApp, generar un link de pago del 30% del valor del paquete.
- No requiere gestión de cupos/inventario en tiempo real para el MVP — el asesor confirma disponibilidad por WhatsApp antes de enviar el link.

### 7. Velocidad móvil sub-2s (objetivo real: sub-1s)
- Next.js SSG/ISR para todas las páginas de contenido (home, destinos, paquetes, blog).
- Imágenes optimizadas con `next/image`, formatos AVIF/WebP.
- Deploy en Vercel Edge Network.
- Fuente y CSS mínimos, sin JS bloqueante de terceros (cargar pixeles con `next/script` `strategy="lazyOnload"` o server-side donde sea posible).

### 8. SEO base
- Metadata dinámica por página (Next.js Metadata API).
- Schema.org: `TouristTrip`/`Product`+`Offer` en fichas de paquete, `FAQPage`, `LocalBusiness` en home, `BreadcrumbList`.
- Sitemap.xml y robots.txt generados automáticamente.
- SEO local: Google Business Profile (fuera del código, pero enlazado desde el sitio).

## Stack técnico propuesto

| Capa | Herramienta | Nota |
|---|---|---|
| Framework | Next.js (App Router) | SSG/ISR para landings y fichas de paquete |
| Hosting | Vercel | Edge Network, Image Optimization, Analytics |
| CMS de contenido | Headless (Sanity, Contentful o Strapi) | Para que el equipo de marketing edite destinos/paquetes/blog sin developer — reemplaza la ventaja "editorial" de WordPress |
| Formularios/Leads | API routes de Next.js → CRM | Enviar a Kommo/Leadsales/HubSpot vía webhook |
| Pagos | Wompi o PayU | Checkout embebido o link de pago generado por API route |
| Tracking | GTM + Meta CAPI + TikTok Events API + GA4 | CAPI/Events API implementados como API routes serverless en Vercel |
| WhatsApp | Meta WhatsApp Business API / CTWA | Links `wa.me` con mensaje dinámico; automatización de etiquetado de campaña de origen en el CRM |

## Fuera del alcance del MVP (Fase 2 / Roadmap, según el informe)

- Quiz "encuentra tu viaje ideal" y lead magnets en PDF.
- CRM conversacional con lead scoring automatizado.
- Blog con reaprovechamiento de contenido de redes.
- Countdown/escasez real basada en cupos dinámicos.
- Landings A/B testing con herramientas externas (Unbounce/Landingi) — en Next.js esto se puede resolver más adelante con feature flags o Vercel Edge Config.
- Booking engine con gestión de cupos/salidas en tiempo real y reserva online completa.
- Programa creator-led estilo TrovaTrip.
- App/portal de cliente.

## Sitemap propuesto (rutas Next.js)

```
/                                    → Home
/destinos                            → Listado de destinos
/destinos/[slug]                     → Página de destino (nacional o internacional)
/paquetes/[slug]                     → Ficha de paquete
/lp/[campana]                        → Landing dedicada por campaña de pauta
/como-pagar                          → Financiación / cuotas
/nosotros                            → Confianza, RNT, ANATO
/blog                                → Fase 2, pero dejar la ruta reservada
/contacto                            → WhatsApp + formulario
/legal                               → Política de datos, términos, cancelación, RNT, ESCNNA
/api/lead                            → API route: recibe formulario, envía a CRM + dispara conversión
/api/meta-capi                       → API route: Meta Conversions API
/api/tiktok-events                   → API route: TikTok Events API
```

## Riesgos / decisiones a validar antes de construir

- Elegir el CMS headless (Sanity vs Contentful vs Strapi) según presupuesto y quién va a editar contenido (equipo de marketing sin código vs. developer).
- Confirmar con Wompi/PayU el flujo de integración exacto (checkout hospedado vs. widget embebido) antes de diseñar el componente de pago.
- Definir si el tracking server-side se monta con GTM Server-Side (requiere un contenedor adicional en un servidor, ej. Google Cloud Run) o si las API routes de Next.js bastan para el volumen inicial — para un MVP, las API routes propias son más simples y suficientes.
- Verificar el número de RNT y datos legales reales de Brosway Adventure antes de publicar el footer/página legal.
