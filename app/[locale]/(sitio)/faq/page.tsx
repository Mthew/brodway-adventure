import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { WhatsAppIcon } from "@/components/layout/whatsapp-floating";
import { buildWhatsAppUrl } from "@/lib/config";

/**
 * Preguntas frecuentes globales.
 *
 * Resuelve las objeciones TRANSVERSALES. Las de un viaje concreto viven en su
 * ficha, y duplicarlas aquí las desincroniza en cuanto cambie una política.
 */

const PREGUNTAS = [
  ["p1", "r1"],
  ["p2", "r2"],
  ["p3", "r3"],
  ["p4", "r4"],
  ["p5", "r5"],
  ["p6", "r6"],
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });

  return { title: t("titulo"), description: t("entradilla") };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("faq");
  const tc = await getTranslations("cta");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PREGUNTAS.map(([pregunta, respuesta]) => ({
      "@type": "Question",
      name: t(pregunta),
      acceptedAnswer: { "@type": "Answer", text: t(respuesta) },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section spacing="compact">
        <div className="flex max-w-[55ch] flex-col gap-4">
          <h1 className="text-h1 text-brand-navy">{t("titulo")}</h1>
          <p className="text-body-lg text-neutral-700">{t("entradilla")}</p>
        </div>
      </Section>

      <Section spacing="compact">
        <Accordion className="max-w-3xl">
          {PREGUNTAS.map(([pregunta, respuesta], indice) => (
            <AccordionItem
              key={pregunta}
              title={t(pregunta)}
              open={indice === 0}
            >
              {t(respuesta)}
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      <Section background="navy">
        <div className="flex flex-col items-start gap-5">
          <h2 className="text-h2 max-w-[20ch]">{t("ctaTitulo")}</h2>
          <ButtonLink
            href={buildWhatsAppUrl({ message: t("entradilla") })}
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
