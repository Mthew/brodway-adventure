import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Check } from "@phosphor-icons/react/dist/ssr";

import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { LeadForm } from "@/components/forms/lead-form";
import { WhatsAppIcon } from "@/components/layout/whatsapp-floating";
import { CapturaUtm } from "@/components/campana/captura-utm";
import { buildWhatsAppUrl } from "@/lib/config";
import { getCampaign, listCampaignSlugs } from "@/lib/campaigns";

/**
 * Landing de campaña.
 *
 * MESSAGE MATCH: tiene que leerse como la continuación exacta del anuncio. Por eso
 * todo el contenido viene de `lib/campaigns` y esta página no tiene ni un texto
 * propio de campaña: lanzar una nueva es añadir un registro, no tocar código.
 *
 * UNA sola idea y UN solo CTA, repetido 3 veces a lo largo del scroll. No hay un
 * segundo CTA compitiendo ni enlaces de salida: el cromo mínimo está en
 * `layout.tsx` de esta misma carpeta.
 */

export async function generateStaticParams() {
  const slugs = await listCampaignSlugs();
  return slugs.map((campana) => ({ campana }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ campana: string }>;
}): Promise<Metadata> {
  const { campana } = await params;
  const lookup = await getCampaign(campana);

  if (lookup.status === "not-found") return {};

  return {
    title: lookup.campaign.titular,
    description: lookup.campaign.subtitular,
    /**
     * Las landings de pauta NO se indexan: competirían con las páginas de destino
     * y de oferta por las mismas búsquedas, y esas sí están hechas para
     * posicionar.
     */
    robots: { index: false, follow: false },
  };
}

export default async function LandingCampanaPage({
  params,
}: {
  params: Promise<{ locale: string; campana: string }>;
}) {
  const { locale, campana } = await params;
  setRequestLocale(locale);

  const lookup = await getCampaign(campana);
  if (lookup.status === "not-found") notFound();

  const { campaign, tarifaVencida } = lookup;

  const t = await getTranslations("campana");

  /**
   * El mensaje lleva el código de campaña.
   *
   * Los UTMs no sobreviven el salto a WhatsApp, así que sin este código el asesor
   * recibe una conversación sin saber de qué anuncio salió.
   */
  const whatsappHref = buildWhatsAppUrl({
    message: t("mensajeWhatsapp", { titular: campaign.titular }),
    offerId: campaign.offerId,
    campaign: campaign.codigo,
  });

  const Cta = ({ className }: { className?: string }) => (
    <ButtonLink
      href={whatsappHref}
      variant="whatsapp"
      size="lg"
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <WhatsAppIcon className="size-5" />
      {campaign.cta}
    </ButtonLink>
  );

  return (
    <>
      <CapturaUtm />

      {/* 1. HERO con el mismo titular, oferta e imagen del anuncio. */}
      <section className="relative isolate">
        {campaign.video ? (
          /* Nativo y sin librería: sin autoplay con sonido, con poster para que
             el primer frame no dependa de la descarga del vídeo. */
          <video
            className="absolute inset-0 -z-10 size-full object-cover"
            poster={campaign.video.poster}
            playsInline
            muted
            loop
            preload="none"
          >
            <source src={campaign.video.src} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={campaign.imagen}
            alt={campaign.imagenAlt}
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover"
          />
        )}
        {/* navy/70: medido contra el peor caso, una foto blanca debajo. */}
        <div className="bg-brand-navy/70 absolute inset-0 -z-10" />

        <div className="mx-auto w-full max-w-6xl px-6 py-20 md:px-8 md:py-28">
          <div className="flex max-w-2xl flex-col gap-5">
            {/*
              `text-h1` y no `text-display`, que es lo que usa el hero de la home.

              El titular de una campaña NO se puede acortar para que quepa: tiene
              que coincidir con el del anuncio o se rompe el message match, que es
              lo único que sostiene esta página. Con `text-display` este titular
              ocupaba 3 líneas a 375px contra el máximo de 2 del Pre-Flight §11.B;
              con `text-h1` entra en 2. Lo que cede es el tamaño, no el copy.
            */}
            <h1 className="text-h1 text-white">{campaign.titular}</h1>
            <p className="text-body-lg text-white">{campaign.subtitular}</p>
            <Cta className="self-start" />
          </div>
        </div>
      </section>

      {/* 2. PRUEBA SOCIAL inmediata, debajo del hero y no dentro. */}
      <Section background="alt" spacing="compact">
        <p className="text-body-sm text-neutral-700">{campaign.pruebaSocial}</p>
      </Section>

      {/*
        Estado de tarifa vencida.

        Una landing es la página a la que apunta dinero en pauta: si la tarifa
        caducó y la página sigue sosteniendo el precio del anuncio, se paga por
        llevar gente a una promesa incumplible. La landing sigue captando, pero
        deja de afirmar el precio.
      */}
      {tarifaVencida ? (
        <Section spacing="compact">
          <p className="border-warning/30 bg-warning/5 text-body max-w-[65ch] rounded-lg border p-5 text-neutral-800">
            {t("tarifaVencida")}
          </p>
        </Section>
      ) : null}

      {/* 3. QUÉ INCLUYE. */}
      <Section>
        <h2 className="text-h2 text-brand-navy mb-8 max-w-[18ch]">
          {t("incluye")}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {campaign.incluye.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <Check
                weight="regular"
                className="text-brand-turquoise mt-1 size-5 shrink-0"
                aria-hidden="true"
              />
              <span className="text-body text-neutral-800">{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* 4. CTA INTERMEDIO. */}
      <Section background="navy" spacing="compact">
        <div className="flex flex-col items-start gap-5 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-h2 max-w-[22ch]">{t("ctaIntermedio")}</h2>
          <Cta className="shrink-0" />
        </div>
      </Section>

      {/* 5. ITINERARIO RESUMIDO. No el día a día: esto es una landing. */}
      <Section>
        <h2 className="text-h2 text-brand-navy mb-8 max-w-[18ch]">
          {t("itinerario")}
        </h2>
        <ol className="flex flex-col gap-6 border-l-2 border-neutral-200 pl-6">
          {campaign.itinerarioResumen.map((dia) => (
            <li key={dia.titulo} className="flex flex-col gap-1">
              <h3 className="text-h3 text-brand-navy">{dia.titulo}</h3>
              <p className="text-body max-w-[60ch] text-neutral-700">
                {dia.texto}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* 6. FORMULARIO. */}
      <Section background="alt">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="flex flex-col gap-3">
            <h2 className="text-h2 text-brand-navy max-w-[18ch]">
              {t("formulario")}
            </h2>
            <p className="text-body max-w-[45ch] text-neutral-700">
              {t("formularioTexto")}
            </p>
          </div>
          <LeadForm
            offerId={campaign.offerId}
            destino={campaign.destino}
            paginaOrigen={`/lp/${campaign.slug}`}
          />
        </div>
      </Section>

      {/* 7. FAQ BREVE. */}
      <Section>
        <h2 className="text-h2 text-brand-navy mb-8">{t("faq")}</h2>
        <Accordion className="max-w-3xl">
          {campaign.faq.map((item, indice) => (
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

      {/* 8. CTA FINAL. */}
      <Section background="turquoise" spacing="compact">
        <div className="flex flex-col items-start gap-5">
          <h2 className="text-h2 max-w-[22ch]">{t("ctaFinal")}</h2>
          <Cta />
        </div>
      </Section>
    </>
  );
}
