import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Check, X } from "@phosphor-icons/react/dist/ssr";

import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { PackageCard } from "@/components/ui/card";
import { PriceDisclosure } from "@/components/ui/price-disclosure";
import { Section } from "@/components/ui/section";
import { LeadForm } from "@/components/forms/lead-form";
import { WhatsAppIcon } from "@/components/layout/whatsapp-floating";
import { Galeria } from "@/components/oferta/galeria";
import { StickyCta } from "@/components/oferta/sticky-cta";
import { TarifaVencida } from "@/components/oferta/tarifa-vencida";
import { buildWhatsAppUrl, RNT_NUMBER, SITE_URL } from "@/lib/config";
import { Link } from "@/lib/i18n/navigation";
import { getOffer, listActiveOffers, listOfferSlugs } from "@/lib/offers";
import type { Offer } from "@/lib/types/offer";

/**
 * Ficha de oferta: la página de mayor impacto en conversión del sitio.
 *
 * ALCANCE DE FASE 1 (plan-fase-1.md §3.1): el itinerario va RESUMIDO y las fechas
 * de salida con cupos NO se renderizan. `fases-entrega.md` las coloca en Fase 2 y
 * gana sobre `brief-v0.md` en materia de qué y cuándo, por la regla de precedencia
 * de docs/README.md. El dato ya está modelado entero, así que ampliarlo es añadir
 * una sección, no migrar nada.
 */

export async function generateStaticParams() {
  const slugs = await listOfferSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lookup = await getOffer(slug);

  if (lookup.status === "not-found") return {};

  return {
    title: lookup.offer.titulo,
    description: lookup.offer.beneficioCorto,
  };
}

