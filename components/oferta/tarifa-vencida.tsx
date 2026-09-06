import { getFormatter, getTranslations } from "next-intl/server";

import { ButtonLink } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/layout/whatsapp-floating";
import { buildWhatsAppUrl } from "@/lib/config";
import type { Offer } from "@/lib/types/offer";

/**
 * Estado de tarifa vencida.
 *
 * Esta página NO devuelve 404 y NO muestra el precio como si fuera comprable
 * (spec-tecnica.md §8.4). Quien llega a una oferta vencida sigue siendo un lead con
 * intención alta: viene de un enlace guardado, de un anuncio antiguo o de una
 * búsqueda, y ya sabe qué quiere. Un 404 lo pierde.
 *
 * OJO, esto NO es urgencia falsa: la fecha es un dato real y verificable, no un
 * contador que se reinicia. Los contadores siguen prohibidos por marca.
 */
export async function TarifaVencida({ offer }: { offer: Offer }) {
  const t = await getTranslations("ofertas");
  const format = await getFormatter();

  const vigenciaHasta = format.dateTime(new Date(offer.vigenciaHasta), {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const href = buildWhatsAppUrl({
    message: t("vencidaMensajeWhatsapp", { titulo: offer.titulo }),
    offerId: offer.offerId,
  });

  return (
    <div className="border-warning/30 bg-warning/5 flex flex-col gap-4 rounded-lg border p-6">
      <h2 className="text-h3 text-brand-navy">{t("vencidaTitulo")}</h2>

      <p className="text-body text-neutral-700">
        {t("vencidaTexto", { fecha: vigenciaHasta })}
      </p>

      <ButtonLink
        href={href}
        variant="whatsapp"
        size="lg"
        target="_blank"
        rel="noopener noreferrer"
        className="self-start"
      >
        <WhatsAppIcon className="size-5" />
        {t("vencidaCta")}
      </ButtonLink>
    </div>
  );
}
