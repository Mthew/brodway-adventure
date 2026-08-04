import { getFormatter, getTranslations } from "next-intl/server";

import { RNT_NUMBER } from "@/lib/config";
import { cn } from "@/lib/utils";
import type { Offer } from "@/lib/types/offer";

/**
 * El bloque que acompaña a TODO precio "desde" (spec-tecnica.md §8.4).
 *
 * No es letra chica: va con peso tipográfico legible, pegado al precio. Sin ciudad
 * de salida y ocupación el precio no significa nada, y ocultarlo es justo lo que
 * hacen las agencias en las que la gente no confía. El RNT es obligatorio en la
 * publicidad de un prestador turístico, por eso va aquí y no sólo en el pie.
 */
export async function PriceDisclosure({
  offer,
  className,
}: {
  offer: Offer;
  className?: string;
}) {
  const t = await getTranslations("precio");
  const format = await getFormatter();

  const precio = format.number(offer.precioDesde, {
    style: "currency",
    currency: offer.moneda,
    maximumFractionDigits: 0,
  });

  const validadaEl = format.dateTime(new Date(offer.validadaEl), {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className="flex flex-wrap items-baseline gap-x-2">
        <span className="text-body-sm text-neutral-600">{t("desde")}</span>
        <span className="text-h2 text-brand-navy font-bold">{precio}</span>
        <span className="text-body-sm font-medium text-neutral-700">
          {t("porPersona")}
        </span>
      </p>

      <p className="text-body-sm text-neutral-700">
        {[
          t("saliendoDesde", { ciudad: offer.ciudadOrigen }),
          t("noches", { noches: offer.noches }),
          t("ocupacion", { ocupacion: offer.ocupacionBase }),
        ].join(" · ")}
      </p>

      <p className="text-caption text-neutral-600">
        {t("verificadaEl", { fecha: validadaEl })} {t("consultaCondiciones")}{" "}
        {/* TODO: VERIFICAR dato legal real antes de publicar */}
        RNT {RNT_NUMBER}
      </p>
    </div>
  );
}
