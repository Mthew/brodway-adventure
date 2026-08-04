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
    imagenes: ["/placeholder/eje-cafetero.jpg"],
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
    imagenes: ["/placeholder/cartagena.jpg"],
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
    imagenes: ["/placeholder/cancun.jpg"],
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
    vigenciaHasta: "2026-12-31",
    validadaEl: "2026-08-01",
    /** Extraída de una imagen pero sin validar: NUNCA debe renderizarse. */
    estado: "borrador",
    mayorista: "Mayorista ejemplo A",
  },
];
