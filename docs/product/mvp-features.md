# BroWay Adventures — Features MVP (Next.js / Vercel)

## Nota sobre el stack

El informe de investigación recomienda WordPress como base, pero descarta Next.js headless por "sobredimensionado para el MVP" bajo el supuesto de que se necesita gestión masiva de contenido sin developer. Como el proyecto ya define Next.js + Vercel como stack, este documento traduce las mismas prioridades de negocio (captación de leads calificados vía pauta paga) a una arquitectura Next.js, sin perder ninguno de los elementos que el informe marca como críticos para conversión.

Ventajas que compensan lo que se pierde de WordPress: Next.js en Vercel da velocidad sub-1s casi gratis (SSG/ISR, Edge, imágenes optimizadas), que es el factor #1 de conversión según el informe (83% del tráfico es móvil, 1s de demora puede costar hasta 20% de conversión). El contenido (destinos, paquetes, blog) se gestiona vía un headless CMS para no perder la agilidad editorial de WordPress.

## Objetivo del MVP

Convertir tráfico pago (Google, Meta, TikTok) en leads calificados, vía WhatsApp y formulario corto, con tracking server-side confiable y cumplimiento legal colombiano. No es un MVP de e-commerce/reservas online; es un MVP de captación.

## Dónde encaja este sitio (leer antes que el resto)

El sitio **no es el sistema comercial**: es una de seis fuentes de captación (Meta Lead Ads, Google Lead Forms, web, Click-to-WhatsApp, WhatsApp orgánico, referidos) que alimentan **GoHighLevel**, el CRM y la fuente de verdad comercial — ver [`sistema-comercial.md`](../research/sistema-comercial.md).

Lo que el sitio sí hace: activo de confianza, catálogo de destinos y ofertas, captación, precalificación ligera, **punto de autorización de datos**, fuente de audiencias de remarketing, y puente hacia WhatsApp con contexto.

Lo que el sitio **no** hace: no cotiza, no compara mayoristas, no puntúa leads, no gestiona el pipeline y no dispara los eventos de embudo posteriores al lead. Todo eso vive en el CRM y en el agente. Diseñar el sitio como si fuera el dueño del embudo duplica datos y rompe la atribución.

## Features del MVP (priorizadas por impacto, según el informe)

### 1. Home + Landing pages de destino (3-6 iniciales)
- Rutas estáticas generadas con SSG/ISR: `/`, `/destinos/[slug]`, `/lp/[campana]`.
- Message match: cada landing de campaña refleja el ángulo exacto del anuncio (headline, imagen, oferta) para evitar el "handoff penalty" (40-60% de abandono si no coincide).
- Mobile-first, copy nivel 5º-7º grado, video vertical, prueba social above the fold.
- Contenido editable vía CMS headless (ver sección Stack) sin tocar código para nuevas landings de campaña.

### 2. Ficha de paquete (`/paquetes/[slug]`)
- **Cada paquete publicado es una oferta con `offerId` y vigencia.** No es un precio escrito a mano en el CMS: arrastra ciudad de salida, ocupación base usada para calcular el precio, mayorista fuente, `vigenciaHasta` y `validadaEl`. Cuando la vigencia expira la página **no** se cae ni miente: muestra el estado de tarifa vencida con CTA de recotización (ver `spec-tecnica.md` §8.4). El `offerId` viaja en el link de WhatsApp y en el payload de `/api/lead`.
- **Bloque de disclosure junto al precio** (obligatorio, no letra chica): "desde $X por persona", ciudad de salida, noches, ocupación, qué incluye, "Tarifa verificada el [fecha], sujeta a disponibilidad y reconfirmación", y el RNT. Exigido por la normativa de publicidad de prestadores turísticos.
- Above the fold: título + beneficio en <12 palabras, galería/hero, "desde $", fechas de salida, CTA primario.
- Highlights en bullets.
- Itinerario día a día (componente acordeón/tabs, con mapa opcional).
- "Qué incluye / qué no incluye".
- Precios + fechas de salida + cupos disponibles (dato editable en CMS, sin countdown falso).
- Formas de pago / financiación ("Sepáralo con 30%, cuotas sin interés").
- Políticas de cancelación, FAQ (con schema `FAQPage`), reseñas, mapa.
- Formulario corto (máx. 4 campos) + botón WhatsApp con mensaje pre-llenado dinámico (incluye destino/paquete). Los campos no son libres: deben ser los que alimentan el scoring del CRM. Destino y `offerId` salen implícitos del contexto de página, así que los cuatro visibles son **Nombre · WhatsApp · Ciudad de salida · Fecha aproximada + nº de viajeros**. El presupuesto lo pregunta el agente en conversación (demasiada fricción en formulario). El teléfono se normaliza a E.164 en el servidor para que funcione la deduplicación de contactos en el CRM.
- Trust badges (RNT, testimonios, reseñas Google).

