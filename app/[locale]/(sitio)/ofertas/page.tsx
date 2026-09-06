import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { WhatsAppIcon } from "@/components/layout/whatsapp-floating";
import { ButtonLink } from "@/components/ui/button";
import { PackageCard } from "@/components/ui/card";
import { FiltroCategoria } from "@/components/ui/filtro-categoria";
import { Section } from "@/components/ui/section";
import { buildWhatsAppUrl } from "@/lib/config";
import { getCategoriasPorSlug } from "@/lib/destinations";
import { listOffersByCollection } from "@/lib/offers";

/**
 * Mejores Ofertas (`estructura-funcional-cliente.md` §6).
 *
 * NO es "todas las ofertas vigentes": son las que la agencia marcó para esta sección.
 * La diferencia es el punto de §6 — la sección existe para el visitante cuya
 * motivación principal es encontrar la tarifa más baja, y meter ahí el catálogo
 * entero la vacía de sentido.
 *
 * Las vencidas conservan su ficha para no perder a quien llega por un enlace
 * guardado, pero no se ofrecen como catálogo: eso lo garantiza `listActiveOffers`
 * por debajo.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ofertas" });

  return { title: t("tituloListado"), description: t("introListado") };
}

export default async function OfertasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("ofertas");
  const tc = await getTranslations("cta");
  const tf = await getTranslations("filtros");

  const [offers, categorias] = await Promise.all([
    listOffersByCollection("mejores-ofertas"),
    getCategoriasPorSlug(),
  ]);

  /*
   * La categoría de una oferta es la de su destino: `Offer` no la lleva encima, y
   * duplicarla ahí la dejaría desincronizada en cuanto un destino cambiara de
   * categoría. Se resuelve con un mapa y una sola consulta.
   *
   * Las tarjetas se renderizan aquí, en el servidor (necesitan traducciones y formato
   * de moneda) y llegan al filtro ya construidas: filtrar en cliente no obliga a que
   * los datos crudos viajen al navegador.
   */
  const items = offers.map((offer) => ({
    id: offer.slug,
    categoria: categorias.get(offer.destinoSlug) ?? "nacional",
    card: <PackageCard offer={offer} />,
  }));

  return (
    <>
      <Section spacing="compact">
        <div className="flex max-w-[55ch] flex-col gap-4">
          <h1 className="text-h1 text-brand-navy">{t("tituloListado")}</h1>
          <p className="text-body-lg text-neutral-700">{t("introListado")}</p>
        </div>
      </Section>

      <Section spacing="compact">
        {items.length === 0 ? (
          /* Estado vacío real, no una rejilla en blanco. */
          <p className="text-body-lg max-w-[55ch] text-neutral-600">{t("vacio")}</p>
        ) : (
          <FiltroCategoria
            items={items}
            columnas="dos"
            etiquetaGrupo={tf("etiqueta")}
            textoVacio={t("vacio")}
            etiquetas={{
              todos: tf("todos"),
              internacional: tf("internacional"),
              nacional: tf("nacional"),
              "pueblos-de-antioquia": tf("pueblos-de-antioquia"),
            }}
          />
        )}
      </Section>

      <Section background="navy">
        <div className="flex flex-col items-start gap-5">
          <h2 className="text-h2 max-w-[20ch]">{t("formulario")}</h2>
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
