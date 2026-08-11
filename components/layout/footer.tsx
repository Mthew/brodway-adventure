import { getTranslations } from "next-intl/server";

import { Link } from "@/lib/i18n/navigation";
import { CONTACT, RNT_NUMBER } from "@/lib/config";

/**
 * Pie de página.
 *
 * La franja inferior no es decorativa: el RNT, el aviso ESCNNA (Ley 679 de 2001) y
 * el mensaje anti-fraude son obligatorios o directamente la razón de ser de la
 * página para un visitante que desconfía del rubro.
 */
export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");

  return (
    <footer className="bg-brand-navy mt-auto text-white">
      <div className="mx-auto max-w-6xl px-6 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3">
            <p className="text-h3 font-display font-bold">BroWay Adventures</p>
            <p className="text-body-sm text-white/70">{t("proposito")}</p>
          </div>

          <nav className="flex flex-col gap-3" aria-label={t("tituloDestinos")}>
            <p className="text-body-sm font-semibold">{t("tituloDestinos")}</p>
            <Link href="/destinos" className="text-body-sm text-white/70 hover:text-white">
              {tNav("destinos")}
            </Link>
            <Link href="/paquetes" className="text-body-sm text-white/70 hover:text-white">
              {tNav("paquetes")}
            </Link>
          </nav>

          <nav className="flex flex-col gap-3" aria-label={t("tituloEmpresa")}>
            <p className="text-body-sm font-semibold">{t("tituloEmpresa")}</p>
            <Link href="/nosotros" className="text-body-sm text-white/70 hover:text-white">
              {tNav("nosotros")}
            </Link>
            <Link href="/como-pagar" className="text-body-sm text-white/70 hover:text-white">
              {tNav("comoPagar")}
            </Link>
            <Link href="/contacto" className="text-body-sm text-white/70 hover:text-white">
              {tNav("contacto")}
            </Link>
            {/* Paréntesis y no guion largo: el Pre-Flight §11.B prohíbe el `—` en
                todo texto visible, y este es un texto visible aunque esté atenuado. */}
            <span className="text-body-sm text-white/60">
              {t("blog")} ({t("blogProximamente")})
            </span>
          </nav>

          <nav className="flex flex-col gap-3" aria-label={t("tituloLegal")}>
            <p className="text-body-sm font-semibold">{t("tituloLegal")}</p>
            <Link href="/legal" className="text-body-sm text-white/70 hover:text-white">
              {t("legal")}
            </Link>
            <Link href="/faq" className="text-body-sm text-white/70 hover:text-white">
              {t("faq")}
            </Link>
            {/* TODO: VERIFICAR datos de contacto reales antes de publicar */}
            <span className="text-body-sm text-white/70">{CONTACT.ciudad}</span>
            <span className="text-body-sm text-white/70">{CONTACT.email}</span>
          </nav>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 md:px-8">
          <p className="text-body-sm font-semibold">
            {t("rnt", { numero: RNT_NUMBER })}
          </p>
          <p className="text-caption text-white/70">{t("escnna")}</p>
          <p className="text-caption text-white/70">{t("antifraude")}</p>
          {/* `white/60` y no `/50`: sobre navy, el 50% rinde 4.40:1 y no llega al
              4.5 de AA. El 60% da 5.64:1. Medido, no estimado. */}
          <p className="text-caption text-white/60">
            {t("derechos", { anio: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
