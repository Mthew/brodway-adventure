/**
 * Una tarifa publicada NO es un número escrito a mano: es una oferta con
 * trazabilidad y vigencia (spec-tecnica.md §8.4).
 *
 * Los campos de procedencia y vigencia son obligatorios a propósito. Sin ciudad de
 * origen y ocupación base, un precio "desde" no significa nada — el mismo viaje
 * cuesta distinto saliendo de Medellín o de Bogotá, y en doble o en sencilla.
 */
export type OfferEstado = "vigente" | "vencida" | "borrador";

export type ItinerarioDia = {
  dia: number;
  titulo: string;
  /** Máximo 2-3 experiencias por día. No llenar el día por llenarlo. */
  descripcion: string;
};

export type FechaSalida = {
  /** ISO. */
  fecha: string;
  /**
   * Cupos reales. Se muestra como DATO ("Quedan 4 cupos"), nunca como cuenta
   * regresiva ni con lenguaje de presión: la urgencia inventada está prohibida
   * por marca (brief-v0-producto.md §7.1).
   */
  cuposDisponibles: number;
};

export type PreguntaFrecuente = {
  pregunta: string;
  respuesta: string;
};

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

  /**
   * Itinerario día a día.
   *
   * En Fase 1 se renderiza RESUMIDO: `fases-entrega.md` §Fase 1 pide "itinerario
   * resumido" y coloca el día a día completo con mapa en Fase 2. El dato se modela
   * entero desde ahora para no migrar después (plan-fase-1.md §3.1).
   */
  itinerario: ItinerarioDia[];

  /**
   * Fechas de salida con cupos.
   *
   * MODELADO PERO NO RENDERIZADO EN FASE 1 — no es un olvido: `fases-entrega.md`
   * coloca "fechas de salida y cupos disponibles" en Fase 2. Al renderizarlo, se
   * muestra como dato sereno, nunca como escasez con presión.
   */
  fechasSalida: FechaSalida[];

  politicaCancelacion: string;
  faq: PreguntaFrecuente[];

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
