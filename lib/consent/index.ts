/**
 * Registro de la autorización de tratamiento de datos (Ley 1581 de 2012).
 *
 * El checkbox no pre-marcado es necesario pero NO suficiente: hay que guardar la
 * evidencia de qué aceptó exactamente cada persona y cuándo (spec-tecnica.md §8.3).
 * Sin eso, la autorización no se puede acreditar después.
 */

/**
 * Versión del texto de la política aceptado.
 *
 * Si el texto cambia, ESTE valor cambia. Es lo que permite saber después qué aceptó
 * cada persona. Debe coincidir con la versión que muestra `/legal`.
 */
export const POLICY_VERSION = "v1";

/**
 * Canales que cubre la autorización.
 *
 * `publicidad` está incluido a propósito: si los leads alimentan audiencias de Meta,
 * la finalidad declarada tiene que nombrar la publicidad personalizada. "Contacto
 * comercial para asesoría de viaje" NO cubre ese uso.
 */
export const AUTHORIZED_CHANNELS = [
  "whatsapp",
  "llamada",
  "correo",
  "publicidad",
] as const;

export type AuthorizedChannel = (typeof AUTHORIZED_CHANNELS)[number];

export type ConsentRecord = {
  otorgado: boolean;
  textoAceptado: string;
  versionPolitica: string;
  fechaHora: string;
  formularioOrigen: string;
  identificadorTecnico: string;
  canalesAutorizados: readonly AuthorizedChannel[];
  revocado: boolean;
};

export function buildConsentRecord({
  otorgado,
  textoAceptado,
  formularioOrigen,
  identificadorTecnico,
}: {
  otorgado: boolean;
  textoAceptado: string;
  formularioOrigen: string;
  identificadorTecnico: string;
}): ConsentRecord {
  return {
    otorgado,
    textoAceptado,
    versionPolitica: POLICY_VERSION,
    fechaHora: new Date().toISOString(),
    formularioOrigen,
    identificadorTecnico,
    canalesAutorizados: AUTHORIZED_CHANNELS,
    revocado: false,
  };
}
