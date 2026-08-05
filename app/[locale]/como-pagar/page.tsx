import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr";

import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { WhatsAppIcon } from "@/components/layout/whatsapp-floating";
import { Link } from "@/lib/i18n/navigation";
import { buildWhatsAppUrl } from "@/lib/config";

/**
 * Cómo pagar.
 *
 * DOS PALABRAS PROHIBIDAS EN ESTA PÁGINA, y no por estilo: "financiamos" y
 * "crédito". La agencia no otorga crédito, y decirlo la pondría a hacer una
 * afirmación regulada que no puede sostener. Lo que hay es un calendario de pagos
 * acordado, y la página lo dice con esas palabras.
 *
 * Tampoco se escribe "sin intereses garantizados" ni ninguna condición comercial
 * que no esté confirmada.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "comoPagar" });

  return { title: t("titulo"), description: t("entradilla") };
}

export default async function ComoPagarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("comoPagar");
  const tc = await getTranslations("cta");

  const whatsappHref = buildWhatsAppUrl({ message: t("entradilla") });

  return (
    <>
      <Section spacing="compact">
        <div className="flex max-w-[55ch] flex-col gap-4">
          <h1 className="text-h1 text-brand-navy">{t("titulo")}</h1>
          <p className="text-body-lg text-neutral-700">{t("entradilla")}</p>
        </div>
      </Section>

      {/* Los dos momentos del pago, en columnas de peso desigual. */}
      <Section background="alt" spacing="compact">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col gap-3">
            <h2 className="text-h2 text-brand-navy">{t("abonoTitulo")}</h2>
            <p className="text-body max-w-[50ch] text-neutral-700">
              {t("abonoTexto")}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-h2 text-brand-navy">{t("saldoTitulo")}</h2>
            <p className="text-body max-w-[50ch] text-neutral-700">
              {t("saldoTexto")}
            </p>
          </div>
        </div>
      </Section>

      {/* La aclaración va destacada, no en letra chica: es lo que evita que alguien
          entienda "cuotas" como financiación. */}
      <Section spacing="compact">
        <div className="border-brand-turquoise flex max-w-[65ch] flex-col gap-3 border-l-4 pl-6">
          <h2 className="text-h3 text-brand-navy">{t("aclaracionTitulo")}</h2>
          <p className="text-body text-neutral-700">{t("aclaracionTexto")}</p>
        </div>
      </Section>

      <Section background="alt" spacing="compact">
        <div className="flex max-w-[60ch] flex-col gap-3">
          <h2 className="text-h2 text-brand-navy">{t("mediosTitulo")}</h2>
          {/* TODO: VERIFICAR medios de pago aceptados antes de publicar. */}
          <p className="text-body text-neutral-700">{t("mediosPendiente")}</p>
        </div>
      </Section>

      <Section>
        <h2 className="text-h2 text-brand-navy mb-8">{t("despuesTitulo")}</h2>
        <ol className="flex flex-col gap-6 border-l-2 border-neutral-200 pl-6">
          {["paso1", "paso2", "paso3"].map((clave) => (
            <li key={clave} className="text-body max-w-[60ch] text-neutral-700">
              {t(clave)}
            </li>
          ))}
        </ol>
      </Section>

      {/* Anti-fraude, en tono sereno: informa, no asusta. Y se aplica a sí misma. */}
      <Section background="navy">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16">
          <div className="flex max-w-[55ch] flex-col gap-4">
            <ShieldCheck
              weight="regular"
              className="text-brand-turquoise size-8"
              aria-hidden="true"
            />
            <h2 className="text-h2">{t("seguridadTitulo")}</h2>
            <p className="text-body text-white/90">{t("seguridadTexto")}</p>
            <Link
              href="/legal"
              className="text-body text-brand-turquoise inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
            >
              {t("verLegal")}
            </Link>
          </div>

          <ButtonLink
            href={whatsappHref}
            variant="whatsapp"
            size="lg"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <WhatsAppIcon className="size-5" />
            {tc("hablaConAsesor")}
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
