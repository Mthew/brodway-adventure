# Investigación y estrategia web para "BroWay Adventures" (Medellín, Colombia)

## TL;DR
- **Para un modelo de "contenido + pauta + lead", el sitio no es un catálogo: es una máquina de captación.** Debe combinar landing pages dedicadas por campaña con *message match*, WhatsApp como CTA dominante (canal de mayor intención en Colombia), fichas de paquete potentes con "desde $" y cuotas, y tracking server-side (Meta CAPI, TikTok Events API, GA4). La mediana de conversión de landings de turismo es 4.8% (Unbounce 2024) y el 83% del tráfico llega por móvil, así que la velocidad y el móvil-first son innegociables.
- **El MVP debe priorizar 8 elementos** (home + 3-6 landings de destino, ficha de paquete, WhatsApp click-to-chat, sellos de confianza RNT/ANATO/IATA, cumplimiento Ley 1581 de 2012, tracking base, pasarela para "separar con 30%", y velocidad móvil). Stack recomendado: **WordPress** como base (SEO a escala + catálogo + landings) con **Wompi o PayU** para el abono.
- **Los CTAs de baja fricción ganan** en turismo: "Cotiza por WhatsApp", "Recibe el itinerario", "Sepáralo con el 30% — cuotas sin interés". La urgencia **real** (cupos y fechas de salida) mejora conversión; la urgencia **falsa** (timers que se reinician) da un lift efímero pero daña la marca de forma permanente.

## Key Findings

1. **WhatsApp es el canal central en Colombia, no un extra.** Los anuncios click-to-WhatsApp (CTWA) en Meta llevan al usuario directo a un chat en lugar de a una landing lenta, reduciendo drásticamente el abandono frente a un formulario web. La cifra "98% de tasa de apertura" es la estadística de WhatsApp más copiada pero **carece de fuente primaria verificable**; benchmarks medidos con metodología ubican la apertura cerca del 68% (Bestow.in) y las tasas de clic/conversión entre 3-7% (estudio de KPIs de e-commerce de charles/Chatarmin, 2025, sobre 30+ marcas y 100.000+ conversaciones). Aun así, es el canal de mayor intención y menor fricción para este mercado.
2. **El benchmark de conversión de turismo es 4.8% (mediana, Unbounce 2024)**, ~37% por debajo de la mediana general de 6.6% (dato basado en 57 millones de conversiones, 41.000 landing pages y 464 millones de vistas). La mayoría de operadores desperdician tráfico pago enviándolo al home en vez de a landings dedicadas.
3. **La velocidad móvil es decisiva:** 83% del tráfico de landings es móvil; según Unbounce (2019), 1 segundo de demora en móvil puede reducir conversiones hasta 20% (Akamai reporta ~7% por cada segundo). Páginas bajo 1s convierten ~2.5x más que las de 5s+.
4. **Formularios cortos convierten más:** en el caso ImageScape (citado por Unbounce y Cobloom), reducir de 11 a 4 campos aumentó los formularios enviados 160% y la tasa de conversión 120%. Los quiz funnels convierten 30-50% vs 3-10% de un PDF estático (ScoreApp/KyLeads).
5. **El cumplimiento legal colombiano debe ser visible:** el RNT es obligatorio y se renueva anualmente (ene-mar); la Ley 1581 de 2012 exige autorización previa, expresa e informada para tratar los datos personales que capturan los formularios.
6. **La financiación a cuotas es factor de conversión clave** para ticket alto en Colombia. Aviatur (plan "Separe": 30% de abono, tarifa congelada, saldo en cuotas sin interés sin banco) y On Vacation lo lideran; agencias de Medellín (PlanesTurísticos, Planeta Turístico) replican "reserva con abono / cuotas sin interés".

## Details

### 1. Benchmark comparativo de sitios

