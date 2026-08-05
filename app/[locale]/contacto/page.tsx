import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Clock, MapPin } from "@phosphor-icons/react/dist/ssr";

import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { LeadForm } from "@/components/forms/lead-form";
import { WhatsAppIcon } from "@/components/layout/whatsapp-floating";
import { buildWhatsAppUrl, CONTACT } from "@/lib/config";

/**
 * Contacto.
 *
 * Dos vías equilibradas: WhatsApp destacado porque es el canal real de la agencia,
 * y el formulario para quien prefiere no chatear. Ninguna de las dos se esconde.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contacto" });

  return { title: t("titulo"), description: t("entradilla") };
}

export default async function ContactoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("contacto");
  const tc = await getTranslations("cta");
  const tm = await getTranslations("microcopy");

  const whatsappHref = buildWhatsAppUrl({ message: t("entradilla") });

  return (
    <>
      <Section spacing="compact">
        <div className="flex max-w-[55ch] flex-col gap-4">
          <h1 className="text-h1 text-brand-navy">{t("titulo")}</h1>
          <p className="text-body-lg text-neutral-700">{t("entradilla")}</p>
        </div>
      </Section>

      <Section spacing="compact">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col items-start gap-4">
              <h2 className="text-h3 text-brand-navy">{t("whatsappTitulo")}</h2>
              <p className="text-body max-w-[45ch] text-neutral-700">
                {t("whatsappTexto")}
              </p>
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
              <p className="text-body-sm text-neutral-600">
                {tm("respuestaEnMinutos")}
              </p>
            </div>

            <dl className="flex flex-col gap-5 border-t border-neutral-200 pt-8">
              <h2 className="text-h3 text-brand-navy">{t("datosTitulo")}</h2>

              <Dato
                icono={
                  <Clock
                    weight="regular"
                    className="text-brand-turquoise size-5 shrink-0"
                    aria-hidden="true"
                  />
                }
                etiqueta={t("horario")}
                /* TODO: confirmar el horario real con la operación. Nunca "24/7". */
                valor={t("horarioValor")}
              />

              <Dato
                icono={
                  <MapPin
                    weight="regular"
                    className="text-brand-turquoise size-5 shrink-0"
                    aria-hidden="true"
                  />
                }
                etiqueta={t("ciudad")}
                valor={CONTACT.ciudad}
              />
            </dl>

            {/*
              EL MAPA NO SE EMBEBE TODAVÍA, y es una decisión, no un olvido.
              `CONTACT.direccion` es "XXXXXX": la dirección real no está confirmada.
              Un mapa apuntando a un punto inventado es un dato falso verificable en
              la página que existe justo para demostrar que la empresa es real.
              Cuando llegue la dirección, va aquí con loading="lazy" para no
              bloquear el LCP, y hay que revisarlo contra el banner de cookies del
              Paso 8: un iframe de mapas es una petición a un tercero.
            */}
            <p className="text-body-sm rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-5 text-neutral-600">
              {t("mapaPendiente")}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-h3 text-brand-navy">{t("formularioTitulo")}</h2>
            <p className="text-body max-w-[45ch] text-neutral-700">
              {t("formularioTexto")}
            </p>
            {/* Sin `offerId`: aquí la persona no venía mirando una oferta concreta. */}
            <LeadForm paginaOrigen="/contacto" />
          </div>
        </div>
      </Section>
    </>
  );
}

function Dato({
  icono,
  etiqueta,
  valor,
}: {
  icono: React.ReactNode;
  etiqueta: string;
  valor: string;
}) {
  return (
    <div className="flex items-start gap-3">
      {icono}
      <div className="flex flex-col">
        <dt className="text-caption text-neutral-600">{etiqueta}</dt>
        <dd className="text-body text-neutral-800">{valor}</dd>
      </div>
    </div>
  );
}
