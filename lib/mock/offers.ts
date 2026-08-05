import type { Offer } from "@/lib/types/offer";

/**
 * DATOS DE EJEMPLO — no son ofertas reales.
 *
 * Nadie debe importar este archivo directamente: se accede a través de
 * `lib/offers`. Cuando se decida la fuente real (base de ofertas o CMS, decisión
 * abierta en mvp-features.md §Riesgos), sólo cambia el interior de esa capa.
 *
 * Los precios son plausibles pero inventados, y todos los `mayorista` son ficticios.
 */
export const MOCK_OFFERS: Offer[] = [
  {
    offerId: "OF-2026-0142",
    slug: "eje-cafetero-4-dias",
    destino: "Eje Cafetero",
    ciudadOrigen: "Medellín",
    noches: 3,
    ocupacionBase: "doble",
    precioDesde: 1_290_000,
    moneda: "COP",
    titulo: "Eje Cafetero 4 días: café y naturaleza con guía local",
    beneficioCorto: "Fincas cafeteras, Valle de Cocora y Salento, sin improvisar",
    imagenes: [
      "https://picsum.photos/seed/eje-cafetero-finca-cafe/1200/800",
      "https://picsum.photos/seed/eje-cafetero-valle-cocora/600/600",
      "https://picsum.photos/seed/eje-cafetero-salento-calle/600/600",
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
    vigenciaHasta: "2026-09-30",
    validadaEl: "2026-07-28",
    estado: "vigente",
    mayorista: "Mayorista ejemplo A",
  },
  {
    offerId: "OF-2026-0157",
    slug: "cartagena-4-noches",
    destino: "Cartagena",
    ciudadOrigen: "Bogotá",
    noches: 4,
    ocupacionBase: "doble",
    precioDesde: 1_850_000,
    moneda: "COP",
    titulo: "Cartagena 5 días: ciudad amurallada y playa",
    beneficioCorto: "Centro histórico y un día en las islas, con traslados resueltos",
    imagenes: [
      "https://picsum.photos/seed/cartagena-ciudad-amurallada/1200/800",
      "https://picsum.photos/seed/cartagena-islas-rosario/600/600",
      "https://picsum.photos/seed/cartagena-getsemani-murales/600/600",
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
    vigenciaHasta: "2026-08-15",
    validadaEl: "2026-07-30",
    estado: "vigente",
    mayorista: "Mayorista ejemplo B",
  },
  {
    offerId: "OF-2026-0098",
    slug: "cancun-todo-incluido",
    destino: "Cancún",
    ciudadOrigen: "Bogotá",
    noches: 5,
    ocupacionBase: "doble",
    precioDesde: 4_390_000,
    moneda: "COP",
    titulo: "Cancún 6 días todo incluido",
    beneficioCorto: "Hotel todo incluido frente al mar, con vuelos y traslados",
    imagenes: [
      "https://picsum.photos/seed/cancun-playa-caribe/1200/800",
      "https://picsum.photos/seed/cancun-zona-hotelera/600/600",
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
    vigenciaHasta: "2026-06-30",
    validadaEl: "2026-05-20",
    estado: "vigente",
    mayorista: "Mayorista ejemplo C",
  },
  {
    offerId: "OF-2026-0161",
    slug: "san-andres-borrador",
    destino: "San Andrés",
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
    vigenciaHasta: "2026-12-31",
    validadaEl: "2026-08-01",
    /** Extraída de una imagen pero sin validar: NUNCA debe renderizarse. */
    estado: "borrador",
    mayorista: "Mayorista ejemplo A",
  },
];
