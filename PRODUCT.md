# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Tres perfiles confirmados por el cliente, los tres llegando **desde el móvil** y casi
siempre desde un anuncio de Meta, Instagram o Facebook:

- **Parejas y familias, 30 a 55 años.** Planifican con anticipación, presupuesto medio,
  y lo que valoran es que todo esté resuelto y sin sorpresas. Compran por confianza.
- **Grupos de amigos, 22 a 35 años.** Escapadas cortas y todo incluido, deciden rápido,
  sensibles al precio y muy activos en Instagram.
- **Primer viaje internacional.** Nunca han salido del país o van por segunda vez.
  Necesitan que les expliquen documentación, requisitos y qué incluye exactamente cada
  cosa. Es el perfil que más preguntas hace antes de decidir.

Los tres conviven en el mismo sitio, y ninguno es un caso de borde: el sitio tiene que
servir a quien compara precios y a quien nunca ha tramitado un pasaporte.

## Product Purpose

Agencia de viajes en Medellín, Colombia. El sitio **no vende ni reserva**: capta,
califica ligeramente, registra el consentimiento y entrega el contacto con su contexto
a GoHighLevel, donde un asesor humano continúa el proceso comercial.

Existe porque la mayor parte de la gente que no viaja no es por falta de ganas, sino
porque el proceso le parece confuso o le da desconfianza.

Éxito es que un lead llegue al CRM con contexto suficiente para que el asesor no
vuelva a preguntar lo que el sitio ya sabía: qué oferta vio, desde qué sección, de qué
campaña, y con qué autorización de datos.

## Positioning

**La experiencia pesa más que la tarifa más baja.** Decidido por el cliente: el margen
bueno está en hoteles y planes de mayor categoría, no en competir por el precio más
bajo. La sección de ofertas económicas existe y capta, pero no es el eje del negocio.

Lo que un competidor no puede copiar sin cambiar cómo opera:

- **El precio nunca viaja solo.** Toda tarifa publicada lleva ciudad de salida,
  ocupación base, fecha de verificación y vigencia. Es una decisión de producto, no un
  detalle de maquetación: es lo que permite decir "sin sorpresas" y sostenerlo.
- **Responde una persona, no un bot.** El agente de IA precalifica y atiende fuera de
  horario, pero **nunca envía cotizaciones**: eso queda en manos del asesor.
- **Se puede verificar.** En un mercado con fraude real, el sitio enseña cómo
  comprobar el RNT de cualquier agencia, incluida la propia.

## Operating Context

El sitio es **una de seis fuentes de captación**, no el sistema. El sistema comercial
vive en GoHighLevel y lo implementa un tercero (NextGen Digital). Las fronteras que
esto impone son producto, no arquitectura:

- **GoHighLevel** es la fuente de verdad comercial: contactos, oportunidades, pipelines,
  lead scoring, cotizaciones, postventa y analítica. El sitio no duplica nada de eso.
- **La base de ofertas comercial es un Google Sheet** de la agencia, pensado para que
  los asesores consulten tarifas vigentes por destino y mayorista. Sirve además como
  origen de las promociones publicadas.
- **El contenido publicable vive en Supabase** (destinos, ofertas, imágenes,
  testimonios), que es lo que el sitio lee y lo que un backoffice administrará.
- **Los asesores cotizan a mano**, consultando mayoristas. No hay integración con
  sistemas de reserva y no la habrá en esta fase.
- **Las ofertas llegan como flyers de mayorista.** Alguien las transcribe a campos
  estructurados; el sitio nunca publica la imagen del flyer como si fuera información.

## Capabilities and Constraints

**Lo que el sitio hace**

- Muestra destinos y ofertas, y lleva a WhatsApp (canal dominante) o a un formulario
  corto como alternativa para quien no quiere chatear.
- Publica cada tarifa con un `offerId` estable que viaja al CRM, más su ventana de
  vigencia. Una tarifa vencida **no da 404**: muestra su estado y ofrece recotizar,
  porque quien llega ahí sigue siendo un lead con intención alta.
- Organiza el catálogo en tres categorías principales de destino y dos colecciones
  curadas por la agencia (Mejores Ofertas · Mejores Playas y Hoteles).

**Lo que no hace, y no es un pendiente**

- No hay inventario en tiempo real, ni reserva, ni pago en línea. El pago con abono
  del 30% es de una fase posterior y aun así lo confirma un asesor por WhatsApp.
- No hay cupos en vivo, ni cuenta regresiva, ni urgencia inventada de ningún tipo.

**Restricciones que condicionan el diseño**

- **"Pueblos de Antioquia" es una categoría principal dirigida por inventario.** No
  tiene lista fija: los pueblos aparecen y desaparecen según haya oferta del proveedor.
  Que esa sección esté casi vacía es su estado normal, no un error a disimular.
