# Brecha: estructura funcional del cliente vs. documentación y código existentes

> Contraste de [`estructura-funcional-cliente.md`](estructura-funcional-cliente.md) (recibido del
> cliente el 2026-08-16) contra `docs/` y el estado real del repositorio en esa fecha. No es un
> plan de ejecución — eso se escribe en `plan-fase-1.md` cuando se decidan los puntos abiertos de
> abajo. Es el inventario de qué cambia y por qué.

## 0. Dónde encaja este documento

Es alcance funcional y arquitectura de información, firmado por el cliente. Su lugar es **por
encima de** `product/mvp-features.md` y `product/fases-entrega.md` (qué y cuándo se construye) y
**por debajo de** `architecture/spec-tecnica.md` (cómo se construye) — ver la regla de
precedencia en [`../README.md`](../README.md). No opina sobre stack, i18n ni sistema de diseño,
así que no colisiona ahí.

§38 y §39 del documento del cliente confirman el modelo que ya está en el repo: sitio =
mostrar/organizar/inspirar/informar/generar confianza/captar; GoHighLevel = gestión comercial del
lead. Es la misma tabla de `spec-tecnica.md` §8.1. Eso no se toca.

## 1. Conflictos duros (gana el documento del cliente)

### A. Panel administrativo — es Fase 1, no Fase 2 🔴 el más caro

El documento lo pone como objetivo del sitio (§1) y le dedica ocho secciones (§23-§30): crear
destinos, ofertas, imágenes, precios, fechas, vigencias, estados, colecciones y orden de
visualización, sin desarrollador. §13: *"Crear destino → asociarlo a Pueblos de Antioquia →
cargar oferta → publicar"*, *"esto permitirá modificar continuamente el inventario sin depender
del desarrollador"*.

Contra eso, hoy:

- `fases-entrega.md` pone "migrar la edición de destinos y blog a un CMS" en **Fase 2**.
- `plan-fase-1.md` §3.2 resuelve el conflicto CMS diciendo "en Fase 1, el contenido de destinos
  vive en el repositorio".
- Así está construido: `lib/mock/destinations.ts` y `lib/mock/offers.ts` son arrays en
  TypeScript. Cambiar un precio hoy es un commit y un deploy.

Lo que se salva: el encapsulamiento fue correcto. `lib/destinations/index.ts` y
`lib/offers/index.ts` son la única puerta a los datos, así que sustituir el origen no toca
ninguna página. Lo que falta es el otro lado: elegir CMS y construir el panel —
`mvp-features.md` todavía deja "elegir Sanity vs Contentful vs Strapi" sin decidir.

**No es un ajuste de documentación: es un bloque de trabajo nuevo dentro de la Fase 1.** Las
features concretas de ese panel — entidades, campos, flujos y la decisión que bloquea elegir
herramienta — están extraídas en [`backoffice-features.md`](backoffice-features.md).

### B. Tres categorías, no dos 🔴

`lib/types/destination.ts` define `tipo: "nacional" | "internacional"`. El documento exige tres
categorías principales (§24): Internacional, Nacional y **Pueblos de Antioquia**, y §13 la trata
como "categoría principal independiente". Los seis destinos de `lib/mock/destinations.ts` son 4
nacionales + 2 internacionales; ninguno es de Antioquia.

§13 le da a esa categoría una regla de negocio propia: **sin lista fija de pueblos**; los
destinos aparecen y desaparecen según haya oferta del proveedor. Es la única categoría dirigida
por inventario y no por catálogo editorial.

### C. El menú y el mapa de rutas 🔴

| Documento (§2, "exactamente") | Hoy (`components/layout/navbar.tsx`) |
|---|---|
| Inicio | (logo) ✅ |
| Mejores Ofertas | ❌ no existe |
| Mejores Playas y Hoteles | ❌ no existe |
| Destinos Internacionales | ❌ (filtro dentro de `/destinos`, sin URL propia) |
| Destinos Nacionales | ❌ (íd.) |
| Pueblos de Antioquia | ❌ no existe |
| Nosotros | ✅ |
| Contacto | ✅ |
| Botón WhatsApp | ✅ |
| — | `Paquetes` (no está en el menú del cliente) |
| — | `Cómo pagar` (no está en el menú del cliente) |

