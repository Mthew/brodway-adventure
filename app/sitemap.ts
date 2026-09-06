import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/config";
import { routing } from "@/lib/i18n/routing";
import { listDestinationSlugs } from "@/lib/destinations";
import { listOfferSlugs } from "@/lib/offers";

/**
 * Sitemap con entradas para ambos locales (spec-tecnica.md §3.5).
 *
 * Las rutas que NO deben indexarse —`/design-system`, `/demo-crm`, `/gracias` y
 * las landings de campaña `/lp/[campana]`— no van aquí y además declaran
 * `robots: index:false` en su propia metadata.
 *
 * Las rutas dinámicas se leen de las mismas capas que usan las páginas
 * (`lib/offers`, `lib/destinations`) y no de una lista escrita a mano: una lista
 * paralela se desincroniza en cuanto se publica una oferta, y nadie se entera
 * porque el sitemap sigue generándose sin error.
 */

/** Rutas estáticas indexables. */
const RUTAS_FIJAS = [
  "",
  "/destinos",
  "/destinos/internacionales",
  "/destinos/nacionales",
  "/destinos/pueblos-de-antioquia",
  "/ofertas",
  "/playas-y-hoteles",
  "/nosotros",
  "/contacto",
  "/como-pagar",
  "/faq",
  "/legal",
] as const;

function urlFor(locale: string, route: string): string {
  // `es` es el locale por defecto y va sin prefijo (estrategia "as-needed").
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}${route}`;
}

function entrada(route: string): MetadataRoute.Sitemap[number] {
  return {
    url: urlFor(routing.defaultLocale, route),
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, urlFor(locale, route)]),
      ),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [destinos, ofertas] = await Promise.all([
    listDestinationSlugs(),
    listOfferSlugs(),
  ]);

  return [
    ...RUTAS_FIJAS.map(entrada),
    ...destinos.map((slug) => entrada(`/destinos/${slug}`)),
    /**
     * `listOfferSlugs` incluye las tarifas VENCIDAS a propósito: su página existe,
     * responde 200 y capta un lead con intención alta. Dejarlas fuera del sitemap
     * contradiría esa decisión. Los borradores sí quedan excluidos, porque no
     * deben ser visibles en ningún sitio.
     */
    ...ofertas.map((slug) => entrada(`/ofertas/${slug}`)),
  ];
}
