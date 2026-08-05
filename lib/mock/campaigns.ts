import type { Campaign } from "@/lib/types/campaign";

/**
 * CAMPAÑAS DE EJEMPLO.
 *
 * Nadie importa este archivo directamente: se accede por `lib/campaigns`.
 *
 * El `offerId` apunta a una oferta real de `lib/mock/offers.ts`, para que el lead
 * llegue al CRM con la oferta que la persona vio. Si la oferta vence, la landing
 * lo detecta: ver `lib/campaigns/index.ts`.
 */
export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    slug: "eje-cafetero-septiembre",
    codigo: "META-EJE-SEP26",
    offerId: "OF-2026-0142",
    destino: "Eje Cafetero",
    titular: "Cuatro días en el Eje Cafetero, con guía local",
    subtitular:
      "Fincas de café, Valle de Cocora y Salento. Traslados y alojamiento resueltos.",
    imagen: "https://picsum.photos/seed/eje-cafetero-finca-cafe/1600/900",
    imagenAlt: "Cafetales en ladera al amanecer en el Eje Cafetero",
    pruebaSocial: "Agencia registrada en Medellín, con asesor humano de principio a fin.",
    incluye: [
      "3 noches de alojamiento con desayuno",
      "Recorrido guiado por una finca cafetera tradicional",
      "Día completo en el Valle de Cocora",
      "Transporte terrestre durante todo el recorrido",
      "Asistencia médica en viaje",
    ],
    itinerarioResumen: [
      {
        titulo: "Llegada y Salento",
        texto: "Te recibimos y la tarde queda libre para caminar el pueblo.",
      },
      {
        titulo: "Finca cafetera",
        texto: "Del grano a la taza, con la familia que lo cultiva.",
      },
      {
        titulo: "Valle de Cocora",
        texto: "Día completo entre palmas de cera, con ruta corta y ruta larga.",
      },
      {
        titulo: "Regreso",
        texto: "Mañana libre y traslado al aeropuerto según tu vuelo.",
      },
    ],
    faq: [
      {
        pregunta: "¿El precio incluye los tiquetes aéreos?",
        respuesta:
          "No. El plan cubre alojamiento, traslados terrestres y actividades. Te cotizamos los vuelos aparte si los necesitas.",
      },
      {
        pregunta: "¿Puedo salir desde otra ciudad?",
        respuesta:
          "Sí. El precio publicado sale desde Medellín. Cuéntanos tu ciudad y te pasamos el valor ajustado.",
      },
      {
        pregunta: "¿La caminata es exigente?",
        respuesta:
          "Hay dos rutas en el Valle de Cocora: una de unas cinco horas y una corta al mirador. Eliges el mismo día.",
      },
      {
        pregunta: "¿Cómo se reserva?",
        respuesta:
          "Se separa con el 30% del valor y el saldo se paga en cuotas acordadas antes de la salida. No es un crédito.",
      },
    ],
    cta: "Cotiza por WhatsApp",
  },
];
