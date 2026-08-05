/**
 * Consentimiento de cookies (Consent Mode v2).
 *
 * NO CONFUNDIR con el consentimiento de datos personales del formulario.
 * Son dos cosas distintas y la ley las trata distinto:
 *
 *   - `lib/consent/` es la autorización de tratamiento de datos de la Ley 1581.
 *     La persona la otorga marcando una casilla y queda registrada como evidencia
 *     junto al lead.
 *   - ESTE archivo es el consentimiento de cookies y medición. Gobierna si se
 *     cargan GA4 y los píxeles, y no identifica a nadie.
 *
 * Enviar el formulario NO otorga este consentimiento, y aceptar cookies NO otorga
 * el otro. Mezclarlos sería exactamente el atajo que la normativa prohíbe.
 */

/**
 * Categorías de Consent Mode v2.
 *
 * `security_storage` no aparece: es funcional, siempre está concedido y no se
 * puede rechazar. Declararlo como opción daría a entender que es negociable.
 */
export type ConsentState = {
  /** GA4 y medición de audiencia. */
  analytics_storage: "granted" | "denied";
  /** Píxeles de Meta y TikTok, y audiencias personalizadas. */
  ad_storage: "granted" | "denied";
  ad_user_data: "granted" | "denied";
  ad_personalization: "granted" | "denied";
};

/**
 * Todo denegado.
 *
 * Es el estado ANTES de que la persona decida, y el que se declara a Google antes
 * de cargar ninguna etiqueta. Consent Mode v2 exige que el default sea denegado:
 * si se declarara concedido "hasta que rechacen", la medición ya habría ocurrido
 * cuando la persona dice que no.
 */
export const CONSENT_DENEGADO: ConsentState = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

export const CONSENT_CONCEDIDO: ConsentState = {
  analytics_storage: "granted",
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
};

/**
 * `localStorage` y NO `sessionStorage`, al revés que los UTMs.
 *
 * La decisión sobre cookies pertenece a la persona y debe sobrevivir a la sesión:
 * volver a preguntar en cada visita a alguien que ya dijo que no es acoso, y
 * además invalida el registro de su decisión.
 */
const CLAVE = "broway_consent";

/** Versión del texto del banner. Si cambia el texto, se vuelve a preguntar. */
export const CONSENT_VERSION = "v1";

type ConsentGuardado = {
  version: string;
  estado: ConsentState;
  fecha: string;
};

/** Devuelve la decisión guardada, o `null` si la persona aún no ha decidido. */
export function leerConsentimiento(): ConsentState | null {
  try {
    const guardado = localStorage.getItem(CLAVE);
    if (!guardado) return null;

    const datos = JSON.parse(guardado) as ConsentGuardado;

    // Un texto nuevo es una pregunta nueva: la decisión anterior no lo cubre.
    if (datos.version !== CONSENT_VERSION) return null;

    return datos.estado;
  } catch {
    return null;
  }
}

export function guardarConsentimiento(estado: ConsentState): void {
  try {
    const datos: ConsentGuardado = {
      version: CONSENT_VERSION,
      estado,
      fecha: new Date().toISOString(),
    };
    localStorage.setItem(CLAVE, JSON.stringify(datos));
  } catch {
    // Storage bloqueado: la decisión vale para esta carga de página y se
    // volverá a preguntar. Es el comportamiento correcto: sin poder registrar
    // la decisión, no se puede dar por concedida.
  }
}
