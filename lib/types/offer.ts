/**
 * Una tarifa publicada NO es un número escrito a mano: es una oferta con
 * trazabilidad y vigencia (spec-tecnica.md §8.4).
 *
 * Los campos de procedencia y vigencia son obligatorios a propósito. Sin ciudad de
 * origen y ocupación base, un precio "desde" no significa nada — el mismo viaje
 * cuesta distinto saliendo de Medellín o de Bogotá, y en doble o en sencilla.
 */
export type OfferEstado = "vigente" | "vencida" | "borrador";

export type Offer = {
  /** Identificador único. Viaja al CRM en el payload del lead para que el asesor tenga contexto. */
  offerId: string;
  slug: string;

  destino: string;
  /** Ciudad de salida. Cambia el precio: nunca omitirla en la publicación. */
  ciudadOrigen: string;
  noches: number;
  /** Ocupación con la que se calculó el precio "desde" (ej. "doble"). */
  ocupacionBase: string;

  precioDesde: number;
  moneda: "COP" | "USD";

  titulo: string;
  beneficioCorto: string;
  imagenes: string[];
  highlights: string[];
  incluye: string[];
  noIncluye: string[];

  /** Última fecha en que la tarifa es válida (ISO). */
  vigenciaHasta: string;
  /** Última verificación humana de la tarifa (ISO). Se muestra junto al precio. */
  validadaEl: string;
  estado: OfferEstado;

  /** Mayorista fuente. Uso interno: NUNCA se muestra en el sitio ni en la publicidad. */
  mayorista?: string;
};

/** Una oferta que ya no se puede vender, con el dato necesario para explicarlo. */
export type ExpiredOffer = Offer & {
  estado: "vencida";
};

export function isExpired(offer: Offer, now: Date = new Date()): boolean {
  if (offer.estado !== "vigente") return true;
  return new Date(offer.vigenciaHasta).getTime() < now.getTime();
}

/**
 * Sólo `vigente` y dentro de la ventana de validez es publicable.
 *
 * Un `borrador` es una oferta extraída de una imagen por IA pero todavía sin validar
 * por una persona. Nunca llega a producción: es el riesgo "agente que inventa tarifas"
 * del roadmap comercial.
 */
export function isPublishable(offer: Offer, now: Date = new Date()): boolean {
  return !isExpired(offer, now);
}
