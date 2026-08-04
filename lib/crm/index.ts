import type { ConsentRecord } from "@/lib/consent";

/**
 * Entrega del lead al sistema comercial.
 *
 * El sitio es un satélite del CRM, no el sistema (spec-tecnica.md §8.1). Su trabajo
 * termina aquí: capturar, registrar el consentimiento y entregar CON CONTEXTO.
 *
 * ⚠️ CONTRATO NO CERRADO. La forma exacta de este payload debe acordarse por escrito
 * con quien monte el CRM ANTES de dar por terminado el formulario: en GoHighLevel un
 * campo creado para el objeto Contacto no se puede convertir a Oportunidad después.
 * Ver mvp-features.md §Riesgos.
 */

/** Datos estables de la persona. En el CRM son campos de CONTACTO. */
export type LeadContact = {
  nombre: string;
  /** Siempre normalizado a E.164: sin esto falla la deduplicación de contactos. */
  telefono: string;
  email?: string;
  ciudadOrigen: string;
};

/**
 * Una intención de viaje concreta. En el CRM son campos de OPORTUNIDAD.
 *
 * La misma persona puede cotizar Cartagena hoy y Cancún en seis meses: esas
 * solicitudes no deben sobrescribirse entre sí.
 */
export type LeadOpportunity = {
  offerId?: string;
  destino?: string;
  fechaAproximada?: string;
  viajeros?: { adultos: number; menores: number };
};

export type LeadAttribution = {
  fuente: "web";
  paginaOrigen: string;
  locale: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
  };
};

export type LeadPayload = {
  contacto: LeadContact;
  oportunidad: LeadOpportunity;
  atribucion: LeadAttribution;
  consentimiento: ConsentRecord;
  /** Compartidos con el CRM para deduplicar conversiones (spec §8.5). */
  eventId: string;
  externalId: string;
};

/**
 * Normaliza un teléfono a E.164.
 *
 * Colombia (+57) es el país por defecto porque es el mercado del sitio. Un número
 * que ya venga con `+` se respeta tal cual.
 */
export function toE164(input: string, defaultCountryCode = "57"): string | null {
  const trimmed = input.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");

  if (digits.length === 0) return null;

  if (hasPlus) {
    return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null;
  }

  // Número nacional colombiano: 10 dígitos (celular).
  if (digits.length === 10) return `+${defaultCountryCode}${digits}`;

  // Ya trae el indicativo sin `+`.
  if (digits.startsWith(defaultCountryCode) && digits.length === 12) {
    return `+${digits}`;
  }

  return null;
}

/**
 * Envía el lead al CRM.
 *
 * TODO: implementar el webhook real a GoHighLevel una vez esté acordado el contrato
 * y la URL viva en las variables de entorno de Vercel (nunca en el repo).
 */
export async function sendLeadToCrm(payload: LeadPayload): Promise<void> {
  const webhookUrl = process.env.CRM_WEBHOOK_URL;

  if (!webhookUrl) {
    console.info("[crm] webhook sin configurar, lead no enviado", {
      eventId: payload.eventId,
      offerId: payload.oportunidad.offerId,
    });
    return;
  }

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