**Agencias colombianas / de Medellín:**
- **Aviatur** (nacional, +60 años): buscador de vuelos/hoteles/paquetes; plan "Separe" (abona 30%, congela tarifa, paga el saldo en cuotas sin interés directamente con Aviatur, sin banco ni estudio de crédito); atención 24/7; cierre asistido por asesor. *Aplica mucho*: su modelo de financiación y "abono para paquetes" es directamente replicable.
- **On Vacation**: paquetes todo incluido, "reserva hoy y paga a cuotas sin interés" sin bancos. *Aplica*: mensaje de accesibilidad de precio.
- **Colombia de Lujo** (Medellín, CR 68 # 49A 29, RNT 45677): CTA WhatsApp repetido ~5 veces ("Cotiza ahora por WhatsApp"), links con mensaje pre-llenado, tabs Tours/Excursiones/Cruceros/Internacional, y mensajería anti-fraude explícita ("los montaviajes son un esquema de FRAUDE"). *Aplica mucho*: patrón WhatsApp-first + confianza.
- **PlanesTurísticos.com** (Medellín, RNT 126573): financiación como beneficio central ("Congele su plan con un abono y pague el saldo a cuotas sin intereses"), métodos de pago explícitos, asesor por WhatsApp, sellos IATA/ANATO/+25 años. *Aplica*: transparencia de pago + trust badges.
- **Planeta Turístico** (RNT 16285): "cuotas sin interés", "operamos bajo el RNT 16285, avalados por el Ministerio de Comercio", price-match, "cotización lista en pocas horas". *Aplica*: urgencia por velocidad de respuesta + garantía.
- **Viajes al Natural** (Medellín, RNT 217385) y **Univiajes**: flujo formulario→asesor ("llena un breve formulario y en minutos un asesor te contacta"). *Aplica*: captura de lead con formulario corto + handoff a WhatsApp.

**Referentes internacionales:**
- **GetYourGuide / Viator**: reseñas verificadas, cancelación gratis hasta 24h, reserva instantánea, app móvil. Confianza vía reviews (Viator integra TripAdvisor). *Aplica parcialmente*: son marketplaces de actividades, pero su ficha de producto (galería, reviews, "lo que incluye", badges de cancelación) es referencia de oro.
- **Exoticca** (Barcelona, 2013): digitaliza el paquete multi-día internacional; precio en tiempo real, checkout online, 430+ itinerarios, "Flex Cancellation" ($99), garantía de mejor precio, soporte 24/7 en app. *Aplica*: estructura de itinerario y opciones de cancelación/garantía.
- **Intrepid / G Adventures**: viajes grupales en grupos pequeños, enfoque en sostenibilidad, sin vuelos en la base. *Aplica*: formato grupal y presentación de "qué incluye/no incluye".
- **TrovaTrip** (creator-led, marketplace de 3 lados): el host (creador) elige un itinerario de biblioteca, fija su margen y lo promueve; Trova maneja pagos, formularios, seguro y soporte; hay encuesta de audiencia previa. *Aplica mucho al modelo "contenido + pauta"*: si BroWay trabaja con influencers, este es el modelo a estudiar.

### 2. Anatomía de la ficha de paquete (para convertir)

Componentes recomendados (basado en Xola, Bókun, Checkfront, TicketingHub y prácticas de GetYourGuide/Exoticca):
- **Above the fold**: título con destino + tipo de experiencia + beneficio en <12 palabras (ej. "Eje Cafetero 4 días: café y naturaleza con guía local"); galería/hero (video vertical ideal); "desde $" + fechas de salida; CTA primario.
- **Highlights** (lo mejor del viaje, en bullets, arriba).
- **Itinerario día a día** (máx 2-3 experiencias por día, con mapa de ruta y horarios).
- **Qué incluye / Qué NO incluye** (crítico para expectativas; Exoticca advierte sobre "actividades incluidas y sugeridas").
- **Precios**: lista + descuento; "desde $" por persona; opciones/add-ons.
- **Fechas de salida y cupos disponibles** (activador de escasez real).
- **Formas de pago y financiación** ("separa con 30%, cuotas sin interés").
- **Políticas** (cancelación, cambios), **FAQ** (con schema), **reseñas**, **mapa**.
- **Formulario corto** (2-4 campos) + CTA WhatsApp con mensaje pre-llenado.
- **Confianza**: RNT, testimonios en video, reseñas de Google.

### 3. Landing pages para tráfico pagado

- **Message match**: la landing debe reconocerse como la continuación del anuncio (mismo destino, oferta, visual). El "landing-page handoff penalty" para marcas sin tienda puede añadir 40-60% de abandono si no coincide.
- **Landing dedicada por campaña > página general**: los operadores que testean sistemáticamente ven 20-35% de mejora en semanas.
- **Velocidad móvil sub-1s**, diseño mobile-first (83% del tráfico), formulario corto, video vertical, prueba social above the fold.
- **Copy simple** (nivel de lectura 5º-7º grado convierte 11.1%, ~2x más que texto de nivel profesional, según Unbounce).
- **Benchmark de conversión turismo: 4.8% mediana** (Unbounce 2024); sobre 2% = top 20%; 3-4% = top 10% (Promodo 2026).

### 4. Call to Actions efectivos (sección específica solicitada)

**Principios:** CTA primario de alta visibilidad/contraste, ubicación sticky y repetido; CTAs de baja fricción para leads que aún no están listos para comprar; primera persona y emoción; urgencia REAL.

**Copys recomendados en español (listos para usar):**

*CTA primarios (conversión directa a lead):*
- "Cotiza por WhatsApp" / "Habla con un asesor ahora"
- "Recibe el itinerario completo por WhatsApp"
- "Sepáralo hoy con el 30% — cuotas sin interés"
- "Reserva tu cupo — quedan pocos"

*CTA secundarios / baja fricción:*
- "Ver itinerario día a día"
- "Descarga el itinerario en PDF"
- "Descubre tu viaje ideal" (quiz)
- "Consulta fechas y precios"

*Microcopy de apoyo:*
- "Respuesta en minutos, sin compromiso"
- "Te asesora un experto en viajes, no un bot"
- "Precio final claro antes de reservar"

*Urgencia/escasez (solo si es real):*
- "Solo quedan X cupos para la salida del [fecha]"
- "Tarifa congelada hasta [fecha]"
- "Últimos lugares en grupo pequeño"

**Evidencia:** los countdowns atados a una fecha real dan lifts de 8-32% (EasyApps, Shopify guide 2026) y un A/B test documentado de Best of the Best mostró +5% al usar un timer con fecha real vs. uno que se reinicia. Smart Insights confirma que mostrar "cuántos lugares quedan a x precio" funciona particularmente bien en viajes. *Nota:* la cifra a veces citada de "17.8% por mostrar stock" no es verificable con precisión (el caso CXL localizado mide +17.1% de ingreso por usuario en una prueba de página de categoría, no cupos al 17.8%); úsese con cautela. Advertencia central: la urgencia falsa genera lift a corto plazo pero daña la marca permanentemente — los usuarios en 2026 recargan la página para comprobar si el timer se reinicia.

### 5. Captación y gestión de leads

- **WhatsApp Business API + CTWA** como núcleo; widget click-to-chat y QR. Ventaja de costo real: según la documentación oficial de Meta, desde el 1 de noviembre de 2024 se pueden abrir conversaciones de servicio ilimitadas sin cargo, y una conversación por CTWA abre una ventana gratuita de 72 horas (respondiendo dentro de 24h). Automatización que etiqueta el lead con la campaña de origen y lo enruta al asesor.
- **Chatbot** para calificación 24/7 (caso SmarTravel, agencia de Cali con Kommo: +40% de presencia digital).
- **Quiz "encuentra tu viaje ideal"** (30-50% conversión vs 3-10% del PDF) para segmentar por destino/presupuesto/fechas.
- **Lead magnets**: itinerarios/guías en PDF, entregados en <2 minutos.
- **CRM conversacional**: Kommo o Leadsales (WhatsApp-first, ideal para PYME que cierra por chat); HubSpot si se quiere marketing+ventas integrado; Zoho/Pipedrive como alternativas. Automatizaciones de seguimiento y lead scoring (form inputs + clics).

### 6. Medición y tracking

- **GTM (web + server-side)** como hub central que distribuye eventos a Meta CAPI, TikTok Events API y GA4.
- **Meta Pixel + Conversions API** con `event_id` único para deduplicación (48h, mismo nombre de evento, sensible a mayúsculas).
- **TikTok Pixel + Events API** (deduplicación con event_id obligatoria).
- **GA4** con evento `generate_lead`; marcar como conversión.
- **Eventos de WhatsApp** (clic en botón, inicio de chat) como conversiones.
- **UTMs** en cada paso; el tracking server-side captura conversiones que el navegador pierde (30-50%).
- **Consentimiento de cookies (Consent Mode v2)** y **cumplimiento Ley 1581 de 2012**: autorización previa, expresa e informada; política de tratamiento de datos publicada; checkbox NO pre-marcado en formularios; finalidad clara; derechos de habeas data (consultar, actualizar, suprimir). La transferencia internacional de datos (ej. CRM alojado en EE.UU.) requiere autorización expresa del titular.

### 7. SEO y contenido

- **Páginas por destino** optimizadas para búsquedas de alta intención ("viaje a Eje Cafetero 4 días", "tour San Andrés todo incluido").
- **Blog de viajes** que reaprovecha el contenido de redes (los reels/TikToks se incrustan y transcriben).
- **Datos estructurados/schema**: `TouristTrip` (con itinerario como ItemList para multi-día), `Product`+`Offer` (precio/disponibilidad), `FAQPage`, `Review`, `BreadcrumbList`. El schema puede subir el CTR orgánico hasta ~35% y alimenta citaciones en IA (ChatGPT, Perplexity, AI Overviews).
- **SEO local para Medellín**: `LocalBusiness`, ficha de Google Business Profile, reseñas de Google.

### 8. Stack tecnológico y escalabilidad

- **WordPress** (recomendado como base): mejor para SEO a escala, catálogo de paquetes, plugins de booking, integración CRM, y creación de landings; ecosistema de +60.000 plugins; requiere mantenimiento activo. Ideal para el objetivo de contenido + muchas páginas de destino.
- **Webflow**: menor mantenimiento, iteración de diseño rápida, buena velocidad; menos flexible para booking/integraciones complejas y catálogos grandes.
- **Next.js headless**: máxima velocidad/SEO pero mayor costo y dependencia de desarrollador; sobredimensionado para el MVP.
- **Shopify**: fuerte en e-commerce pero menos natural para paquetes de viaje/lead-gen.
- **Landings por campaña**: Unbounce/Landingi para lanzar rápido con message match y A/B testing.
- **Pasarelas de pago Colombia** (comisiones aproximadas, confirmar tarifa vigente): Wompi (Bancolombia; mejor API, Nequi, PSE ~1.49%, tarjeta ~2.99%+IVA), PayU (mayor cobertura, cuotas hasta 36 meses, ~3.19%), Mercado Pago (cuotas + base de usuarios), ePayco (PYME, económica), Bold (POS+online). Para "separar viaje" con abono: Wompi o PayU con links de pago enviables por WhatsApp.
- **Booking engines de industria**: Trekksoft, Bókun, Checkfront (para gestión de cupos/salidas si se escala a reserva online).

### 9. Elementos de confianza y cumplimiento

- **RNT visible** en el footer + página dedicada (obligatorio, renovable ene-mar cada año).
- **Afiliaciones**: ANATO (sello de garantía y calidad, con buscador de agencias asociadas), IATA (acceso a aerolíneas, credibilidad internacional).
- **Reseñas de Google**, testimonios en video, garantías (mejor precio, cancelación).
- **Políticas visibles**: tratamiento de datos, cancelación, términos y condiciones, prohibición ESCNNA (Ley 679/2001, obligatoria para prestadores turísticos en Colombia).
- **Anti-fraude**: mensajería sobre verificar la legalidad de la agencia (contexto real de "montaviajes"/estafas en Colombia, señalado por ANATO y medios).

## Recommendations

**MVP (lanzar y empezar a recibir pauta) — orden por impacto:**
1. Home + 3-6 landings de destino con message match (esfuerzo medio / impacto alto).
2. Ficha de paquete completa (galería, itinerario, incluye/no incluye, "desde $", fechas, cuotas, FAQ, formulario corto 2-4 campos) (medio / alto).
3. Botón WhatsApp flotante + CTWA con mensaje pre-llenado por campaña (bajo / alto).
4. Sellos de confianza (RNT, ANATO/IATA si aplica, reseñas Google) (bajo / alto).
5. Cumplimiento Ley 1581: política de datos + checkbox de autorización (bajo / obligatorio).
6. Tracking base: GTM + GA4 + Meta Pixel/CAPI + TikTok Pixel/Events API + evento WhatsApp (medio / alto).
7. Pasarela para "separar con 30%" (Wompi o PayU) (medio / alto).
8. Velocidad móvil sub-2s (medio / alto).

**Fase 2 (corto plazo):**
- Quiz "encuentra tu viaje ideal" + lead magnets PDF (medio / alto).
- CRM conversacional (Kommo/Leadsales) con automatización y lead scoring (medio / alto).
- Schema completo (TouristTrip, Product, FAQ, Review) (bajo / medio).
- Blog + reaprovechamiento de contenido de redes (medio / medio).
- Escasez real (cupos, countdown por fecha de salida) (bajo / medio).
- Landings por campaña con Unbounce y A/B testing (medio / alto).

**Roadmap (largo plazo):**
- Booking engine con cupos/salidas y reserva online parcial (alto / medio).
- Programa creator-led estilo TrovaTrip si el modelo adopta influencers (alto / alto).
- Personalización dinámica y remarketing avanzado (alto / medio).
- App/portal de cliente 24/7 (alto / bajo-medio).

**Umbrales que cambian las decisiones:**
- Si la conversión de landing < 2%, priorizar velocidad + message match + acortar formulario **antes** de gastar más en pauta.
- Si el CPL vía WhatsApp es menor que vía formulario, mover presupuesto a CTWA.
- Si el TikTok Ads Spark (creator-led) baja el CPA por debajo del in-feed, reasignar 40-60% del presupuesto creativo a Spark Ads.
- Si el tráfico orgánico crece, invertir más en schema + páginas de destino.

**Arquitectura de información / sitemap propuesto:**
```
/ (home)
/destinos
  /destinos/nacionales/[destino]      (ej. eje-cafetero, san-andres, cartagena)
  /destinos/internacionales/[destino]
/paquetes/[slug-paquete]              (ficha de paquete)
/lp/[campaña]                         (landings dedicadas por pauta)
/quiz                                 (encuentra tu viaje ideal)
/como-pagar                           (cuotas/financiación)
/nosotros                             (confianza, RNT, ANATO)
/blog                                 (contenido/SEO)
/contacto                             (WhatsApp + formulario)
/legal                               (política de datos, términos, cancelación, RNT, ESCNNA)
```

## Caveats
- Los benchmarks de conversión (Unbounce 4.8%, Promodo) son medianas agregadas; la conversión real depende del ticket y del tipo de acción (un lead de tour de $5.000 USD no es comparable a un newsletter).
- Las estadísticas de WhatsApp deben manejarse con cuidado: la cifra "98% de apertura" carece de fuente primaria; los datos medidos apuntan a ~68% de apertura y 3-7% de clic/conversión.
- Las cifras de TikTok Ads para viajes (p. ej., Etihad +17% en reservas, Traveloka, Hyatt) son reportadas por el anunciante/TikTok, no auditadas independientemente; los benchmarks de Digital Applied 2026 (Travel CPC in-feed $1.21, CVR 1.51%, CPA $80; Spark Ads convierten ~44% mejor; LATAM CPC ~$0.42) son datos compuestos/modelados: tratar como direccionales. El formato "Travel Ads" de TikTok (Smart+) se lanzó en septiembre de 2025.
- Los lifts de urgencia/escasez provienen mayormente de vendedores de herramientas CRO; los datos más sólidos son el A/B test +5% de Best of the Best y los rangos 8-32% de countdowns con fecha real; la cifra "17.8% por stock" no está verificada.
- Hay una inconsistencia en el RNT de PlanesTurísticos.com (aparece 126573 y 27384 en sus propias páginas): verificar el número real antes de citarlo como referencia.
- Las comisiones de pasarelas varían por volumen/negociación; confirmar la tarifa vigente con cada proveedor antes de decidir.
- Verificar los requisitos actuales del RNT y de la Ley 1581 con fuentes oficiales (MinCIT, SIC, Confecámaras) antes de lanzar, pues la normativa se actualiza.