### 3. WhatsApp como CTA dominante
- Botón flotante sticky en todo el sitio.
- Links `wa.me` con mensaje pre-llenado por página/campaña (ej. incluye el slug del paquete o UTM de origen).
- Integración con Meta Click-to-WhatsApp Ads (CTWA): la landing debe soportar parámetros de campaña para trazabilidad del origen del lead.
- CTAs secundarios de baja fricción: "Ver itinerario", "Descargar PDF", "Consultar fechas y precios".

### 4. Sellos de confianza y cumplimiento legal
- Footer + página `/nosotros`: RNT visible, ANATO/IATA si aplica, reseñas de Google embebidas.
- Página `/legal`: política de tratamiento de datos (Ley 1581 de 2012), términos y condiciones, política de cancelación, aviso ESCNNA (Ley 679/2001).
- Formularios con checkbox de autorización de datos NO pre-marcado (requisito legal), texto de finalidad claro. La finalidad debe cubrir **explícitamente la publicidad personalizada** si los leads van a alimentar audiencias de Meta — "contacto comercial para asesoría de viaje" no alcanza para eso.
- **Registro de la evidencia del consentimiento**, no solo el checkbox: el payload guarda texto aceptado, versión de la política, fecha/hora, página o formulario de origen, identificador técnico, canales autorizados, fuente del lead y estado de revocación (contrato en `spec-tecnica.md` §8.3).
- Mención del **Registro de Números Excluidos (RNE)** en `/legal`: la persona puede excluirse de mensajería comercial; enviar el formulario no equivale a autorizar campañas indefinidas por todos los canales.
- Mensajería anti-fraude ("verifica el RNT antes de reservar") en home/footer.

### 5. Tracking server-side desde el día 1

**Quién dispara qué (decidir esto antes de escribir el primer pixel).** El embudo no vive en el sitio: `QualifiedLead`, `QuoteRequested`, `QuoteSent`, `BookingStarted`, `DepositPaid` y `Sale` ocurren en el CRM, y GoHighLevel puede emitirlos a Meta CAPI y a conversiones offline de Google vía workflows. El reparto:

| Evento | Lo emite |
|---|---|
| `ViewContent` / vista de oferta | Sitio (client-side) |
| `Lead` (formulario enviado / clic a WhatsApp) | Sitio (`/api/lead`, server-side) |
| `QualifiedLead` → `Sale` | GoHighLevel |

Ambos lados comparten el mismo `event_id` (generado en `/api/lead` y enviado al CRM en el payload) y un `external_id` estable por contacto. Sin eso las conversiones se duplican y la optimización de campaña se degrada. Consecuencia práctica: `/api/meta-capi` y `/api/tiktok-events` se reducen a emitir el `Lead` inicial — todo lo demás sale del CRM, no de Next.js.

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

> Las versiones exactas del entorno (Node 24.14.1, pnpm 10.34.3, Next.js 16, React 19,
> Tailwind v4) y sus consecuencias en el código están en
> [`spec-tecnica.md`](../architecture/spec-tecnica.md) §2.0 y §2.1.1 — esa es la fuente de verdad.

| Capa | Herramienta | Nota |
|---|---|---|
| Framework | Next.js 16 (App Router) + React 19 | SSG/ISR para landings y fichas de paquete; Turbopack por defecto |
| Estilos | Tailwind CSS v4 + shadcn/ui | Tokens CSS-first con `@theme`, sin `tailwind.config` |
| Hosting | Vercel | Edge Network, Image Optimization, Analytics |
| CMS de contenido | Headless (Sanity, Contentful o Strapi) | Solo contenido **editorial**: destinos, blog, copy de landings. Las tarifas **no** viven aquí (ver Base de ofertas) |
| Base de ofertas | BD estructurada externa (fuera de este repo) | Fuente de verdad de tarifas: mayorista, `offerId`, ocupación, vigencia, validación, margen. El sitio consume solo ofertas **aprobadas y vigentes** |
| CRM | **GoHighLevel** (Starter + add-on de WhatsApp) | Decidido en [`sistema-comercial.md`](../research/sistema-comercial.md). Modelo Contacto↔Oportunidad. Sustituye a Kommo/Leadsales/HubSpot, que quedan descartados |
| Formularios/Leads | API routes de Next.js → webhook a GoHighLevel | `/api/lead` propio (control del consentimiento, validación server-side, rendimiento), **no** formularios embebidos por iframe del CRM |
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
/paquetes                            → Listado de ofertas vigentes ("ofertas destacadas")
/paquetes/[slug]                     → Ficha de paquete = ficha de oferta (offerId + vigencia)
/lp/[campana]                        → Landing dedicada por campaña de pauta
/gracias                             → Confirmación post-lead: dispara la conversión, fija
                                       la expectativa de respuesta y puentea a WhatsApp con
                                       contexto. No indexada
