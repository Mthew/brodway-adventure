import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ButtonLink } from "@/components/ui/button";
import { DestinationCard } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { WhatsAppIcon } from "@/components/layout/whatsapp-floating";
import { FiltroCategoria } from "@/components/ui/filtro-categoria";
import { buildWhatsAppUrl } from "@/lib/config";
import { getDestinationFromPrice, listDestinations } from "@/lib/destinations";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "destinos" });

  return { title: t("tituloListado"), description: t("introListado") };
}

export default async function DestinosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("destinos");
  const tc = await getTranslations("cta");
  const tf = await getTranslations("filtros");

  const destinos = await listDestinations();

  /**
   * Las tarjetas se renderizan en el servidor (necesitan traducciones y formato de
   * moneda) y se le pasan ya listas al filtro, que sólo decide cuáles se ven. Así
   * el filtro es cliente pero el contenido no viaja como datos crudos.
   */
  const items = await Promise.all(
    destinos.map(async (destino) => {
      const precio = await getDestinationFromPrice(destino.slug);
      return {
        id: destino.slug,
        categoria: destino.tipo,
        card: (
          <DestinationCard
            destino={destino}
            precioDesde={precio?.precioDesde}
            moneda={precio?.moneda}
          />
        ),
      };
    }),
  );

  return (
    <>
      <Section spacing="compact">
        <div className="flex max-w-[55ch] flex-col gap-4">
          <h1 className="text-h1 text-brand-navy">{t("tituloListado")}</h1>
          <p className="text-body-lg text-neutral-700">{t("introListado")}</p>
        </div>
      </Section>

      <Section spacing="compact">
        <FiltroCategoria
          items={items}
          etiquetaGrupo={tf("etiqueta")}
          textoVacio={t("sinResultados")}
          etiquetas={{
            todos: tf("todos"),
            nacional: tf("nacional"),
            internacional: tf("internacional"),
            "pueblos-de-antioquia": tf("pueblos-de-antioquia"),
          }}
        />
      </Section>

      <Section background="navy">
        <div className="flex flex-col items-start gap-5">
          <h2 className="text-h2 max-w-[20ch]">{t("ctaTitulo")}</h2>
          <ButtonLink
            href={buildWhatsAppUrl({ message: t("introListado") })}
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
