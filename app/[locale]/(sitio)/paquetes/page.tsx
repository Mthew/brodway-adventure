import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ButtonLink } from "@/components/ui/button";
import { PackageCard } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { WhatsAppIcon } from "@/components/layout/whatsapp-floating";
import { buildWhatsAppUrl } from "@/lib/config";
import { listActiveOffers } from "@/lib/offers";

/**
 * Listado de paquetes.
 *
 * No lo especifica ningún brief —es un hueco de `brief-v0.md`, no del código—,
 * pero el navbar ya enlaza "Paquetes" y `PackageCard` ya apunta a
 * `/paquetes/[slug]`. Sin esta página, ese enlace es un 404.
 *
 * Sólo lista ofertas PUBLICABLES: las vencidas conservan su ficha para no perder
 * al que llega por un enlace guardado, pero no se ofrecen como catálogo.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "paquetes" });

  return {
    title: t("tituloListado"),
    description: t("introListado"),
  };
}

export default async function PaquetesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("paquetes");
  const tc = await getTranslations("cta");

  const offers = await listActiveOffers();

  return (
    <>
      <Section spacing="compact">
        <div className="flex max-w-[55ch] flex-col gap-4">
          <h1 className="text-h1 text-brand-navy">{t("tituloListado")}</h1>
          <p className="text-body-lg text-neutral-700">{t("introListado")}</p>
        </div>
      </Section>

      <Section spacing="compact">
        {offers.length === 0 ? (
          /* Estado vacío real, no una cuadrícula en blanco. */
          <p className="text-body-lg max-w-[55ch] text-neutral-600">
            {t("vacio")}
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => (
              <PackageCard key={offer.slug} offer={offer} />
            ))}
          </div>
        )}
      </Section>

      <Section background="navy">
        <div className="flex flex-col items-start gap-5">
          <h2 className="text-h2 max-w-[20ch]">{t("formulario")}</h2>
          <ButtonLink
            href={buildWhatsAppUrl({
              message: t("introListado"),
            })}
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
