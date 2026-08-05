import { MOCK_CAMPAIGNS } from "@/lib/mock/campaigns";
import { getOfferById } from "@/lib/offers";
import { isExpired } from "@/lib/types/offer";
import type { Campaign } from "@/lib/types/campaign";

/**
 * ÚNICA puerta de acceso a las campañas, igual que `lib/offers` y
 * `lib/destinations`.
 */

export async function listCampaignSlugs(): Promise<string[]> {
  return MOCK_CAMPAIGNS.map((campana) => campana.slug);
}

export type CampaignLookup =
  | { status: "found"; campaign: Campaign; tarifaVencida: boolean }
  | { status: "not-found" };

/**
 * Busca una campaña y comprueba de paso si su oferta sigue vigente.
 *
 * POR QUÉ IMPORTA:
 * una landing es la página a la que apunta dinero en pauta. Si la tarifa venció y
 * la landing sigue prometiendo el precio del anuncio, se está pagando por llevar
 * gente a una promesa que ya no se puede cumplir, que es exactamente el problema
 * que el ciclo de vida de la oferta viene a evitar (spec-tecnica.md §8.4).
 *
 * La landing no se cae: sigue captando, pero sin sostener el precio.
 */
export async function getCampaign(slug: string): Promise<CampaignLookup> {
  const campaign = MOCK_CAMPAIGNS.find((candidata) => candidata.slug === slug);

  if (!campaign) return { status: "not-found" };

  if (!campaign.offerId) {
    return { status: "found", campaign, tarifaVencida: false };
  }

  const oferta = await getOfferById(campaign.offerId);

  // Sin oferta (borrada o en borrador) se trata como vencida: la landing capta,
  // pero no sostiene un precio que nadie ha validado.
  return {
    status: "found",
    campaign,
    tarifaVencida: oferta ? isExpired(oferta) : true,
  };
}