/faq                                 → Preguntas frecuentes globales (las de paquete/destino
                                       siguen en su propia página)
/como-pagar                          → Financiación / cuotas
/nosotros                            → Confianza, RNT, ANATO
/blog                                → Fase 2, pero dejar la ruta reservada
/contacto                            → WhatsApp + formulario
/legal                               → Política de datos, términos, cancelación, RNT, ESCNNA, RNE
/api/lead                            → API route: recibe formulario, valida, normaliza el
                                       teléfono a E.164, registra el consentimiento y envía
                                       a GoHighLevel + emite el evento Lead
/api/meta-capi                       → API route: Meta Conversions API
/api/tiktok-events                   → API route: TikTok Events API
```

## Riesgos / decisiones a validar antes de construir

**Abiertos con el cliente (bloquean decisiones de arquitectura):**

- **CMS vs. base de ofertas: quién es dueño de la tarifa.** El sitio asumía un CMS headless para paquetes; `sistema-comercial.md` exige una base de ofertas relacional externa con vigencia, validación humana y margen — y dice explícitamente que el CRM no sirve para eso. Si nadie decide, la misma tarifa se captura dos veces. Propuesta: base de ofertas = fuente de verdad de tarifas, el sitio consume solo ofertas aprobadas y vigentes; CMS = solo contenido editorial. Falta confirmarlo y definir cómo las lee el sitio (API, export programado, o sincronización al CMS).
- **¿Sigue el inglés en alcance?** `sistema-comercial.md` es 100% mercado colombiano y nunca menciona EN. El bilingüismo desde Fase 0 (`spec-tecnica.md` §3) tiene un costo que ese roadmap no presupuestó: plantillas de WhatsApp aprobadas en dos idiomas, contenido duplicado en el CMS y enrutamiento de asesor por idioma. Decisión de negocio, no técnica.
- **¿Quién construye el sitio?** `sistema-comercial.md` presupuesta "página web y ofertas: 2-3 semanas" sobre el supuesto de **"sitio actual conectado con HighLevel"** — es decir, conectar formularios y tracking a una web existente, no construir un Next.js 16 bilingüe con design system desde cero (que es lo que describe `spec-tecnica.md` §7). Es una desalineación de esfuerzo y presupuesto que conviene resolver antes de arrancar, no en la semana 6. Si el sitio lo construye este proyecto, hay que escribir la frontera: aquí se entrega el sitio + `/api/lead` con contrato de payload documentado; del otro lado el proveedor conecta el CRM.
- **Titularidad de las cuentas.** El roadmap exige que dominio, GA4, GTM, pixel, datasets y **repositorio** estén a nombre del cliente. Hoy el repo vive en una cuenta personal (`Mthew/brodway-adventure`, además con el nombre mal escrito). Resolver antes del primer deploy.

**Técnicos:**

- Elegir el CMS headless (Sanity vs Contentful vs Strapi) según presupuesto y quién va a editar contenido (equipo de marketing sin código vs. developer) — después de resolver la frontera CMS/base de ofertas de arriba.
- Acordar con quien monte GoHighLevel el contrato de `/api/lead` (campos, `offerId`, `event_id`, campos de consentimiento) **antes** de codificar el formulario: los campos de contacto y de oportunidad en GHL no se pueden convertir de un tipo al otro una vez creados.
- Confirmar con Wompi/PayU el flujo de integración exacto (checkout hospedado vs. widget embebido) antes de diseñar el componente de pago.
- Definir si el tracking server-side se monta con GTM Server-Side (requiere un contenedor adicional en un servidor, ej. Google Cloud Run) o si las API routes de Next.js bastan para el volumen inicial — para un MVP, las API routes propias son más simples y suficientes.
- Verificar el número de RNT y datos legales reales de BroWay Adventures antes de publicar el footer/página legal.
