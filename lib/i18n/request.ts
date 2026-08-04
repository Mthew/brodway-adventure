import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";

import { routing } from "./routing";

/**
 * Carga los mensajes de interfaz del locale activo.
 *
 * Aquí viven SOLO los textos fijos de UI (botones, labels, footer, navegación).
 * El contenido editorial —destinos, paquetes, blog— no vive en estos JSON: viene
 * del CMS con su propio modelo multilenguaje (spec-tecnica.md §3.2 y §3.4).
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
});
