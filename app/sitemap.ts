import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/config";
import { routing } from "@/lib/i18n/routing";

/**
 * Sitemap con entradas para ambos locales (spec-tecnica.md §3.5).
 *
 * Las rutas que NO deben indexarse —`/design-system`, `/gracias` y las landings
 * de campaña `/lp/[campana]`— no van aquí y además declaran `robots: index:false`
 * en su propia metadata.
 */

/** Rutas públicas indexables. Ampliar conforme se construyan en Fase 1. */
const ROUTES = ["", "/legal"] as const;

function urlFor(locale: string, route: string): string {
  // `es` es el locale por defecto y va sin prefijo (estrategia "as-needed").
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}${route}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: urlFor(routing.defaultLocale, route),
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, urlFor(locale, route)]),
      ),
    },
  }));
}