El cliente quiere navegación **por categoría comercial**; hoy es navegación **por tipo de
contenido** (`/destinos` = lugares, `/paquetes` = tarifas). `components/destinos/filtro-destinos.tsx`
resuelve nacional/internacional como filtro en cliente sin URL propia — no sirve como destino de
menú ni es enlazable desde un anuncio.

Deriva de vocabulario: el documento dice **oferta** y **ficha comercial**; el repo dice
**paquete** y publica en `/paquetes/[slug]`. Renombrar URLs después de publicar cuesta
redirecciones — decidirlo antes del primer deploy.

### D. Colecciones curadas con cross-listing 🟠

§26: la misma oferta visible en varias secciones sin duplicarse, con `Mostrar en Mejores Ofertas`
/ `Mostrar en Mejores Playas y Hoteles` / `Mostrar en Home` (sí/no) y un `Orden`. Editar precio,
fecha o imagen se propaga a todos los lugares donde aparece.

Hoy la única selección es "todas las ofertas vigentes". `/paquetes` no es "Mejores Ofertas": §6
pide las que la agencia seleccionó para esa sección, con pestañas Todas | Internacionales |
Nacionales | Pueblos de Antioquia.

Mismo problema en destinos: §9 — "no todos los destinos deben tener el mismo protagonismo" — y
§24 piden `Destacado en Home` (sí/no), `Orden de aparición` y `Estado` (activo/inactivo). Ninguno
existe.

### E. El hotel es una entidad, no un adjetivo 🟠

"Mejores Playas y Hoteles" (§7, §8) es sección de menú entera, dirigida al cliente que no compra
por precio. Sus tarjetas muestran nombre del hotel, destino, característica diferencial y
alimentación, con la fotografía más protagonista que en las tarjetas de oferta. `Offer`
(`lib/types/offer.ts`) no tiene `hotel` ni `alimentacion`.

### F. Campos del formulario 🔴 bloqueante

Bloquea porque los tipos de campo de GoHighLevel no se convierten después de creados — el
bloqueo ya está abierto en `CURRENT.md`.

| | Documento | Hoy (`components/forms/lead-form.tsx`) |
|---|---|---|
| General (§19) | Nombre · WhatsApp · **¿Qué tipo de viaje buscas?** (Internacional / Nacional / Pueblos de Antioquia / Todavía no lo sé) → *Quiero asesoría* | Nombre · Teléfono · Ciudad de salida · Fecha aproximada · Nº viajeros |
| En ficha (§20) | Nombre · WhatsApp · Nº viajeros → *Consultar disponibilidad* | el mismo de arriba |

§19 cierra: "la información comercial adicional será recopilada posteriormente mediante el
proceso establecido en GoHighLevel" — es decir, **ciudad de salida y fecha las pregunta el
asesor, no el sitio**. Contradice directamente `mvp-features.md`, que argumenta que los cuatro
campos visibles deben incluir ciudad de salida y fecha aproximada.

Consecuencia inmediata en código: `app/api/lead/route.ts` rechaza con 422
(`missing_required_fields: ["nombre","ciudadOrigen"]`). El formulario que pide el cliente **hoy
no pasaría su propia validación de servidor**.

Falta además el campo `tipoViaje` (los cuatro valores del documento), que no existe en ninguna
capa.

### G. Payload a GoHighLevel — faltan tres campos 🟠

§21 lista lo que debe viajar. Contra `app/api/lead/route.ts`:

| §21 pide | Estado |
|---|---|
| Fuente, URL/página, ID de oferta, Destino, UTM source/medium/campaign/content/term | ✅ (`lib/tracking/utm.ts` incluye `utm_term`) |
| **Nombre de oferta** | ❌ solo va `offerId` |
| **Categoría** | ❌ no existe el concepto de 3 categorías |
| **Sección desde donde llegó** (Mejores Ofertas / Playas y Hoteles / Internacionales / Nacionales / Pueblos) | ❌ no existe |