- **Una oferta existe una sola vez** y aparece en varias secciones por banderas, para
  que cambiar un precio se refleje en todas a la vez.
- **Legal, no negociable:** consentimiento de datos con evidencia registrada (Ley 1581
  de 2012), casilla nunca pre-marcada, RNT visible junto al precio, mención del RNE y
  del ESCNNA. El español es el idioma legalmente autoritativo.
- **Inglés diferido.** La infraestructura de i18n se conserva; no se produce contenido
  editorial en inglés en esta fase.
- **Rendimiento como requisito de producto:** LCP por debajo de 1s en móvil. De ahí que
  no haya librerías de animación ni modo oscuro.

## Brand Commitments

- **El nombre es "BroWay Adventures"**, con B y W mayúsculas, siempre como una sola
  unidad verbal. Nunca "Bro Way", "Broway", "Bro-Way" ni "BRO WAY". Confirmado en el
  manual de marca §2.
- **"Next Stop" es la plataforma verbal**, una firma narrativa. No se fusiona con el
  logo y no aparece más de una vez por pieza.
- **Tipografías en uso:** Montserrat (títulos, navegación, botones), Lato (lectura),
  Caveat (firma narrativa). Mínimo 14px en todo el sitio.
- **Un color por intención:** verde para todo lo que lleva a WhatsApp, naranja para
  enviar el formulario. Nunca los dos para la misma acción.
- **Tono:** nada de urgencia fabricada, cifras inventadas ni promesas. Si un plan no le
  conviene a alguien, se le dice.
- Manual oficial en [`docs/brand/manual-de-marca.pdf`](docs/brand/manual-de-marca.pdf).
  **No define hex de color, tipografías ni fotografía**: esos valores se derivaron del
  logo y siguen pendientes de confirmar con quien mantiene la marca.

## Evidence on Hand

Lo que existe hoy, y lo que **no se debe fabricar** para rellenar el hueco:

| Activo | Estado |
|---|---|
| Fotografía propia de viajes | ❌ No existe. `public/destinos/*` son de Unsplash: sirven para juzgar el diseño, **no para publicar** |
| Testimonios reales | ❌ No existen. Los tres de la home son de ejemplo y están etiquetados como tales |
| Número de RNT verificado | ❌ Sin confirmar. No se publica hasta verificarlo |
| Horario, medios de pago, afiliaciones (ANATO/IATA), correo | ❌ Sin confirmar |
| Hex oficiales y logo vectorial | ❌ Solo existe el sello circular en PNG (1254×1254). Falta el logo horizontal |
| Referencias de diseño web | ✅ 4 en [`docs/design/references/`](docs/design/references/), incluida una plantilla de agencia de viajes ("Picniq") |
| Imágenes de lugares | ⚠️ 9 en [`docs/design/references/places/`](docs/design/references/places/) — Cartagena, Santa Marta y Valle de Cocora, en recortes web y móvil. Son **stock/candidatas**, no propiedad verificada de la agencia |

Que las imágenes de lugares vengan en pares `-web` / `-mobile` es coherente con el
recorte por dirección de arte que el sitio ya usa en su portada.

## Product Principles

1. **El precio nunca viaja solo.** Ciudad de salida, ocupación, vigencia y qué incluye
   van con la cifra o la cifra no se publica.
2. **Nada inventado.** Ni testimonios, ni RNT, ni afiliaciones, ni urgencia, ni cifras
   de "+X viajeros". Un hueco honesto vale más que un relleno creíble.
3. **El sitio capta, el CRM vende.** Todo lo que huela a gestión comercial pertenece a
   GoHighLevel; duplicarlo aquí crea dos verdades.
4. **La experiencia manda sobre la tarifa más baja**, sin dejar de captar a quien
   compara precios.
5. **Móvil primero y llegando desde un anuncio.** El contexto real de uso es un pulgar,
   datos móviles y tres segundos de paciencia.

## Accessibility & Inclusion

- **El contraste se mide contra la superficie real**, no contra blanco. Las insignias
  pintan texto sobre un tinte del 10% de su propio color, y dos tokens que pasaban
  sobre blanco fallaron dentro de su insignia.
- **Mínimo 14px** de tamaño de texto y **44px** de área táctil, incluidos los enlaces
  de texto y las migas.
- **La información importante nunca depende del hover** (requisito explícito del
  cliente): todo menú y toda revelación tiene que funcionar con toque y con teclado.
- **El movimiento se degrada a visible.** Las animaciones van dentro de `@supports` y
  respetan `prefers-reduced-motion`; sin soporte, el contenido aparece, no desaparece.
- Solo modo claro: la matriz de contraste medida cubre superficies claras.
