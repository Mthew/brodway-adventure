import type { Destination } from "@/lib/types/destination";

/**
 * SEMILLA de la base de datos — ya NO es la fuente del sitio.
 *
 * Desde que existe Supabase, `lib/destinations` lee de la tabla `destinos`. Este
 * archivo sólo sirve para sembrar una base vacía. Cambiar algo aquí NO cambia el
 * sitio: hay que editarlo en la base.
 */

/**
 * CONTENIDO EDITORIAL DE EJEMPLO.
 *
 * Nadie debe importar este archivo directamente: se accede por `lib/destinations`.
 * Cuando la edición pase a un CMS (Fase 2), sólo cambia el interior de esa capa.
 *
 * El texto es plausible y verificable, pero NO está revisado por la agencia: no
 * contiene cifras inventadas, ni promesas, ni datos legales. Antes de publicar hay
 * que validarlo con quien conoce cada destino.
 */
export const MOCK_DESTINATIONS: Destination[] = [
  {
    slug: "eje-cafetero",
    nombre: "Eje Cafetero",
    tipo: "nacional",
    imagen: "/destinos/eje-cafetero.webp",
    imagenHero: "/destinos/eje-cafetero-hero.webp",
    resumen:
      "Montaña, fincas de café y pueblos de colores, a una hora de vuelo de las grandes ciudades.",
    introduccion: [
      "El Eje Cafetero son tres departamentos vecinos, Quindío, Risaralda y Caldas, donde el café dejó de ser sólo un cultivo y se volvió una forma de vivir. Se recorre en carretera, entre montañas verdes y pueblos con balcones pintados de colores.",
      "Se va por el paisaje y se vuelve por la gente. Una tarde en una finca cafetera explica más sobre Colombia que cualquier museo: quién siembra, cómo se recoge el grano, por qué una taza sabe distinta de otra. Y a media hora está el Valle de Cocora, con las palmas de cera más altas del mundo.",
      "Es un destino cómodo para viajar en pareja, en familia o con amigos, y uno de los pocos donde se puede combinar caminata, cultura y descanso sin cambiar de hotel cada noche.",
    ],
    mejorEpoca:
      "Es un destino de todo el año, con clima templado casi constante. Diciembre a febrero y julio a agosto suelen ser los meses más secos y los más concurridos. Si prefieres menos gente y no te molesta un aguacero de tarde, abril, mayo y octubre son buenos meses y suelen salir más económicos.",
    queHacer: [
      {
        titulo: "Recorrer una finca cafetera",
        descripcion:
          "Del grano a la taza, con la familia que lo cultiva. Es la actividad que más recuerda la gente al volver.",
      },
      {
        titulo: "Caminar el Valle de Cocora",
        descripcion:
          "Hay una ruta larga de unas cinco horas y una corta al mirador. Eliges según cómo te sientas ese día.",
      },
      {
        titulo: "Pasar la tarde en Salento",
        descripcion:
          "Calles de colores, artesanía y miradores. Se recorre a pie y sin prisa.",
      },
      {
        titulo: "Conocer Filandia",
        descripcion:
          "Más tranquilo que Salento y con el mismo encanto. Buena parada si buscas menos gente.",
      },
      {
        titulo: "Visitar los termales de Santa Rosa",
        descripcion:
          "Aguas termales al pie de una cascada. Va bien como cierre después de un día de caminata.",
      },
    ],
    faq: [
      {
        pregunta: "¿A qué aeropuerto conviene llegar?",
        respuesta:
          "Los tres principales son Armenia, Pereira y Manizales. Cuál te conviene depende de dónde te alojes y de tu ciudad de salida; te lo decimos al cotizar.",
      },
      {
        pregunta: "¿Se necesita buena condición física?",
        respuesta:
          "Sólo para la ruta larga del Valle de Cocora. El resto del recorrido es tranquilo y hay alternativas cortas para cada actividad.",
      },
    ],
    destacadoEnHome: true,
    orden: 2,
    estado: "activo",
  },
  {
    slug: "cartagena",
    nombre: "Cartagena",
    tipo: "nacional",
    imagen: "/destinos/cartagena.webp",
    imagenHero: "/destinos/cartagena-hero.webp",
    resumen:
      "Ciudad amurallada, Caribe y una historia de casi cinco siglos, en un mismo viaje.",
    introduccion: [
      "Cartagena es una ciudad caribeña con una muralla del siglo XVI todavía en pie. Se camina de día por calles de balcones y buganvilias, y de noche por plazas que no se vacían.",
      "Lo que la hace distinta de un destino de playa es que tiene dos viajes en uno: el centro histórico, que se recorre a pie y se disfruta sin plan, y las islas del Rosario, a menos de una hora en lancha, con agua clara y arena blanca.",
      "Funciona bien para quien viaja por primera vez al Caribe colombiano y quiere algo más que playa, y también para escapadas cortas de tres o cuatro noches.",
    ],
    mejorEpoca:
      "Diciembre a abril es la temporada seca y la más agradable, y también la de mayor demanda y precios más altos. De agosto a noviembre llueve más, pero son aguaceros cortos de tarde y la ciudad está mucho más tranquila. Hace calor y humedad todo el año.",
    queHacer: [
      {
        titulo: "Caminar la ciudad amurallada",
        descripcion:
          "Sin ruta fija. Se entra por cualquier puerta y se sale cuando cae el sol sobre las murallas.",
      },
      {
        titulo: "Pasar un día en las islas del Rosario",
        descripcion:
          "Salida en lancha por la mañana y regreso al atardecer. La tasa de ingreso se paga en el muelle.",
      },
      {
        titulo: "Recorrer Getsemaní",
        descripcion:
          "El barrio de los murales y la vida de calle. A pocos minutos del centro y con otro ritmo.",
      },
      {
        titulo: "Subir al Castillo de San Felipe",
        descripcion:
          "La fortaleza más grande que España construyó en América. Ve temprano o al final de la tarde por el calor.",
      },
    ],
    faq: [
      {
        pregunta: "¿Cuántas noches conviene quedarse?",
        respuesta:
          "Con tres noches alcanza para el centro y un día de islas. Con cuatro o cinco cabe además Getsemaní y algo de playa sin correr.",
      },
      {
        pregunta: "¿El tour a las islas está incluido en los planes?",
        respuesta:
          "Depende del plan. En cada ficha dice exactamente qué incluye y qué no, y la tasa de ingreso a las islas casi siempre se paga aparte.",
      },
    ],
    destacadoEnHome: true,
    orden: 1,
    estado: "activo",
  },
  {
    slug: "santa-marta",
    nombre: "Santa Marta",
    tipo: "nacional",
    imagen: "/destinos/santa-marta.webp",
    imagenHero: "/destinos/santa-marta-hero.webp",
    resumen:
      "Donde la Sierra Nevada baja hasta el mar. Playa, selva y montaña en pocos kilómetros.",
    introduccion: [
      "Santa Marta es la ciudad más antigua de Colombia y la puerta de entrada al Parque Tayrona, donde la selva llega hasta la orilla del mar. En muy poca distancia se pasa de la playa a la montaña.",
      "Es un destino para quien busca naturaleza antes que vida urbana. Además del Tayrona están Minca, un pueblo de montaña entre cafetales a menos de una hora, y Palomino, más al norte y más tranquilo.",
      "Pide un poco más de logística que Cartagena, porque las distancias entre lugares son reales y algunas playas se llegan caminando. A cambio, es de los sitios donde más cambia el paisaje en un mismo viaje.",
    ],
    mejorEpoca:
      "La temporada seca va de diciembre a marzo y es la más estable para el Tayrona. El parque cierra algunas semanas al año por descanso ecológico, y las fechas las define la autoridad ambiental: conviene confirmarlas antes de comprar tiquetes.",
    queHacer: [
      {
        titulo: "Entrar al Parque Tayrona",
        descripcion:
          "Las playas más conocidas quedan a una caminata de entre 45 minutos y dos horas desde la entrada.",
      },
      {
        titulo: "Subir a Minca",
        descripcion:
          "Pueblo de montaña entre cafetales y cascadas, con clima fresco. Se puede hacer en un día.",
      },
      {
        titulo: "Ver el atardecer en el Rodadero",
        descripcion:
          "La zona de playa más accesible de la ciudad, buena para un día sin desplazamientos largos.",
      },
      {
        titulo: "Conocer la Quinta de San Pedro Alejandrino",
        descripcion:
          "La hacienda donde murió Simón Bolívar, hoy museo y jardín botánico.",
      },
    ],
    faq: [
      {
        pregunta: "¿Se puede dormir dentro del Parque Tayrona?",
        respuesta:
          "Sí, hay opciones de hamaca, camping y cabañas dentro del parque. Son limitadas y se agotan con anticipación, sobre todo en temporada alta.",
      },
      {
        pregunta: "¿Es un destino para ir con niños pequeños?",
        respuesta:
          "El Rodadero y Minca sí. Las caminatas largas del Tayrona pueden ser exigentes para los más pequeños; te ayudamos a armar el plan según las edades.",
      },
    ],
    destacadoEnHome: true,
    orden: 3,
    estado: "activo",
  },
  {
    slug: "san-andres",
    nombre: "San Andrés",
    tipo: "nacional",
    imagen: "/destinos/san-andres.webp",
    imagenHero: "/destinos/san-andres-hero.webp",
    resumen:
      "Una isla caribeña que es Colombia sin necesidad de pasaporte, con su propia cultura raizal.",
    introduccion: [
      "San Andrés es una isla pequeña en pleno Caribe, más cerca de Centroamérica que del continente colombiano. Se recorre entera en un día en carro de golf o en moto.",
      "Su mar es lo primero que se nota, con franjas de color que cambian con la profundidad. Pero lo que la hace distinta es la cultura raizal: idioma creole propio, música y comida que no se parecen a las del resto del país.",
      "Al ser territorio colombiano, quien viaja desde Colombia no necesita pasaporte, aunque sí una tarjeta de turismo que se compra antes de abordar. Es una de las salidas internacionales en sensación y nacional en trámites.",
    ],
    mejorEpoca:
      "Diciembre a abril es la temporada más seca y de mar más calmado. De septiembre a noviembre llueve más y coincide con la temporada de huracanes del Caribe: la isla rara vez recibe impacto directo, pero conviene contratar asistencia de viaje que cubra cambios por clima.",
    queHacer: [
      {
        titulo: "Dar la vuelta a la isla",
        descripcion:
          "En carro de golf, parando donde te provoque. Toma media jornada y es la mejor forma de ubicarte.",
      },
      {
        titulo: "Pasar el día en Johnny Cay",
        descripcion:
          "Islote a pocos minutos en lancha, con playa y bastante ambiente. Lleva protector solar biodegradable.",
      },
      {
        titulo: "Bañarte en el Acuario",
        descripcion:
          "Zona de agua muy baja y clara, buena para snorkel incluso si no tienes experiencia.",
      },
      {
        titulo: "Conocer La Loma",
        descripcion:
          "El corazón raizal de la isla, con la iglesia bautista y una vista distinta del interior.",
      },
    ],
    faq: [
      {
        pregunta: "¿Necesito pasaporte?",
        respuesta:
          "Si viajas desde Colombia, no. Sí necesitas la tarjeta de turismo, que se compra antes de abordar, y documento de identidad vigente.",
      },
      {
        pregunta: "¿Cuántos días conviene?",
        respuesta:
          "Cuatro o cinco días permiten conocer la isla con calma e incluir Providencia si te interesa. Con tres se puede, pero queda ajustado.",
      },
    ],
    destacadoEnHome: true,
    orden: 4,
    estado: "activo",
  },
  {
    slug: "cancun",
    nombre: "Cancún",
    tipo: "internacional",
    imagen: "/destinos/cancun.webp",
    imagenHero: "/destinos/cancun-hero.webp",
    resumen:
      "Caribe mexicano, hoteles todo incluido y las ruinas mayas a un día de distancia.",
    introduccion: [
      "Cancún está en la península de Yucatán, sobre el Caribe mexicano. Su zona hotelera es una franja larga de arena entre el mar y una laguna, con hoteles de todos los tamaños y en su mayoría en régimen todo incluido.",
      "Es el destino internacional más pedido por viajeros colombianos, y no sólo por la playa: desde allí se llega en el día a Chichén Itzá, a los cenotes de la selva y a Isla Mujeres.",
      "Funciona especialmente bien para quien quiere un viaje sin logística, con la alimentación resuelta y la posibilidad de salir a conocer sólo los días que quiera.",
    ],
    mejorEpoca:
      "Diciembre a abril tiene el clima más estable y también los precios más altos. De junio a noviembre es temporada de lluvias y huracanes en el Caribe, con tarifas más bajas. Entre mayo y agosto puede llegar sargazo a algunas playas, y la cantidad cambia de semana a semana.",
    queHacer: [
      {
        titulo: "Visitar Chichén Itzá",
        descripcion:
          "Una de las ciudades mayas mejor conservadas. Es una excursión de día completo, así que sal temprano.",
      },
      {
        titulo: "Nadar en un cenote",
        descripcion:
          "Pozos de agua dulce en medio de la selva. Hay abiertos y hay subterráneos, con temperatura fresca todo el año.",
      },
      {
        titulo: "Pasar un día en Isla Mujeres",
        descripcion:
          "A media hora en ferry. Playa Norte tiene agua muy baja y calmada.",
      },
      {
        titulo: "Recorrer Tulum",
        descripcion:
          "Ruinas mayas sobre un acantilado frente al mar. Es el sitio arqueológico con la mejor vista de la zona.",
      },
    ],
    faq: [
      {
        pregunta: "¿Los colombianos necesitan visa para México?",
        respuesta:
          "Los requisitos migratorios cambian y los define el gobierno mexicano. Te confirmamos qué aplica en tu caso antes de que compres, y nunca damos por hecho un requisito sin verificarlo.",
      },
      {
        pregunta: "¿Qué cubre exactamente el todo incluido?",
        respuesta:
          "Varía según el hotel. Por lo general alimentación y bebidas dentro del hotel; las excursiones fuera se pagan aparte. En cada plan lo dice con detalle.",
      },
    ],
    destacadoEnHome: false,
    orden: 6,
    estado: "activo",
  },
  {
    slug: "punta-cana",
    nombre: "Punta Cana",
    tipo: "internacional",
    imagen: "/destinos/punta-cana.webp",
    imagenHero: "/destinos/punta-cana-hero.webp",
    resumen:
      "Playas de palmeras en República Dominicana, con la logística resuelta de principio a fin.",
    introduccion: [
      "Punta Cana está en el extremo este de República Dominicana y es uno de los destinos de playa más consolidados del Caribe. Casi todo el alojamiento es todo incluido y el aeropuerto queda a pocos minutos de los hoteles.",
      "Su playa más conocida es Bávaro, una franja larga de arena clara con palmeras y agua tranquila. El mar suele estar más calmado que en otros puntos del Caribe porque una barrera de coral rompe el oleaje.",
      "Es el destino que solemos recomendar a quien quiere descansar de verdad y hacer poca logística: se llega, se deja la maleta y no hace falta decidir nada más.",
    ],
    mejorEpoca:
      "Diciembre a abril es la temporada seca y de mejor clima. De agosto a octubre es la parte más activa de la temporada de huracanes del Caribe, con tarifas más bajas: si viajas en esos meses, vale la pena una asistencia que cubra cambios por clima.",
    queHacer: [
      {
        titulo: "Descansar en Bávaro",
        descripcion:
          "La playa principal, larga y de agua tranquila. Muchos viajes se resuelven aquí y nada más.",
      },
      {
        titulo: "Navegar a Isla Saona",
        descripcion:
          "Excursión de día completo en catamarán o lancha rápida, con piscina natural en el trayecto.",
      },
      {
        titulo: "Conocer Hoyo Azul",
        descripcion:
          "Una laguna de agua turquesa al pie de un acantilado, dentro de una reserva.",
      },
      {
        titulo: "Bucear o hacer snorkel",
        descripcion:
          "La barrera de coral deja aguas calmadas y buena visibilidad casi todo el año.",
      },
    ],
    faq: [
      {
        pregunta: "¿Qué documentos se necesitan?",
        respuesta:
          "Pasaporte vigente y, según el momento, algún formulario de entrada digital. Los requisitos los define el gobierno dominicano y te los confirmamos antes de comprar.",
      },
      {
        pregunta: "¿Conviene salir del hotel?",
        respuesta:
          "Si buscas descanso, no hace falta. Si quieres conocer, Isla Saona y Hoyo Azul son las salidas que más recomiendan quienes ya fueron.",
      },
    ],
    destacadoEnHome: true,
    orden: 5,
    estado: "activo",
  },

  /*
   * PUEBLOS DE ANTIOQUIA.
   *
   * La categoría no lleva lista fija: los pueblos aparecen y desaparecen según haya
   * oferta del proveedor (`estructura-funcional-cliente.md` §13). Estos dos existen
   * porque hoy hay tarifa para ellos, no porque sean un catálogo cerrado — y por eso
   * su página prioriza las promociones activas sobre el directorio (§14).
   */
  {
    slug: "jardin",
    nombre: "Jardín",
    tipo: "pueblos-de-antioquia",
    imagen: "/destinos/eje-cafetero.webp",
    imagenHero: "/destinos/eje-cafetero-hero.webp",
    resumen: "Un pueblo de montaña con cable aéreo, café y un parque que sigue siendo el centro de todo.",
    introduccion: [
      "Jardín está a unas tres horas de Medellín y es de los pocos pueblos de Antioquia que no ha cambiado su parque principal por otra cosa. La basílica, las mesas de colores y la gente sentada a mirar siguen siendo el plan.",
      "Alrededor hay fincas cafeteras que reciben visitas, dos cables aéreos que cruzan el valle y caminos para la cueva del Esplendor. Se puede hacer en un fin de semana sin correr.",
      "Es un destino de clima templado y noches frescas, cómodo para quien viaja con niños o con adultos mayores: casi todo está a distancia caminable del parque.",
    ],
    mejorEpoca:
      "Todo el año. Entre diciembre y marzo llueve menos, y en junio la cosecha cafetera hace más interesante la visita a las fincas.",
    queHacer: [
      {
        titulo: "Cable aéreo",
        descripcion: "Dos líneas cruzan el valle y dejan ver el pueblo desde arriba. La subida toma unos 15 minutos.",
      },
      {
        titulo: "Finca cafetera con catación",
        descripcion: "Recorrido por el cultivo y el beneficiadero, terminando en una catación guiada.",
      },
      {
        titulo: "Cueva del Esplendor",
        descripcion: "Caminata de dificultad media hasta una cascada que cae dentro de una cueva.",
      },
      {
        titulo: "Parque principal y basílica",
        descripcion: "El centro social del pueblo, con la basílica de piedra al frente. No requiere plan.",
      },
    ],
    faq: [
      {
        pregunta: "¿Cuánto se demora el viaje desde Medellín?",
        respuesta:
          "Entre tres y cuatro horas por carretera, según el tráfico de salida. La vía está pavimentada todo el trayecto.",
      },
      {
        pregunta: "¿Se necesita buena condición física?",
        respuesta:
          "Sólo para la cueva del Esplendor, que exige una caminata de dificultad media. El resto del pueblo es plano y caminable.",
      },
    ],
    destacadoEnHome: true,
    orden: 7,
    estado: "activo",
  },
  {
    slug: "guatape",
    nombre: "Guatapé",
    tipo: "pueblos-de-antioquia",
    imagen: "/destinos/cartagena.webp",
    imagenHero: "/destinos/cartagena-hero.webp",
    resumen: "La piedra, el embalse y los zócalos: el pueblo más fotografiado de Antioquia, a dos horas de Medellín.",
    introduccion: [
      "Guatapé está a dos horas de Medellín y es el plan de un día que más se repite entre quienes visitan la ciudad. La piedra del Peñol, los 740 escalones y la vista del embalse son la razón.",
      "El pueblo tiene su propio atractivo: los zócalos, esos relieves de colores en la parte baja de las casas, cuentan oficios e historias de cada familia. Se recorre a pie en un par de horas.",
      "En el embalse se puede navegar, y hay operadores que ofrecen paseos en lancha de una hora. Es un destino cómodo para hacer en el día o quedarse una noche.",
    ],
    mejorEpoca:
      "Todo el año. Entre semana hay bastante menos gente en la piedra que en fin de semana o festivo.",
    queHacer: [
      {
        titulo: "Piedra del Peñol",
        descripcion: "740 escalones hasta el mirador, con vista completa del embalse. Se sube en unos 30 minutos.",
      },
      {
        titulo: "Zócalos del pueblo",
        descripcion: "Recorrido a pie por las calles del centro, donde cada casa cuenta su oficio en relieve.",
      },
      {
        titulo: "Paseo en lancha por el embalse",
        descripcion: "Recorrido de una hora que pasa por las islas y la antigua zona inundada.",
      },
      {
        titulo: "Malecón",
        descripcion: "Zona de restaurantes frente al agua, para cerrar el día sin plan fijo.",
      },
    ],
    faq: [
      {
        pregunta: "¿Se puede hacer en un solo día desde Medellín?",
        respuesta:
          "Sí. Es el formato más común: salida temprano, piedra y pueblo, y regreso en la tarde. Quedarse una noche permite ver el pueblo sin la multitud del mediodía.",
      },
      {
        pregunta: "¿Subir la piedra es exigente?",
        respuesta:
          "Son 740 escalones con descansos y barandas. No requiere entrenamiento, pero sí ir con calma si tienes problemas de rodilla o de respiración.",
      },
    ],
    destacadoEnHome: false,
    orden: 8,
    estado: "activo",
  },
];
