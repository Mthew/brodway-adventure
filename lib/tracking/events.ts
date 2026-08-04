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

// TODO: conectar con GA4 (`generate_lead`), Meta Pixel y TikTok Pixel.
export function trackWhatsAppClick(context: LeadContext): void {
  console.info("[tracking] whatsapp_click", context);
}

// TODO: conectar con GA4 (`generate_lead`), Meta Pixel y TikTok Pixel.
export function trackLead(context: LeadContext & { eventId: string }): void {
  console.info("[tracking] lead", context);
}

// TODO: conectar con Meta Pixel (`ViewContent`).
export function trackViewContent(context: LeadContext): void {
  console.info("[tracking] view_content", context);
}
