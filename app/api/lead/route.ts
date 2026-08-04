import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { buildConsentRecord } from "@/lib/consent";
import { sendLeadToCrm, toE164, type LeadPayload } from "@/lib/crm";
import { createEventId, createExternalId } from "@/lib/tracking/events";

/**
 * Recepción de leads del formulario corto.
 *
 * Es un endpoint propio y no un formulario embebido del CRM: hace falta para validar
 * en servidor, controlar el consentimiento y no degradar el rendimiento de la página.
 */

type LeadRequestBody = {
  nombre?: string;
  telefono?: string;
  email?: string;
  ciudadOrigen?: string;
  fechaAproximada?: string;
  viajeros?: { adultos?: number; menores?: number };
  offerId?: string;
  destino?: string;
  paginaOrigen?: string;
  locale?: string;
  utm?: Record<string, string>;
  consentimiento?: { otorgado?: boolean; textoAceptado?: string };
};

export async function POST(request: Request) {
  let body: LeadRequestBody;

  try {
    body = (await request.json()) as LeadRequestBody;
  } catch {
    return NextResponse.json(
      { error: "invalid_json" },
      { status: 400 },
    );
  }

  /**
   * El consentimiento se valida PRIMERO y en el servidor.
   *
   * Nunca se infiere de que la persona haya enviado el formulario: sin autorización
   * expresa no hay lead que capturar (Ley 1581 de 2012).
   */
  if (!body.consentimiento?.otorgado || !body.consentimiento.textoAceptado) {
    return NextResponse.json(
      { error: "consent_required" },
      { status: 422 },
    );
  }

  const nombre = body.nombre?.trim();
  const ciudadOrigen = body.ciudadOrigen?.trim();

  if (!nombre || !ciudadOrigen) {
    return NextResponse.json(
      { error: "missing_required_fields", fields: ["nombre", "ciudadOrigen"] },
      { status: 422 },
    );
  }

  const telefono = body.telefono ? toE164(body.telefono) : null;

  if (!telefono) {
    return NextResponse.json(
      { error: "invalid_phone" },
      { status: 422 },
    );
  }

  const headerList = await headers();
  const identificadorTecnico =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const eventId = createEventId();
  const externalId = await createExternalId(telefono);

  const payload: LeadPayload = {
    contacto: { nombre, telefono, email: body.email?.trim(), ciudadOrigen },
    oportunidad: {
      offerId: body.offerId,
      destino: body.destino,
      fechaAproximada: body.fechaAproximada,
      viajeros: body.viajeros
        ? {
            adultos: body.viajeros.adultos ?? 1,
            menores: body.viajeros.menores ?? 0,
          }
        : undefined,
    },
    atribucion: {
      fuente: "web",
      paginaOrigen: body.paginaOrigen ?? "unknown",
      locale: body.locale ?? "es",
      utm: body.utm,
    },
    consentimiento: buildConsentRecord({
      otorgado: true,
      textoAceptado: body.consentimiento.textoAceptado,
      formularioOrigen: body.paginaOrigen ?? "unknown",
      identificadorTecnico,
    }),
    eventId,
    externalId,
  };

  try {
    await sendLeadToCrm(payload);
  } catch (error) {
    console.error("[api/lead] fallo al entregar el lead al CRM", error);
    return NextResponse.json({ error: "crm_unavailable" }, { status: 502 });
  }

  // TODO: emitir el evento `Lead` a Meta CAPI con este mismo eventId (Fase 2).
  return NextResponse.json({ ok: true, eventId }, { status: 200 });
}
