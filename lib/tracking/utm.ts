/**
 * Persistencia de UTMs.
 *
 * POR QUÉ HACE FALTA GUARDARLOS:
 * los UTMs llegan en la URL de la primera página, pero el lead se envía después,
 * quizá desde otra página del sitio. Si sólo se leen de `window.location` en el
 * momento del envío, toda conversión que no ocurra en la misma página de entrada
 * pierde su origen y la atribución de campaña se rompe en silencio.
 *
 * `sessionStorage` y no `localStorage` a propósito: la atribución pertenece a la
 * visita, no al navegador. Con `localStorage`, alguien que llegó por un anuncio en
 * marzo seguiría atribuyéndose a esa campaña en junio.
 */

const CLAVE = "broway_utm";

/** Sólo estos cinco. No se guarda ningún parámetro suelto de la URL. */
const PARAMETROS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type Utm = Partial<Record<(typeof PARAMETROS)[number], string>>;

/**
 * Guarda los UTMs de la URL actual, si los hay.
 *
 * No sobrescribe con un objeto vacío: navegar a una página interna sin UTMs no
 * puede borrar el origen de la visita.
 */
export function capturarUtm(search: string = window.location.search): void {
  const params = new URLSearchParams(search);
  const encontrados: Utm = {};

  for (const clave of PARAMETROS) {
    const valor = params.get(clave);
    if (valor) encontrados[clave] = valor.slice(0, 200);
  }

  if (Object.keys(encontrados).length === 0) return;

  try {
    sessionStorage.setItem(CLAVE, JSON.stringify(encontrados));
  } catch {
    // Modo privado o storage bloqueado: se pierde la atribución, no el lead.
  }
}

/** Devuelve los UTMs guardados, o `undefined` si no hay ninguno. */
export function leerUtm(): Utm | undefined {
  try {
    const guardado = sessionStorage.getItem(CLAVE);
    if (!guardado) return undefined;

    const datos = JSON.parse(guardado) as Utm;
    return Object.keys(datos).length > 0 ? datos : undefined;
  } catch {
    return undefined;
  }
}
