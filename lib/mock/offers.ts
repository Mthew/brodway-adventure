import type { Offer } from "@/lib/types/offer";

/**
 * SEMILLA de la base de datos — ya NO es la fuente del sitio.
 *
 * Desde que existe Supabase, `lib/offers` lee de la tabla `ofertas` y este archivo
 * dejó de servirse en tiempo de ejecución. Su único uso es sembrar una base vacía
 * (entorno nuevo, base de pruebas), así que sigue aquí en vez de borrarse.
 *
 * Cambiar algo aquí NO cambia el sitio: hay que editarlo en la base.
 *
 * Los precios son plausibles pero inventados, y todos los `mayorista` son ficticios.
 */
export const MOCK_OFFERS: Offer[] = [
  {
    offerId: "OF-2026-0142",
    slug: "eje-cafetero-4-dias",
    destino: "Eje Cafetero",
    destinoSlug: "eje-cafetero",
    ciudadOrigen: "Medellín",
    noches: 3,
    ocupacionBase: "doble",
    hotel: "Hacienda Venecia",
    alimentacion: "Desayuno incluido",
    fechaPeriodo: "Salidas todos los viernes",
    precioDesde: 1_290_000,
    moneda: "COP",
    titulo: "Eje Cafetero 4 días: café y naturaleza con guía local",
    beneficioCorto: "Fincas cafeteras, Valle de Cocora y Salento, sin improvisar",
    imagenes: [
      "/destinos/eje-cafetero-hero.webp",
      "/destinos/eje-cafetero-2.webp",
      "/destinos/eje-cafetero-3.webp",
    ],
    highlights: [
      "Recorrido guiado por una finca cafetera tradicional",
      "Día completo en el Valle de Cocora",
      "Tarde libre en Salento",
      "Transporte terrestre incluido durante todo el recorrido",
    ],
    incluye: [
      "3 noches de alojamiento con desayuno",
      "Transporte terrestre para los recorridos",
      "Guía local durante los tours",
      "Asistencia médica en viaje",
    ],
    noIncluye: [
      "Tiquetes aéreos",
      "Almuerzos y cenas no indicados",
      "Gastos personales y propinas",
    ],
    itinerario: [
      {
        dia: 1,
        titulo: "Llegada y tarde en Salento",
        descripcion:
          "Te recibimos en el aeropuerto y vamos al alojamiento. La tarde queda libre para caminar por Salento a tu ritmo.",
      },
      {
        dia: 2,
        titulo: "Finca cafetera",
        descripcion:
          "Recorrido guiado por una finca tradicional: del grano a la taza, con la gente que lo cultiva. Regreso a media tarde.",
      },
      {
        dia: 3,
        titulo: "Valle de Cocora",
        descripcion:
          "Día completo entre palmas de cera. La caminata tiene tramos exigentes y también una ruta corta, según cómo quieras vivirla.",
      },
      {
        dia: 4,
        titulo: "Regreso",
        descripcion:
          "Mañana libre y traslado al aeropuerto según el horario de tu vuelo.",
      },
    ],
    fechasSalida: [
      { fecha: "2026-09-12", cuposDisponibles: 8 },
      { fecha: "2026-09-26", cuposDisponibles: 4 },
    ],
    politicaCancelacion:
      "Cancelación sin costo hasta 15 días antes de la salida. Entre 14 y 7 días se retiene el 30% del valor total. Con menos de 7 días no hay reembolso, pero puedes ceder el cupo a otra persona.",
    faq: [
      {
        pregunta: "¿La caminata del Valle de Cocora es exigente?",
        respuesta:
          "Hay dos rutas. La larga toma unas cinco horas con subidas fuertes; la corta llega al mirador de las palmas en hora y media. Eliges el día del recorrido.",
      },
      {
        pregunta: "¿Puedo salir desde otra ciudad?",
        respuesta:
          "Sí. El precio publicado sale desde Medellín; cuéntanos tu ciudad y te pasamos el valor con el ajuste que corresponda.",
      },
    ],
    vigenciaDesde: "2026-07-01",
    vigenciaHasta: "2026-12-15",
    validadaEl: "2026-08-12",
    actualizadoEl: "2026-08-12",
    estado: "vigente",
    mayorista: "Mayorista ejemplo A",
    mostrarEnMejoresOfertas: true,
    mostrarEnPlayasYHoteles: false,
    mostrarEnHome: true,
    orden: 2,
  },
  {
    offerId: "OF-2026-0157",
    slug: "cartagena-4-noches",
    destino: "Cartagena",
    destinoSlug: "cartagena",
    ciudadOrigen: "Bogotá",
    noches: 4,
    ocupacionBase: "doble",
    hotel: "Hotel Almirante Cartagena",
    alimentacion: "Desayuno incluido",
    fechaPeriodo: "12 al 16 de septiembre",
    precioDesde: 1_850_000,
    moneda: "COP",
    titulo: "Cartagena 5 días: ciudad amurallada y playa",
    beneficioCorto: "Centro histórico y un día en las islas, con traslados resueltos",
    imagenes: [
      "/destinos/cartagena-hero.webp",
      "/destinos/cartagena-2.webp",
      "/destinos/cartagena-3.webp",
    ],
    highlights: [
      "Hotel a poca distancia de la ciudad amurallada",
      "Día de playa en las islas del Rosario",
      "Traslados aeropuerto-hotel incluidos",
    ],
    incluye: [
      "4 noches de alojamiento con desayuno",
      "Traslados aeropuerto-hotel-aeropuerto",
      "Tour a las islas con almuerzo",
      "Asistencia médica en viaje",
    ],
    noIncluye: [
      "Tiquetes aéreos",
      "Impuesto de ingreso a las islas",
      "Comidas no indicadas",
    ],
    itinerario: [
      {
        dia: 1,
        titulo: "Llegada y ciudad amurallada",
        descripcion:
          "Traslado del aeropuerto al hotel. En la tarde, primer recorrido a pie por el centro histórico.",
      },
      {
        dia: 2,
        titulo: "Islas del Rosario",
        descripcion:
          "Salida en lancha hacia las islas, día de playa y almuerzo incluido. Regreso al final de la tarde.",
      },
      {
        dia: 3,
        titulo: "Día libre",
        descripcion:
          "Sin actividades programadas. Si quieres, te sugerimos opciones según lo que te guste.",
      },
      {
        dia: 4,
        titulo: "Getsemaní",
        descripcion:
          "Mañana por el barrio de Getsemaní y su calle de murales. Tarde libre.",
      },
      {
        dia: 5,
        titulo: "Regreso",
        descripcion: "Traslado al aeropuerto según el horario de tu vuelo.",
      },
    ],
    fechasSalida: [
      { fecha: "2026-08-22", cuposDisponibles: 6 },
      { fecha: "2026-09-05", cuposDisponibles: 10 },
    ],
    politicaCancelacion:
      "Cancelación sin costo hasta 20 días antes de la salida. Entre 19 y 10 días se retiene el 40% del valor total. Con menos de 10 días no hay reembolso.",
    faq: [
      {
        pregunta: "¿El impuesto de las islas se paga aparte?",
        respuesta:
          "Sí. Es una tasa que cobra la autoridad local en el muelle el día del tour, y por eso aparece en 'qué no incluye'.",
      },
      {
        pregunta: "¿El hotel queda dentro de la ciudad amurallada?",
        respuesta:
          "Queda a pocos minutos caminando. Te confirmamos el hotel exacto antes de que separes el viaje.",
      },
    ],
    vigenciaDesde: "2026-07-15",
    vigenciaHasta: "2026-11-30",
    validadaEl: "2026-08-14",
    actualizadoEl: "2026-08-14",
    estado: "vigente",
    mayorista: "Mayorista ejemplo B",
    mostrarEnMejoresOfertas: true,
    mostrarEnPlayasYHoteles: true,
    mostrarEnHome: true,
    orden: 1,
  },
  {
    offerId: "OF-2026-0098",
    slug: "cancun-todo-incluido",
    destino: "Cancún",
    destinoSlug: "cancun",
    ciudadOrigen: "Bogotá",
    noches: 5,
    ocupacionBase: "doble",
    hotel: "Riu Palace Las Américas",
    alimentacion: "Todo incluido",
    fechaPeriodo: "8 al 13 de junio",
    precioDesde: 4_390_000,
    moneda: "COP",
    titulo: "Cancún 6 días todo incluido",
    beneficioCorto: "Hotel todo incluido frente al mar, con vuelos y traslados",
    imagenes: [
      "/destinos/cancun-hero.webp",
      "/destinos/cancun-2.webp",
    ],
    highlights: [
      "Hotel todo incluido en la zona hotelera",
      "Vuelos directos desde Bogotá",
      "Traslados aeropuerto-hotel incluidos",
    ],
    incluye: [
      "Vuelos ida y regreso",
      "5 noches en régimen todo incluido",
      "Traslados aeropuerto-hotel-aeropuerto",
      "Asistencia médica internacional",
    ],
    noIncluye: [
      "Impuestos de salida no incluidos en la tarifa aérea",
      "Excursiones opcionales",
      "Gastos personales",
    ],
    itinerario: [
      {
        dia: 1,
        titulo: "Vuelo y llegada al hotel",
        descripcion:
          "Vuelo desde Bogotá y traslado al hotel. El régimen todo incluido arranca al hacer el check-in.",
      },
      {
        dia: 2,
        titulo: "Día libre en la playa",
        descripcion: "Sin actividades programadas. Playa, piscina y descanso.",
      },
      {
        dia: 3,
        titulo: "Día libre",
        descripcion:
          "Puedes contratar excursiones a Isla Mujeres o Chichén Itzá; te ayudamos a organizarlas.",
      },
      {
        dia: 4,
        titulo: "Día libre",
        descripcion: "Tiempo a tu ritmo dentro del hotel o por la zona hotelera.",
      },
      {
        dia: 5,
        titulo: "Día libre",
        descripcion: "Último día completo para aprovechar el todo incluido.",
      },
      {
        dia: 6,
        titulo: "Regreso",
        descripcion: "Traslado al aeropuerto y vuelo de regreso a Bogotá.",
      },
    ],
    fechasSalida: [{ fecha: "2026-06-14", cuposDisponibles: 0 }],
    politicaCancelacion:
      "Cancelación sujeta a las condiciones de la tarifa aérea. El componente terrestre admite cancelación sin costo hasta 30 días antes de la salida.",
    faq: [
      {
        pregunta: "¿Los vuelos están incluidos?",
        respuesta:
          "Sí, ida y regreso desde Bogotá. Si sales desde otra ciudad, el valor cambia y te lo calculamos.",
      },
      {
        pregunta: "¿Qué cubre el todo incluido?",
        respuesta:
          "Alimentación y bebidas dentro del hotel. Las excursiones fuera del hotel se pagan aparte.",
      },
    ],
    /** Deliberadamente vencida: sirve para probar el estado de tarifa expirada. */
    /*
     * FIXTURE DE TARIFA VENCIDA — no lo "arregles" subiendo la fecha.
     *
     * Es la única oferta que ejercita el estado de vencida de `spec-tecnica.md` §8.4:
     * no se lista en ninguna sección, pero su ficha sigue viva con el CTA de
     * recotización en vez de un 404. Si todas las ofertas están vigentes, ese camino
     * deja de tener cobertura y se rompe sin que nadie lo note.
     */
    vigenciaDesde: "2026-04-01",
    vigenciaHasta: "2026-06-30",
    validadaEl: "2026-05-20",
    actualizadoEl: "2026-05-20",
    estado: "vigente",
    mayorista: "Mayorista ejemplo C",
    mostrarEnMejoresOfertas: false,
    mostrarEnPlayasYHoteles: true,
    mostrarEnHome: true,
    orden: 4,
  },
  {
    offerId: "OF-2026-0161",
    slug: "san-andres-borrador",
    destino: "San Andrés",
    destinoSlug: "san-andres",
    ciudadOrigen: "Medellín",
    noches: 4,
    ocupacionBase: "doble",
    precioDesde: 2_100_000,
    moneda: "COP",
    titulo: "San Andrés 5 días",
    beneficioCorto: "Pendiente de validación humana",
    imagenes: [],
    highlights: [],
    incluye: [],
    noIncluye: [],
    itinerario: [],
    fechasSalida: [],
    politicaCancelacion: "",
    faq: [],
    vigenciaDesde: "2026-08-01",
    vigenciaHasta: "2026-12-31",
    validadaEl: "2026-08-01",
    actualizadoEl: "2026-08-01",
    /** Extraída de una imagen pero sin validar: NUNCA debe renderizarse. */
    estado: "borrador",
    mayorista: "Mayorista ejemplo A",
    /*
     * Marcada para TODAS las secciones a propósito: es la prueba de que el estado
     * `borrador` manda sobre la curaduría. Si aparece en algún listado, el filtro de
     * `lib/offers` está roto.
     */
    mostrarEnMejoresOfertas: true,
    mostrarEnPlayasYHoteles: true,
    mostrarEnHome: true,
    orden: 0,
  },
  {
    offerId: "OF-2026-0173",
    slug: "santa-marta-tayrona",
    destino: "Santa Marta",
    destinoSlug: "santa-marta",
    ciudadOrigen: "Medellín",
    noches: 4,
    ocupacionBase: "doble",
    hotel: "Hotel Bahía Taganga",
    alimentacion: "Desayuno incluido",
    fechaPeriodo: "Salidas semanales hasta noviembre",
    precioDesde: 1_690_000,
    moneda: "COP",
    titulo: "Santa Marta 5 días: Tayrona y Taganga",
    beneficioCorto: "Un día completo en el Parque Tayrona, con entrada y transporte",
    imagenes: [
      "/destinos/santa-marta-hero.webp",
      "/destinos/santa-marta-2.webp",
      "/destinos/santa-marta-3.webp",
    ],
    highlights: [
      "Día completo en el Parque Tayrona con entrada incluida",
      "Atardecer en Taganga",
      "Centro histórico de Santa Marta a pie",
    ],
    incluye: [
      "Tiquetes aéreos ida y regreso desde Medellín",
      "4 noches de alojamiento con desayuno",
      "Traslados aeropuerto - hotel - aeropuerto",
      "Entrada y transporte al Parque Tayrona",
      "Asistencia médica en viaje",
    ],
    noIncluye: [
      "Almuerzos y cenas",
      "Gastos personales",
      "Actividades no descritas en el itinerario",
    ],
    itinerario: [
      {
        dia: 1,
        titulo: "Llegada y centro histórico",
        descripcion:
          "Traslado al hotel y tarde libre para caminar el centro y el malecón.",
      },
      {
        dia: 2,
        titulo: "Parque Tayrona",
        descripcion:
          "Día completo en el parque, con caminata hasta Cabo San Juan y tiempo de playa.",
      },
      {
        dia: 3,
        titulo: "Taganga",
        descripcion: "Mañana libre y tarde en Taganga para ver el atardecer.",
      },
      { dia: 4, titulo: "Día libre", descripcion: "Día sin actividades programadas." },
      { dia: 5, titulo: "Regreso", descripcion: "Traslado al aeropuerto y vuelo de regreso." },
    ],
    fechasSalida: [],
    politicaCancelacion:
      "Cancelaciones con más de 15 días de anticipación: penalidad del 20%. Entre 15 y 7 días: 50%. Con menos de 7 días: sin reembolso.",
    faq: [
      {
        pregunta: "¿La entrada al Tayrona está incluida?",
        respuesta:
          "Sí, la entrada y el transporte están incluidos. El parque cierra algunas semanas al año por descanso ecológico; si tu fecha coincide, te proponemos una alternativa.",
      },
    ],
    informacionImportante: [
      "El Parque Tayrona cierra varias semanas al año por descanso ecológico.",
      "La caminata a Cabo San Juan toma unas 2 horas por terreno irregular.",
    ],
    vigenciaDesde: "2026-08-01",
    vigenciaHasta: "2026-11-15",
    validadaEl: "2026-08-13",
    actualizadoEl: "2026-08-13",
    estado: "vigente",
    mayorista: "Mayorista ejemplo B",
    mostrarEnMejoresOfertas: true,
    mostrarEnPlayasYHoteles: true,
    mostrarEnHome: true,
    orden: 3,
  },
  {
    offerId: "OF-2026-0180",
    slug: "punta-cana-todo-incluido",
    destino: "Punta Cana",
    destinoSlug: "punta-cana",
    ciudadOrigen: "Medellín",
    noches: 5,
    ocupacionBase: "doble",
    hotel: "Riu Palace Punta Cana",
    alimentacion: "Todo incluido",
    fechaPeriodo: "20 al 26 de octubre",
    precioDesde: 4_950_000,
    moneda: "COP",
    titulo: "Punta Cana 6 días todo incluido",
    beneficioCorto: "Resort frente al mar, con vuelos, traslados y todo incluido",
    imagenes: [
      "/destinos/punta-cana-hero.webp",
      "/destinos/punta-cana-2.webp",
      "/destinos/punta-cana-3.webp",
    ],
    highlights: [
      "Resort frente a Playa Bávaro",
      "Todo incluido: comidas, bebidas y snacks",
      "Traslados privados desde el aeropuerto",
    ],
    incluye: [
      "Tiquetes aéreos ida y regreso desde Medellín",
      "5 noches en régimen de todo incluido",
      "Traslados aeropuerto - hotel - aeropuerto",
      "Impuestos hoteleros",
      "Asistencia médica en viaje",
    ],
    noIncluye: [
      "Tasa de entrada a República Dominicana",
      "Excursiones opcionales",
      "Gastos personales y propinas",
    ],
    itinerario: [
      {
        dia: 1,
        titulo: "Llegada",
        descripcion: "Traslado al resort y tarde libre en la playa.",
      },
      {
        dia: 2,
        titulo: "Día de playa",
        descripcion: "Día libre para disfrutar Playa Bávaro y las instalaciones.",
      },
      {
        dia: 3,
        titulo: "Isla Saona (opcional)",
        descripcion: "Excursión opcional de día completo a Isla Saona.",
      },
      { dia: 4, titulo: "Día libre", descripcion: "Sin actividades programadas." },
      { dia: 5, titulo: "Día libre", descripcion: "Sin actividades programadas." },
      { dia: 6, titulo: "Regreso", descripcion: "Traslado al aeropuerto y vuelo de regreso." },
    ],
    fechasSalida: [],
    politicaCancelacion:
      "Cancelaciones con más de 30 días de anticipación: penalidad del 25%. Entre 30 y 15 días: 60%. Con menos de 15 días: sin reembolso.",
    faq: [
      {
        pregunta: "¿Necesito visa para República Dominicana?",
        respuesta:
          "Los ciudadanos colombianos no requieren visa de turismo, pero sí pasaporte con vigencia mínima de seis meses. Confirma tus documentos con tu asesor antes de reservar.",
      },
    ],
    documentacion: [
      "Pasaporte con vigencia mínima de seis meses",
      "Tarjeta de entrada y salida (se diligencia en línea antes del viaje)",
    ],
    informacionImportante: [
      "La tasa de entrada al país se paga en destino y no está incluida en la tarifa.",
    ],
    vigenciaDesde: "2026-08-05",
    vigenciaHasta: "2026-10-10",
    validadaEl: "2026-08-15",
    actualizadoEl: "2026-08-15",
    estado: "vigente",
    mayorista: "Mayorista ejemplo C",
    mostrarEnMejoresOfertas: false,
    mostrarEnPlayasYHoteles: true,
    mostrarEnHome: true,
    orden: 5,
  },
  {
    offerId: "OF-2026-0188",
    slug: "jardin-fin-de-semana",
    destino: "Jardín",
    destinoSlug: "jardin",
    ciudadOrigen: "Medellín",
    noches: 2,
    ocupacionBase: "doble",
    hotel: "Hotel Jardín Plaza",
    alimentacion: "Desayuno incluido",
    fechaPeriodo: "Salidas todos los sábados",
    precioDesde: 620_000,
    moneda: "COP",
    titulo: "Jardín: fin de semana entre montañas y café",
    beneficioCorto: "Dos noches en el pueblo, con cable aéreo y finca cafetera",
    imagenes: [
      "/destinos/eje-cafetero-hero.webp",
      "/destinos/eje-cafetero-2.webp",
    ],
    highlights: [
      "Cable aéreo con vista al valle",
      "Visita a finca cafetera con catación",
      "Parque principal y basílica",
    ],
    incluye: [
      "Transporte terrestre ida y regreso desde Medellín",
      "2 noches de alojamiento con desayuno",
      "Visita guiada a finca cafetera con catación",
      "Asistencia médica en viaje",
    ],
    noIncluye: ["Almuerzos y cenas", "Cable aéreo", "Gastos personales"],
    itinerario: [
      {
        dia: 1,
        titulo: "Llegada y parque principal",
        descripcion: "Traslado desde Medellín y tarde libre en el parque y la basílica.",
      },
      {
        dia: 2,
        titulo: "Finca cafetera",
        descripcion: "Visita guiada con catación y tarde libre para el cable aéreo.",
      },
      { dia: 3, titulo: "Regreso", descripcion: "Mañana libre y regreso a Medellín." },
    ],
    fechasSalida: [],
    politicaCancelacion:
      "Cancelaciones con más de 7 días de anticipación: penalidad del 20%. Con menos de 7 días: sin reembolso.",
    faq: [
      {
        pregunta: "¿El viaje es en transporte compartido?",
        respuesta:
          "Sí, el traslado desde Medellín es en van compartida. Si prefieres transporte privado, tu asesor te pasa el valor.",
      },
    ],
    vigenciaDesde: "2026-08-01",
    vigenciaHasta: "2026-12-20",
    validadaEl: "2026-08-14",
    actualizadoEl: "2026-08-14",
    estado: "vigente",
    mayorista: "Mayorista ejemplo D",
    mostrarEnMejoresOfertas: true,
    mostrarEnPlayasYHoteles: false,
    mostrarEnHome: true,
    orden: 6,
  },
];
