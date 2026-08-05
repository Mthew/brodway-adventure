import { emitirEvento, HAY_MEDICION_CONFIGURADA } from "@/lib/tracking/analytics";

/**
 * Eventos de conversión.
 *
 * El sitio NO es dueño del embudo (spec-tecnica.md §8.5). Sólo emite:
 *   - `ViewContent`  cuando alguien ve una oferta
 *   - `Lead`         cuando envía el formulario o hace clic a WhatsApp
 *
 * Todo lo posterior —QualifiedLead, QuoteRequested, QuoteSent, BookingStarted,
 * DepositPaid, Sale— lo emite el CRM, porque ocurre allí y no aquí. Si hace falta
 * un evento nuevo post-lead, se agrega en el CRM, no en este archivo.
 *
 * El `eventId` se comparte con el CRM para deduplicar: sin eso, la misma conversión
 * se cuenta dos veces y la optimización de campaña se degrada.
 *
 * NADA SE EMITE SIN CONSENTIMIENTO. `emitirEvento` no hace nada si no hay medición
 * configurada, y las etiquetas sólo se cargan tras aceptar el banner de cookies.
 */

export type LeadContext = {
  offerId?: string;
  campaign?: string;
  page: string;
  locale: string;
};

/** Identificador de evento compartido entre el sitio y el CRM. */
export function createEventId(): string {
  return crypto.randomUUID();
}

/**
 * Identificador estable por contacto, derivado del teléfono ya normalizado.
 * Estable = el mismo contacto produce siempre el mismo valor, para que las
 * plataformas puedan unir eventos de distintas sesiones.
 */
export async function createExternalId(phoneE164: string): Promise<string> {
  const data = new TextEncoder().encode(phoneE164);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * En desarrollo, y mientras no haya cuentas de medición, los eventos se registran
 * en consola. Es la única forma de verificar que se disparan cuando toca sin
 * cuentas reales, y desaparece solo en cuanto se configuren.
 */
function registrar(nombre: string, datos: Record<string, unknown>): void {
  if (!HAY_MEDICION_CONFIGURADA) {
    console.info(`[tracking] ${nombre}`, datos);
  }
}

/** Clic en cualquier CTA de WhatsApp. Es la conversión dominante del sitio. */
export function trackWhatsAppClick(context: LeadContext): void {
  registrar("whatsapp_click", context);
  emitirEvento("whatsapp_click", { ...context });
}

/** Lead enviado por formulario. Equivale a `generate_lead` en GA4. */
export function trackLead(context: LeadContext & { eventId: string }): void {
  registrar("lead", context);
  emitirEvento("generate_lead", { ...context });
}

/** Vista de una oferta concreta. */
export function trackViewContent(context: LeadContext): void {
  registrar("view_content", context);
  emitirEvento("ViewContent", { ...context });
}
