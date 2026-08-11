/**
 * Configuración del sitio.
 *
 * Todo lo que está marcado con TODO son datos que NO están confirmados. No los
 * inventes ni los completes con valores de otra agencia: el RNT y los datos
 * legales tienen que verificarse antes de publicar (CLAUDE.md §Legal).
 */

/** TODO: VERIFICAR — dominio real antes del primer deploy. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://browayadventures.com";

/** Confirmado por el cliente el 2026-08-05. E.164 sin `+`: 57 + 3054513307. */
export const WHATSAPP_NUMBER = "573054513307";

/**
 * Registro Nacional de Turismo. Confirmado por el cliente el 2026-08-05.
 *
 * Obligatorio en toda la publicidad de un prestador turístico, no sólo en el pie:
 * por eso aparece también junto a cada precio publicado.
 */
export const RNT_NUMBER = "297515";

/** NIT con dígito de verificación. Confirmado por el cliente el 2026-08-05. */
export const NIT_NUMBER = "1040742725-1";

/**
 * TODO: VERIFICAR — afiliaciones gremiales.
 *
 * Vacío a propósito: `investigation.md` menciona ANATO e IATA como sellos que usan
 * los competidores, pero que BroWay esté afiliada NO está confirmado. Un sello de
 * confianza inventado es peor que ninguno, porque es verificable y desmiente todo
 * lo demás de la página.
 */
export const AFILIACIONES: readonly string[] = [];

/**
 * Datos de contacto. Dirección y teléfono confirmados el 2026-08-05.
 *
 * El cliente entregó la dirección sin repetir la ciudad; se mantiene Medellín,
 * que es la sede según toda la documentación. TODO: confirmar el correo, que
 * sigue siendo el supuesto de la Fase 0 y no lo entregó el cliente.
 */
export const CONTACT = {
  ciudad: "Medellín, Colombia",
  direccion: "Cl 2B Sur #78B-06",
  /** Mismo número que WhatsApp, en formato legible. */
  telefono: "305 4513307",
  email: "hola@browayadventures.com",
} as const;

/**
 * Construye el enlace de WhatsApp con el mensaje ya escrito.
 *
 * El mensaje pre-llenado no es decorativo: es lo que le da contexto al asesor para
 * que no vuelva a preguntar qué vio la persona (sistema-comercial.md §"Relación
 * entre oferta, lead y página"). Cuando la conversación sale de una oferta, pasa
 * también el `offerId`.
 */
export function buildWhatsAppUrl({
  message,
  offerId,
  campaign,
}: {
  message: string;
  offerId?: string;
  campaign?: string;
}): string {
  const context = [
    offerId ? `[ref: ${offerId}]` : null,
    campaign ? `[campaña: ${campaign}]` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const text = context ? `${message} ${context}` : message;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