Los tres son de oportunidad, no de contacto (`spec-tecnica.md` §8.2) — hay que meterlos en el
contrato antes de que el proveedor cree los campos en GHL.

## 2. Campos que faltan en el modelo de datos

**`Offer`** (§25, §26, §27) — presentes: `titulo`, `destino`, `beneficioCorto`, `precioDesde`,
`ciudadOrigen`, `noches`, `incluye`, `noIncluye`, `imagenes`, `vigenciaHasta`, `validadaEl`,
`estado`.

Faltan: `hotel` · `alimentacion` · `fechaPeriodo` (el "8 al 12 de junio" de las tarjetas —
`fechasSalida` existe pero es otra cosa y se deja sin renderizar en Fase 1) ·
`informacionImportante` · `requisitos`/`documentacion` (§17) · `vigenciaDesde` (hoy solo hay
`hasta`) · `mostrarEnMejoresOfertas` · `mostrarEnPlayasYHoteles` · `mostrarEnHome` · `orden` ·
`actualizadoEl`.

**`Destination`** (§24) — faltan: tercera categoría · `destacadoEnHome` · `orden` · `estado`.

**Imágenes** (§28-§30): el panel debe optimizar al subir (redimensionar, comprimir, WebP/AVIF,
tamaños por dispositivo, lazy), **generar el ALT automáticamente** (ej. "Hotel Riu Palace en
Punta Cana, República Dominicana") con opción de editarlo, y guardar con nombres descriptivos.
Hoy eso lo da `next/image` sobre archivos que pone un desarrollador; con panel administrativo
pasa a ser responsabilidad del CMS elegido — es un criterio de selección, no un detalle.

## 3. La home

El documento pide 11 bloques (§3); el repo tiene 9, y coinciden en 6: hero · captación de leads ·
elementos de confianza · testimonios · CTA final · footer.

**Faltan las cinco secciones comerciales**: Mejores Ofertas (≈6 tarjetas + "Ver todas las
ofertas") · Mejores Playas y Hoteles (4-6) · Destinos Internacionales · Destinos Nacionales ·
Pueblos de Antioquia. Hoy hay una sola rejilla mixta de 6 destinos
(`app/[locale]/(sitio)/page.tsx`).

Sobran respecto al documento (no prohibidas, pero no pedidas): "Cómo funciona" (3 pasos), "Por
qué viajar con nosotros" (4 razones), franja "Next Stop", "Cómo saber si una agencia es de
fiar".

**Tensión real que hay que nombrar:** `page.tsx` documenta que la home cumple a propósito el
Pre-Flight §11.B de `brief-v0.md` — nueve secciones con nueve estructuras distintas, ninguna fila
de tres tarjetas idénticas, nunca tres secciones seguidas con el mismo patrón. Cinco secciones
nuevas seguidas de rejilla de tarjetas rompen esa regla de frente si se apilan sin más. No es un
capricho de estilo: es el gate anti-plantilla de `brief-v0.md` §11. Se puede cumplir el documento
del cliente y el gate a la vez (variando densidad, formato de tarjeta y ritmo entre secciones),
pero hay que diseñarlo, no apilarlo.

La tarjeta de oferta también se queda corta: §5 pide imagen, destino, fecha o periodo, duración,
ciudad de salida, hotel, precio desde y CTA; `PackageCard` (`components/ui/card.tsx`) muestra
imagen, título, beneficio, precio, ciudad y ocupación base. §16 pide **una** tarjeta estándar
consistente para todas las promociones.

## 4. Sobre lo que el documento del cliente calla

No dice "quítenlo" — calla. Como es la fuente de verdad de alcance, el silencio cambia el peso de
estas decisiones:

- **Inglés / i18n.** Cero menciones. Todo el menú y el copy del documento son español.
  `mvp-features.md` ya tenía abierta la pregunta "¿sigue el inglés en alcance?"; este documento no
  la cierra, pero tampoco la respalda. El costo (plantillas de WhatsApp en dos idiomas, contenido
  duplicado en el CMS, enrutamiento de asesor por idioma) sigue sin presupuestarse. Decisión de
  negocio pendiente, ahora con menos apoyo documental.
- **Consentimiento Ley 1581.** El documento no lo menciona en ningún formulario. **Esto no se
  toca**: es requisito legal, no preferencia de producto, y está en `spec-tecnica.md` §8.3 con el
  registro de evidencia completo. El checkbox no pre-marcado se queda. Es una adición al
  documento, no una contradicción con él.
- **`/lp/[campana]`, `/como-pagar`, `/faq`, `/gracias`, blog, pagos Wompi/PayU, itinerario día a
  día, cupos.** Ninguno aparece en el documento. `/gracias` y `/lp/[campana]` ya están construidos
  y son coherentes con el tráfico de Meta Ads que describe §31; `/como-pagar` está en el menú
  actual pero no en el del cliente.
- **Vigencia.** §27 pide "que una oferta vencida deje de mostrarse públicamente **o** sea
  identificada para revisión administrativa". `spec-tecnica.md` §8.4 es más estricto y mejor: la
  ficha no da 404 ni tacha el precio, muestra estado de tarifa vencida con CTA de recotización,
  porque quien llega ahí sigue siendo un lead de alta intención. Compatible: se retira de los
  listados, se conserva la ficha. No degradar lo que ya existe.
- **Testimonios (§34).** Pide reales y administrables. Los tres de `messages/es.json` son de
  ejemplo. Mismo criterio que ya rige para el RNT: nada inventado en producción.
- **"NextGen" (§18).** El documento nombra a un tercero como responsable de la integración
  comercial con GHL. Encaja con la frontera que `mvp-features.md` pedía escribir ("aquí se
  entrega el sitio + `/api/lead` con contrato documentado; del otro lado el proveedor conecta el
  CRM"), pero falta confirmar que NextGen es quien firma el contrato de `/api/lead` — es la
  contraparte que falta para desbloquear el punto F.

## 5. Lo que ya está alineado (no re-litigar)

§22 WhatsApp visible siempre con mensaje contextual desde la oferta → `whatsapp-floating.tsx` +
`buildWhatsAppUrl`. §31 mobile-first para tráfico de Meta Ads y §32 rendimiento → ya se supera
(objetivo LCP < 1s, cero librerías de animación). §17 ficha comercial con galería,
incluye/no incluye, condiciones y doble CTA → construida. §16 "la información debe ser texto real
del website y no depender de un flyer" → coincide con el estado `borrador` de
`lib/types/offer.ts` (oferta extraída de imagen por IA, sin validar por una persona, nunca en
producción). §33/§35/§36/§37 confianza, Nosotros, Contacto y Footer → existen, con los huecos que
ya son bloqueos externos en `CURRENT.md` (redes, horario, medios de pago, RNT real).

## 6. Puntos que requieren decisión antes de planear la ejecución

1. **CMS y alcance del panel administrativo.** Bloquea todo lo demás de esta lista: taxonomía,
   colecciones, ALT automático y estados son campos de ese modelo. La pregunta previa a elegir
   herramienta — ¿el backoffice **es** la base de ofertas o publica sobre una externa? — está
   planteada en [`backoffice-features.md`](backoffice-features.md) §7.
2. **Contrato de `/api/lead` con NextGen**, con los campos de §19/§20/§21 —
   incorporar `tipoViaje`, `nombreOferta`, `categoria`, `seccionOrigen`, y decidir si
   `ciudadOrigen` deja de ser obligatorio en el formulario general.
3. **`oferta`/`paquete` en las URLs**: mantener `/paquetes/[slug]` o migrar a `/ofertas/[slug]`
   antes de publicar (después cuesta redirecciones).
4. **Inglés**: ¿sigue en alcance de Fase 1 dado que el documento del cliente no lo menciona?

## 7. Consecuencia sobre el estado del proyecto

`plan-fase-1.md` §6 ("Criterio de Fase 1 terminada") y `CURRENT.md` describen una Fase 1 que
predata este documento. Los puntos 3, 4 y 5 (taxonomía/rutas, home, panel) son trabajo nuevo de
tamaño comparable a lo ya construido — no ajustes menores. Está terminada la Fase 1 que definían
los documentos anteriores al 2026-08-16, no la que pide el cliente.
