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
  /**
   * Destino al que pertenece, por slug.
   *
   * Explícito y no emparejado por el nombre: `destino` es texto editable y
   * cualquier cambio de tilde o mayúscula rompería la relación en silencio.
   */
  destinoSlug: string;
  /** Ciudad de salida. Cambia el precio: nunca omitirla en la publicación. */
  ciudadOrigen: string;
  noches: number;
  /** Ocupación con la que se calculó el precio "desde" (ej. "doble"). */
  ocupacionBase: string;

  /**
   * Hotel de la oferta.
   *
   * Opcional porque no toda oferta lo tiene (un tour no lo lleva), pero es lo que
   * hace legible la sección "Mejores Playas y Hoteles", dirigida a quien NO compra
   * por precio (`estructura-funcional-cliente.md` §7).
   */
  hotel?: string;
  /** Régimen alimenticio (ej. "Todo incluido", "Desayuno"). §7 y §16. */
  alimentacion?: string;
  /**
   * Fechas del VIAJE en texto ("8 al 12 de junio"), no de la vigencia de la tarifa.
   *
   * Son dos cosas distintas y confundirlas publica una fecha equivocada:
   * `vigenciaHasta` es hasta cuándo se puede vender; esto es cuándo se viaja.
   */
  fechaPeriodo?: string;

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

  /** Condiciones que no caben en incluye/no incluye (§17, §25). */
  informacionImportante?: string[];
  /** Requisitos del viajero: vacunas, edad mínima, condición física (§17). */
  requisitos?: string[];
  /** Documentación exigida por el destino: pasaporte, visa, vigencia mínima (§17). */
  documentacion?: string[];

  /** Primera fecha en que la tarifa es válida (ISO). §25 y §27 piden las dos puntas. */
  vigenciaDesde: string;
  /** Última fecha en que la tarifa es válida (ISO). */
  vigenciaHasta: string;
  /** Última verificación humana de la tarifa (ISO). Se muestra junto al precio. */
  validadaEl: string;
  /**
   * Última edición de la ficha (ISO).
   *
   * NO es lo mismo que `validadaEl`: corregir una falta de ortografía en la
   * descripción no es volver a confirmar el precio con el mayorista. El cliente pide
   * las dos por separado (§25 "fecha de última actualización" vs. el bloque de
   * disclosure de `spec-tecnica.md` §8.4).
   */
  actualizadoEl: string;
  estado: OfferEstado;

  /** Mayorista fuente. Uso interno: NUNCA se muestra en el sitio ni en la publicidad. */
  mayorista?: string;

  /*
   * Campos de CURADURÍA (`estructura-funcional-cliente.md` §26).
   *
   * Son BANDERAS sobre la oferta, no una entidad `Coleccion` con miembros. El §26 es
   * explícito: "la oferta debe existir una sola vez", y modelar las colecciones como
   * entidad obliga a duplicarla o a mantener tablas de unión que se desincronizan.
   * Con banderas, cambiar el precio actualiza todas las secciones a la vez porque
   * sólo hay una fila que cambiar.
   */

  /** Sección "Mejores Ofertas": las que la agencia destaca por tarifa. */
  mostrarEnMejoresOfertas: boolean;
  /** Sección "Mejores Playas y Hoteles": selección curada, sin sistema de puntuación (§7). */
  mostrarEnPlayasYHoteles: boolean;
  mostrarEnHome: boolean;
  /** Orden de aparición dentro de cualquier sección donde salga. Menor va primero. */
  orden: number;
};

/** Una oferta que ya no se puede vender, con el dato necesario para explicarlo. */
export type ExpiredOffer = Offer & {
  estado: "vencida";
};

/**
 * La tarifa YA PASÓ su fecha final.
 *
 * Es más estrecho que "no publicable" a propósito: sólo esto justifica renderizar la
 * página de tarifa vencida con CTA de recotización (`spec-tecnica.md` §8.4). Una
 * oferta que todavía no ha empezado no está vencida — simplemente no se lista.
 */
export function isExpired(offer: Offer, now: Date = new Date()): boolean {
  if (offer.estado !== "vigente") return true;
  return new Date(offer.vigenciaHasta).getTime() < now.getTime();
}

/** La ventana de vigencia todavía no ha abierto. Ni publicable ni vencida. */
export function isNotYetValid(offer: Offer, now: Date = new Date()): boolean {
  return new Date(offer.vigenciaDesde).getTime() > now.getTime();
}

/**
 * Sólo `vigente` y DENTRO de la ventana de validez es publicable.
 *
 * Las dos puntas cuentan (§27 pide fecha inicial y final): una promoción cargada con
 * antelación para salir el mes que viene no puede filtrarse hoy al sitio.
 *
 * Un `borrador` es una oferta extraída de una imagen por IA pero todavía sin validar
 * por una persona. Nunca llega a producción: es el riesgo "agente que inventa tarifas"
 * del roadmap comercial.
 */
export function isPublishable(offer: Offer, now: Date = new Date()): boolean {
  return !isExpired(offer, now) && !isNotYetValid(offer, now);
}