export default async function OfertaPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const lookup = await getOffer(slug);

  // Un borrador nunca es visible: es una tarifa extraída pero sin validar por una
  // persona, y publicarla es el riesgo "agente que inventa tarifas" del roadmap.
  if (lookup.status === "not-found") notFound();

  const { offer } = lookup;
  const vencida = lookup.status === "expired";

  const t = await getTranslations("ofertas");
  const tc = await getTranslations("cta");
  const tm = await getTranslations("microcopy");
  const format = await getFormatter();

  const relacionados = (await listActiveOffers())
    .filter((otra) => otra.slug !== offer.slug)
    .slice(0, 2);

  const whatsappHref = buildWhatsAppUrl({
    message: t("mensajeWhatsapp", { titulo: offer.titulo }),
    offerId: offer.offerId,
  });

  return (
    <>
      <JsonLd offer={offer} vencida={vencida} locale={locale} />

      <Section spacing="compact">
        {/* `min-h-11` en las migas: el mínimo táctil aplica también aquí, y
            medían 18px. Es el mismo arreglo que ya llevaba la página de destino. */}
        <nav aria-label="Ruta de navegación" className="text-body-sm mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-neutral-600">
            <li>
              <Link href="/" className="inline-flex min-h-11 items-center hover:underline">
                {t("migaInicio")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/ofertas" className="inline-flex min-h-11 items-center hover:underline">
                {t("migaOfertas")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-brand-navy font-medium">{offer.destino}</li>
          </ol>
        </nav>

        {/*
          EN MÓVIL EL BLOQUE DE CONVERSIÓN VA ANTES QUE LA GALERÍA.

          Con la galería primero, este bloque medía 1179px sobre un viewport de
          812: el precio y el CTA quedaban bajo el pliegue en la página que más
          convierte. Y no cabía de ninguna forma — migas, titular, galería,
          precio y dos CTA son más de lo que entra en una pantalla de teléfono,
          por mucho que se recorte cada pieza.

          Así que cede el ORDEN, no el contenido: primero titular, precio y CTA,
          y la galería justo debajo. En escritorio, donde sí caben las dos
          columnas, se recupera la disposición original.
        */}
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-12">
          <div className="order-2 lg:order-1">
            <Galeria imagenes={offer.imagenes} titulo={offer.titulo} />
          </div>

          <div className="order-1 flex flex-col gap-5 lg:order-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="destino">{offer.destino}</Badge>
              <Badge variant="neutral">
                {t("duracion", { noches: offer.noches })}
              </Badge>
            </div>

            <h1 className="text-h1 text-brand-navy">{offer.titulo}</h1>

            <p className="text-body-lg text-neutral-700">
              {offer.beneficioCorto}
            </p>

            {vencida ? (
              <TarifaVencida offer={offer} />
            ) : (
              <>
                <PriceDisclosure offer={offer} />

                {/*
                  Apilados SIEMPRE, sin punto de ruptura a fila.

                  Esta columna ocupa ~490px en escritorio, y "Ver itinerario día
                  a día" junto a "Cotiza por WhatsApp" no cabe: el texto se parte
                  en dos líneas, que el Pre-Flight §11.B prohíbe. Se probó con
                  `sm:` y con `xl:` y falla en ambos, porque el ancho disponible
                  no depende del viewport sino de la rejilla de dos columnas.
                */}
                <div className="flex flex-col gap-3">
                  <ButtonLink
                    href={whatsappHref}
                    variant="whatsapp"
                    size="lg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon className="size-5" />
                    {tc("cotizaWhatsapp")}
                  </ButtonLink>

                  <ButtonLink href="#itinerario" variant="outline" size="lg">
                    {tc("verItinerario")}
                  </ButtonLink>
                </div>

                <p className="text-body-sm text-neutral-600">
                  {tm("respuestaEnMinutos")}
                </p>
              </>
            )}
          </div>
        </div>
      </Section>

      {/* La barra fija sólo tiene sentido si hay algo que cotizar. */}
      {vencida ? null : <StickyCta offer={offer} />}

      {offer.highlights.length > 0 ? (
        <Section background="alt">
          <h2 className="text-h2 text-brand-navy mb-8">{t("loMejor")}</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {offer.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-3">
                <Check
                  weight="regular"
                  className="text-brand-turquoise mt-1 size-5 shrink-0"
                  aria-hidden="true"
                />
                <span className="text-body text-neutral-800">{highlight}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {offer.itinerario.length > 0 ? (
        <Section id="itinerario" className="scroll-mt-24">
          <h2 className="text-h2 text-brand-navy mb-3">{t("itinerario")}</h2>
          <p className="text-body text-neutral-600 mb-8 max-w-[65ch]">
            {t("itinerarioNota")}
          </p>

          <ol className="flex flex-col gap-6 border-l-2 border-neutral-200 pl-6">
            {offer.itinerario.map((dia) => (
              <li key={dia.dia} className="flex flex-col gap-1">
                <span className="text-caption text-brand-turquoise-text font-semibold">
                  {t("dia", { dia: dia.dia })}
                </span>
                <h3 className="text-h3 text-brand-navy">{dia.titulo}</h3>
                <p className="text-body max-w-[65ch] text-neutral-700">
                  {dia.descripcion}
                </p>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      <Section background="alt">
        {/*
          Dos columnas, y la de "no incluye" va en GRIS, nunca en rojo: lo que no
          está incluido no es un error, es información. Esta sección es gestión de
          expectativas y se redacta con honestidad, que es un valor de marca.
        */}
        <div className="grid gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h2 className="text-h3 text-brand-navy">{t("incluye")}</h2>
            <ul className="flex flex-col gap-3">
              {offer.incluye.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check
                    weight="regular"
                    className="text-brand-turquoise mt-0.5 size-5 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-body text-neutral-800">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-h3 text-brand-navy">{t("noIncluye")}</h2>
            <ul className="flex flex-col gap-3">
              {offer.noIncluye.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <X
                    weight="regular"
                    className="mt-0.5 size-5 shrink-0 text-neutral-400"
                    aria-hidden="true"
                  />
                  <span className="text-body text-neutral-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h2 className="text-h3 text-brand-navy">{t("formasPago")}</h2>
            {/* Nunca "financiamos" ni "crédito": la agencia no otorga crédito. */}
            <p className="text-body max-w-[65ch] text-neutral-700">
              {t("formasPagoTexto")}
            </p>
          </div>

          {offer.politicaCancelacion ? (
            <div className="flex flex-col gap-4">
              <h2 className="text-h3 text-brand-navy">{t("cancelacion")}</h2>
              <p className="text-body max-w-[65ch] text-neutral-700">
                {offer.politicaCancelacion}
              </p>
            </div>
          ) : null}
        </div>
      </Section>

      {offer.faq.length > 0 ? (
        <Section background="alt">
          <h2 className="text-h2 text-brand-navy mb-8">{t("faq")}</h2>
          <Accordion className="max-w-3xl">
            {offer.faq.map((item, indice) => (
              <AccordionItem
                key={item.pregunta}
                title={item.pregunta}
                open={indice === 0}
              >
                {item.respuesta}
              </AccordionItem>
            ))}
          </Accordion>
        </Section>
      ) : null}

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="flex flex-col gap-3">
            <h2 className="text-h2 text-brand-navy">{t("formulario")}</h2>
            <p className="text-body max-w-[55ch] text-neutral-700">
              {t("formularioTexto")}
            </p>
            <Badge variant="trust" className="mt-4 self-start">
              RNT {RNT_NUMBER}
            </Badge>
          </div>

          {/*
            `offerId` y `destino` van desde el contexto de la página: el asesor no
            debe volver a preguntar qué oferta vio la persona.
          */}
          <LeadForm
            offerId={offer.offerId}
            destino={offer.destino}
            paginaOrigen={`/ofertas/${offer.slug}`}
          />
        </div>
      </Section>

      {relacionados.length > 0 ? (
        <Section background="alt">
          <h2 className="text-h2 text-brand-navy mb-8">{t("relacionados")}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {relacionados.map((otra) => (
              <PackageCard key={otra.slug} offer={otra} />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}

/**
 * Datos estructurados.
 *
 * Una tarifa vencida NO publica `Offer` con precio: declararla comprable en el
 * marcado cuando la página dice que venció es contradecirse ante el buscador.
 */
async function JsonLd({
  offer,
  vencida,
  locale,
}: {
  offer: Offer;
  vencida: boolean;
  locale: string;
}) {
  const base = locale === "es" ? SITE_URL : `${SITE_URL}/${locale}`;

  const datos: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      name: offer.titulo,
      description: offer.beneficioCorto,
      touristType: "Leisure",
      itinerary: offer.itinerario.map((dia) => ({
        "@type": "ListItem",
        position: dia.dia,
        name: dia.titulo,
        description: dia.descripcion,
      })),
      ...(vencida
        ? {}
        : {
            offers: {
              "@type": "Offer",
              price: offer.precioDesde,
              priceCurrency: offer.moneda,
              availability: "https://schema.org/InStock",
              priceValidUntil: offer.vigenciaHasta,
              url: `${base}/ofertas/${offer.slug}`,
            },
          }),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: base },
        {
          "@type": "ListItem",
          position: 2,
          name: "Ofertas",
          item: `${base}/ofertas`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: offer.destino,
          item: `${base}/ofertas/${offer.slug}`,
        },
      ],
    },
  ];

  if (offer.faq.length > 0) {
    datos.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: offer.faq.map((item) => ({
        "@type": "Question",
        name: item.pregunta,
        acceptedAnswer: { "@type": "Answer", text: item.respuesta },
      })),
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(datos) }}
    />
  );
}
