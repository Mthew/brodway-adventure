import { MOCK_DESTINATIONS } from "@/lib/mock/destinations";
import { listActiveOffers } from "@/lib/offers";
import type { Destination } from "@/lib/types/destination";
import type { Offer } from "@/lib/types/offer";

/**
 * ÚNICA puerta de acceso a los destinos.
 *
 * Mismo patrón que `lib/offers`: hoy lee de mocks locales y en Fase 2 la edición
 * pasa a un CMS (`fases-entrega.md`). Cuando eso ocurra cambia el interior de este
 * módulo y ninguna página se toca.
 *
 * Ninguna página debe importar de `lib/mock/` directamente.
 */

export async function listDestinations(): Promise<Destination[]> {
  return MOCK_DESTINATIONS;
}

export async function listDestinationSlugs(): Promise<string[]> {
  return MOCK_DESTINATIONS.map((destino) => destino.slug);
}

export async function getDestination(
  slug: string,
): Promise<Destination | null> {
  return MOCK_DESTINATIONS.find((destino) => destino.slug === slug) ?? null;
}

/** Ofertas publicables de un destino. Una vencida no se ofrece como catálogo. */
export async function listOffersForDestination(
  destinoSlug: string,
): Promise<Offer[]> {
  const offers = await listActiveOffers();
  return offers.filter((offer) => offer.destinoSlug === destinoSlug);
}

/**
 * Precio "desde" de un destino, calculado de sus ofertas VIGENTES.
 *
 * Devuelve `null` si no hay ninguna, y entonces la tarjeta se muestra sin precio.
 * Esa es la decisión correcta: un precio desactualizado es peor que ningún precio,
 * y el "desde" de un destino no es un dato editable sino el resultado de las
 * ofertas que hoy se pueden vender.
 */
export async function getDestinationFromPrice(
  destinoSlug: string,
): Promise<{ precioDesde: number; moneda: Offer["moneda"] } | null> {
  const offers = await listOffersForDestination(destinoSlug);
  if (offers.length === 0) return null;

  const masBarata = offers.reduce((minima, offer) =>
    offer.precioDesde < minima.precioDesde ? offer : minima,
  );

  return { precioDesde: masBarata.precioDesde, moneda: masBarata.moneda };
}
