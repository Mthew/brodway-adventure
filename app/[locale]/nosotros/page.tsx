import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SealCheck } from "@phosphor-icons/react/dist/ssr";

import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { WhatsAppIcon } from "@/components/layout/whatsapp-floating";
import {
  AFILIACIONES,
  buildWhatsAppUrl,
  CONTACT,
  NIT_NUMBER,
  RNT_NUMBER,
} from "@/lib/config";

/**
 * Nosotros.
 *
 * Es la página que sostiene la credibilidad, que es el objetivo declarado del MVP:
 * mucha gente en Colombia desconfía de las agencias de viajes por el fraude, y con
 * razón. Por eso el bloque de legalidad no es un detalle del pie, es la razón de
 * ser de esta página.
 *
 * La historia sale del manual de marca. "Bro" es el vínculo y "Way" el camino: eso
 * explica el origen del nombre, pero NO es un eslogan. Nunca se escribe "hermanos
 * de aventuras".
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nosotros" });

  return { title: t("titulo"), description: t("entradilla") };
}

export default async function NosotrosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("nosotros");
  const tc = await getTranslations("cta");

  const valores = [
    ["valorClaridad", "valorClaridadTexto"],
    ["valorConfianza", "valorConfianzaTexto"],
    ["valorCercania", "valorCercaniaTexto"],
    ["valorResponsabilidad", "valorResponsabilidadTexto"],
    ["valorCuriosidad", "valorCuriosidadTexto"],
    ["valorConsistencia", "valorConsistenciaTexto"],
  ] as const;

  const whatsappHref = buildWhatsAppUrl({ message: t("entradilla") });

  return (
    <>
      <Section spacing="compact">
        <div className="flex max-w-[22ch] flex-col gap-5">
          <h1 className="text-h1 text-brand-navy">{t("titulo")}</h1>
        </div>
        <p className="text-body-lg mt-5 max-w-[55ch] text-neutral-700">
          {t("entradilla")}
        </p>
      </Section>

      {/* Historia: texto e imagen a un lado. Es la ÚNICA sección de la página con
          este patrón, para no encadenar dos iguales. */}
      <Section background="alt">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="flex flex-col gap-5">
            <h2 className="text-h2 text-brand-navy">{t("historiaTitulo")}</h2>
            <p className="text-body max-w-[60ch] text-neutral-700">
              {t("historiaP1")}
            </p>
            <p className="text-body max-w-[60ch] text-neutral-700">
              {t("historiaP2")}
            </p>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-neutral-100">
            <Image
              src="https://picsum.photos/seed/broway-fundadores-carretera/900/675"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      {/* Propósito, misión y visión: texto corrido, no bullets de presentación. */}
      <Section>
        <div className="flex max-w-[65ch] flex-col gap-6">
          <h2 className="text-h2 text-brand-navy">{t("propositoTitulo")}</h2>
          <p className="text-body-lg text-neutral-700">{t("proposito")}</p>
          <p className="text-body text-neutral-700">{t("mision")}</p>
          <p className="text-body text-neutral-700">{t("vision")}</p>
        </div>
      </Section>

      {/* Valores: rejilla de 6 con separadores, no seis tarjetas iguales. */}
      <Section background="alt">
        <h2 className="text-h2 text-brand-navy mb-10">{t("valoresTitulo")}</h2>
        <dl className="grid gap-x-12 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {valores.map(([clave, texto]) => (
            <div
              key={clave}
              className="border-brand-turquoise/40 flex flex-col gap-2 border-t-2 pt-4"
            >
              <dt className="text-h3 text-brand-navy">{t(clave)}</dt>
              <dd className="text-body text-neutral-700">{t(texto)}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/*
        Bloque de legalidad. Va en navy y a ancho completo porque es lo que la
        página viene a demostrar. Ningún dato está inventado: los que faltan se
        muestran como pendientes, no se rellenan con valores plausibles.
      */}
      <Section background="navy">
        <div className="flex flex-col gap-8">
          <div className="flex max-w-[60ch] flex-col gap-3">
            <SealCheck
              weight="regular"
              className="text-brand-turquoise size-8"
              aria-hidden="true"
            />
            <h2 className="text-h2">{t("legalTitulo")}</h2>
            <p className="text-body text-white/90">{t("legalIntro")}</p>
          </div>

          <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            <DatoLegal etiqueta={t("legalRnt")} valor={`RNT ${RNT_NUMBER}`} />
            <DatoLegal etiqueta={t("legalNit")} valor={NIT_NUMBER} />
            <DatoLegal etiqueta={t("legalDireccion")} valor={CONTACT.ciudad} />
            <DatoLegal
              etiqueta={t("legalAfiliaciones")}
              valor={
                AFILIACIONES.length > 0
                  ? AFILIACIONES.join(" · ")
                  : t("legalPendiente")
              }
            />
          </dl>
        </div>
      </Section>

      <Section>
        <div className="flex flex-col items-start gap-5">
          <h2 className="text-h2 text-brand-navy max-w-[20ch]">
            {t("ctaTitulo")}
          </h2>
          <ButtonLink
            href={whatsappHref}
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

/** TODO: VERIFICAR dato legal real antes de publicar. */
function DatoLegal({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex flex-col gap-1 border-t border-white/20 pt-4">
      <dt className="text-caption text-white/70">{etiqueta}</dt>
      <dd className="text-body-lg font-semibold text-white">{valor}</dd>
    </div>
  );
}
