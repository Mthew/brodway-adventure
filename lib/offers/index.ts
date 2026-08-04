import { MOCK_OFFERS } from "@/lib/mock/offers";
import { isExpired, isPublishable, type Offer } from "@/lib/types/offer";

/**
 * ÚNICA puerta de acceso a las ofertas.
 *
 * Hoy lee de mocks locales. La fuente real está sin decidir —CMS o base de ofertas
 * externa, ver mvp-features.md §Riesgos— y esa decisión queda contenida aquí: cuando
 * se tome, cambia el interior de este módulo y ninguna página se toca.
 *
 * Ninguna página debe importar de `lib/mock/` directamente.
 */

/** Ofertas publicables: vigentes y dentro de su ventana de validez. */
export async function listActiveOffers(): Promise<Offer[]> {
  return MOCK_OFFERS.filter((offer) => isPublishable(offer));
}

export type OfferLookup =
  | { status: "found"; offer: Offer }
  | { status: "expired"; offer: Offer }
  | { status: "not-found" };

/**
 * Busca una oferta por slug.
 *
 * Devuelve `expired` en vez de `not-found` cuando la tarifa venció, porque la página
 * NO debe responder 404: tiene que renderizar el estado de tarifa vencida con CTA de
 * recotización (spec-tecnica.md §8.4). Quien llega a una oferta vencida sigue siendo
 * un lead con intención alta.
 *
 * Un `borrador` sí se trata como inexistente: nunca debe ser visible.
 */
export async function getOffer(slug: string): Promise<OfferLookup> {
  const offer = MOCK_OFFERS.find((candidate) => candidate.slug === slug);

  if (!offer || offer.estado === "borrador") {
    return { status: "not-found" };
  }

  return isExpired(offer)
    ? { status: "expired", offer }
    : { status: "found", offer };
}
