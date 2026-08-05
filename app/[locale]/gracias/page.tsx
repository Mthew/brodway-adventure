import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChatCircleDots, CheckCircle } from "@phosphor-icons/react/dist/ssr";

import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { TrackLead } from "@/components/forms/track-lead";
import { Link } from "@/lib/i18n/navigation";
import { buildWhatsAppUrl } from "@/lib/config";

/**
 * Confirmación post-lead.
 *
 * Es corta pero no es un trámite: es donde se registra la conversión limpia y donde
 * se evita que el lead se enfríe entre el envío y la primera respuesta del asesor.
 *
 * Tres cosas que NO van aquí (brief-v0-producto.md §9.8): un segundo formulario,
 * una encuesta, y euforia. La confirmación es serena.
 */

export const metadata: Metadata = {
  // No se indexa: es una página de embudo, no de contenido.
  robots: { index: false, follow: false },
};

export default async function GraciasPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ evento?: string; oferta?: string; destino?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { evento, oferta, destino } = await searchParams;
  const t = await getTranslations("gracias");

  /**
   * El CTA conserva el contexto de la página desde la que se envió el formulario.
   * Sin esto, la persona llega a WhatsApp y el asesor tiene que volver a preguntar
   * qué viaje estaba viendo, que es justo lo que el sitio existe para evitar.
   */
  const whatsappUrl = buildWhatsAppUrl({
    message: destino ? t("mensajeWhatsappConDestino", { destino }) : t("mensajeWhatsapp"),
    offerId: oferta,
  });

  return (
    <>
      {evento ? (
        <TrackLead eventId={evento} offerId={oferta} page="/gracias" />
      ) : null}

      <Section className="flex min-h-[60vh] flex-col justify-center">
        <div className="flex max-w-2xl flex-col gap-6">
          <CheckCircle
            weight="regular"
            className="text-brand-turquoise size-12"
            aria-hidden="true"
          />

          <h1 className="text-h1 text-brand-navy">{t("titulo")}</h1>

          {/*
            Expectativa concreta, no "te contactaremos pronto". Es lo que evita que
            la persona se enfríe. El número sigue pendiente de la operación: no se
            promete un tiempo que la agencia no pueda cumplir, y nunca "24/7".
            TODO: confirmar el tiempo real de respuesta con la operación.
          */}
          <p className="text-body-lg text-neutral-700">{t("expectativa")}</p>

          <ol className="flex flex-col gap-4 border-l-2 border-neutral-200 pl-6">
            {["paso1", "paso2", "paso3"].map((clave) => (
              <li key={clave} className="text-body text-neutral-700">
                {t(clave)}
              </li>
            ))}
          </ol>

          <div className="flex flex-col gap-3 pt-2">
            <ButtonLink
              href={whatsappUrl}
              variant="whatsapp"
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
              className="self-start"
            >
              <ChatCircleDots weight="regular" className="size-5" aria-hidden="true" />
              {t("ctaWhatsapp")}
            </ButtonLink>

            {/*
              TODO (Pasos 5-6): cuando existan /destinos y /faq, los enlaces suaves
              van ahí. Hoy no se enlazan para no publicar un 404.
            */}
            {/*
              `self-start` no es cosmético: dentro de un flex column un <a> se
              estira a todo el ancho, y su mitad derecha queda DEBAJO del botón
              flotante de WhatsApp. Se medía 24→351 con el flotante en 299→355:
              tocar ahí abría WhatsApp en vez de seguir el enlace. La caja tiene
              que medir lo que mide el texto.
            */}
            <Link
              href="/"
              /* `min-h-11` = 44px: el mínimo táctil en móvil vale también para los
                 enlaces de texto, no sólo para los botones. */
              className="text-body text-brand-turquoise-text inline-flex min-h-11 items-center self-start font-semibold underline-offset-4 hover:underline"
            >
              {t("volver")}
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
