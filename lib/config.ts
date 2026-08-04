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

/** TODO: VERIFICAR — número real de WhatsApp comercial, en formato E.164 sin `+`. */
export const WHATSAPP_NUMBER = "57XXXXXXXXXX";

/** TODO: VERIFICAR — Registro Nacional de Turismo. Obligatorio en toda la publicidad. */
export const RNT_NUMBER = "XXXXXX";

/** TODO: VERIFICAR — datos de contacto y domicilio comercial. */
export const CONTACT = {
  ciudad: "Medellín, Colombia",
  direccion: "XXXXXX",
  telefono: "XXXXXX",
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
