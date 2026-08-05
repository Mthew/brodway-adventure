import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CalendarBlank, Compass } from "@phosphor-icons/react/dist/ssr";

import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { PackageCard } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { WhatsAppIcon } from "@/components/layout/whatsapp-floating";
import { buildWhatsAppUrl, SITE_URL } from "@/lib/config";
import { Link } from "@/lib/i18n/navigation";
import {
  getDestination,
  listDestinationSlugs,
  listOffersForDestination,
} from "@/lib/destinations";
import type { Destination } from "@/lib/types/destination";

/**
 * Página de destino.
 *
 * Está optimizada para búsquedas de alta intención ("viaje a Eje Cafetero 4 días"),
 * así que el contenido editorial pesa tanto como las tarjetas: una página con sólo
 * cards no posiciona y no cumple su función (brief-v0.md §8).
 */

export async function generateStaticParams() {
  const slugs = await listDestinationSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destino = await getDestination(slug);

  if (!destino) return {};

  return { title: destino.nombre, description: destino.resumen };
}

export default async function DestinoPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const destino = await getDestination(slug);
  if (!destino) notFound();

  const t = await getTranslations("destinos");
  const tc = await getTranslations("cta");

  const offers = await listOffersForDestination(destino.slug);

  const whatsappHref = buildWhatsAppUrl({
    message: t("mensajeWhatsapp", { destino: destino.nombre }),
  });

  return (
    <>
      <JsonLd destino={destino} locale={locale} />

      {/* Cabecera a sangre: imagen del destino con el nombre encima. */}
      <section className="relative isolate">
        <Image
          src={destino.imagenHero}
          alt={destino.nombre}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        {/* navy/70: medido contra el peor caso, una foto blanca debajo. */}
        <div className="bg-brand-navy/70 absolute inset-0 -z-10" />

        <div className="mx-auto w-full max-w-6xl px-6 py-20 md:px-8 md:py-28">
          {/* `text-white` y no `white/80`: sobre una foto clara con overlay al 70%,
              el 80% de opacidad deja el texto pequeño por debajo de 4.5:1.
              `min-h-11` porque el mínimo táctil vale también para las migas. */}
          <nav aria-label="Ruta de navegación" className="text-body-sm mb-4">
            <ol className="flex flex-wrap items-center gap-2 text-white">
              <li>
                <Link
                  href="/"
                  className="inline-flex min-h-11 items-center hover:underline"
                >
                  {t("migaInicio")}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/destinos"
                  className="inline-flex min-h-11 items-center hover:underline"
                >
                  {t("migaDestinos")}
                </Link>
              </li>
            </ol>
          </nav>

          <div className="flex max-w-2xl flex-col gap-4">
            {/* `destinoOscuro`, no `destino`: sobre el navy del hero la variante
                clara rinde 1.82:1. Ver components/ui/badge.tsx. */}
            <Badge variant="destinoOscuro" className="self-start">
              {t(destino.tipo)}
            </Badge>
            <h1 className="text-display text-white">{destino.nombre}</h1>
            <p className="text-body-lg text-white">{destino.resumen}</p>
          </div>
        </div>
      </section>

      {/* Introducción editorial: columna estrecha, ritmo de lectura largo. */}
      <Section>
        <div className="flex max-w-[65ch] flex-col gap-5">
          {destino.introduccion.map((parrafo) => (
            <p key={parrafo.slice(0, 40)} className="text-body-lg text-neutral-700">
              {parrafo}
            </p>
          ))}
        </div>
      </Section>

      {/* Bloque informativo, no comercial: cuándo conviene ir y por qué. */}
      <Section background="alt" spacing="compact">
        <div className="flex max-w-[70ch] flex-col gap-4">
          <div className="flex items-center gap-3">
            <CalendarBlank
              weight="regular"
              className="text-brand-turquoise size-6 shrink-0"
              aria-hidden="true"
            />
            <h2 className="text-h2 text-brand-navy">{t("mejorEpoca")}</h2>
          </div>
          <p className="text-body text-neutral-700">{destino.mejorEpoca}</p>
        </div>
      </Section>

      {/* Qué hacer: lista de dos columnas con separadores verticales, no tarjetas. */}
      <Section>
        <h2 className="text-h2 text-brand-navy mb-8">{t("queHacer")}</h2>
        <ul className="grid gap-x-12 gap-y-8 md:grid-cols-2">
          {destino.queHacer.map((experiencia) => (
            <li
              key={experiencia.titulo}
              className="border-brand-turquoise/40 flex flex-col gap-2 border-l-2 pl-5"
            >
              <h3 className="text-h3 text-brand-navy">{experiencia.titulo}</h3>
              <p className="text-body text-neutral-700">
                {experiencia.descripcion}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section background="alt">
        <h2 className="text-h2 text-brand-navy mb-8">
          {t("planes", { destino: destino.nombre })}
        </h2>

        {offers.length === 0 ? (
          <div className="flex flex-col items-start gap-5">
            {/* Estado vacío honesto: no hay plan, y aun así hay camino. */}
            <p className="text-body-lg max-w-[55ch] text-neutral-600">
              {t("sinPlanes")}
            </p>
            <ButtonLink
              href={whatsappHref}
              variant="whatsapp"
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="size-5" />
              {tc("planeemosViaje")}
            </ButtonLink>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => (
              <PackageCard key={offer.slug} offer={offer} />
            ))}
          </div>
        )}
      </Section>

      {destino.faq.length > 0 ? (
        <Section>
          <h2 className="text-h2 text-brand-navy mb-8">{t("faq")}</h2>
          <Accordion className="max-w-3xl">
            {destino.faq.map((item, indice) => (
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

      <Section background="navy">
        <div className="flex flex-col items-start gap-5">
          <Compass
            weight="regular"
            className="text-brand-turquoise size-8"
            aria-hidden="true"
          />
          <h2 className="text-h2 max-w-[20ch]">{t("ctaTitulo")}</h2>
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
        </div>
      </Section>
    </>
  );
}

async function JsonLd({
  destino,
  locale,
}: {
  destino: Destination;
  locale: string;
}) {
  const base = locale === "es" ? SITE_URL : `${SITE_URL}/${locale}`;

  const datos: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "TouristDestination",
      name: destino.nombre,
      description: destino.resumen,
      url: `${base}/destinos/${destino.slug}`,
      includesAttraction: destino.queHacer.map((experiencia) => ({
        "@type": "TouristAttraction",
        name: experiencia.titulo,
        description: experiencia.descripcion,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: base },
        {
          "@type": "ListItem",
          position: 2,
          name: "Destinos",
          item: `${base}/destinos`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: destino.nombre,
          item: `${base}/destinos/${destino.slug}`,
        },
      ],
    },
  ];

  if (destino.faq.length > 0) {
    datos.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: destino.faq.map((item) => ({
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
