import { defineRouting } from "next-intl/routing";

/**
 * Estrategia de routing por locale — spec-tecnica.md §3.1.
 *
 * `es` es el idioma por defecto y va SIN prefijo; `en` va con prefijo `/en`.
 * La audiencia primaria es hispanohablante en Colombia: no forzar `/es/` en cada
 * URL evita fricción de SEO y deja los links de anuncios más cortos.
 *
 * Slugs: en el MVP son los mismos en ambos idiomas. Slugs localizados
 * (`/en/destinations/coffee-region`) se evalúan en Fase 2 si el SEO en inglés
 * lo justifica — por eso aquí no hay mapa de `pathnames`.
 */
export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
