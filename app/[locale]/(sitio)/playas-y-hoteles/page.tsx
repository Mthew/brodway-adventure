import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { WhatsAppIcon } from "@/components/layout/whatsapp-floating";
import { ButtonLink } from "@/components/ui/button";
import { HotelCard } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { buildWhatsAppUrl } from "@/lib/config";
import { listOffersByCollection } from "@/lib/offers";

/**
 * Mejores Playas y Hoteles (`estructura-funcional-cliente.md` §8).
 *
 * Dirigida a un visitante distinto al de `/ofertas`: busca mejor experiencia y el
 * precio más bajo **no** es su criterio principal (§7). Por eso usa `HotelCard`, que
 * pone la fotografía y el hotel por delante del precio, y no la tarjeta de oferta.
 *
 * Es una selección CURADA a mano por la agencia. §7 es explícito en que no hace falta
 * un sistema de puntuación: la agencia marca la bandera y ya. No hay ranking, ni
 * estrellas, ni orden calculado — sólo el `orden` que ella decide.
 *
 * Sin pestañas de categoría, a diferencia de `/ofertas`: §8 no las pide, y son de
 * cuatro a seis opciones. Filtrar seis tarjetas es dar trabajo sin resolver nada.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "playasYHoteles" });

  return { title: t("titulo"), description: t("intro") };
}

export default async function PlayasYHotelesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("playasYHoteles");
  const tc = await getTranslations("cta");

  const offers = await listOffersByCollection("playas-y-hoteles");

  return (
    <>
      <Section spacing="compact">
        <div className="flex max-w-[55ch] flex-col gap-4">
          <h1 className="text-h1 text-brand-navy">{t("titulo")}</h1>
          <p className="text-body-lg text-neutral-700">{t("intro")}</p>
        </div>
      </Section>

      <Section spacing="compact">
        {offers.length === 0 ? (
          <p className="text-body-lg max-w-[55ch] text-neutral-600">{t("vacio")}</p>
        ) : (
          /* Tres columnas y no dos: la tarjeta es vertical (3:4), así que a dos
             columnas quedaría desproporcionadamente alta en escritorio. */
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => (
              <li key={offer.slug}>
                <HotelCard offer={offer} />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section background="navy">
        <div className="flex flex-col items-start gap-5">
          <h2 className="text-h2 max-w-[20ch]">{t("ctaTitulo")}</h2>
          <ButtonLink
            href={buildWhatsAppUrl({ message: t("intro") })}
            variant="whatsapp"
            size="lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon className="size-5" />
            {tc("hablaConAsesor")}
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
