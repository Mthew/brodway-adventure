import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Caveat, Lato, Montserrat } from "next/font/google";

import { routing } from "@/lib/i18n/routing";
import { CookieBanner } from "@/components/layout/cookie-banner";
import "../globals.css";

/**
 * TIPOGRAFÍAS OFICIALES DE MARCA. Confirmadas por el cliente el 2026-08-05.
 *
 * Sólo se cargan los pesos que el manual autoriza. Cada peso extra es descarga
 * que paga el 83% de tráfico móvil, y aquí no hay ninguno de adorno:
 *
 *   Montserrat  600 SemiBold (H4, botones) · 700 Bold (H2, H3) · 800 ExtraBold (H1)
 *   Lato        400 Regular · 700 Bold      (el manual recomienda hasta SemiBold,
 *                                            que Lato no tiene: su salto es 400→700)
 *   Caveat      700 Bold, único peso que el manual autoriza
 *
 * `display: "swap"` en las tres: el texto se ve con la fuente de respaldo desde
 * el primer frame en vez de quedar invisible mientras descarga, que es lo que
 * arruina el LCP en una conexión móvil.
 */
const montserrat = Montserrat({
  // Deliberadamente NO se llama `--font-display`: ese es el token de globals.css
  // y se declara como `var(--font-montserrat), …`. Usar el mismo nombre en los dos
  // lados crea una autorreferencia que mata la cadena de respaldo.
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

/**
 * Caveat. Firma narrativa y nada más.
 *
 * El manual la limita a 8-10 palabras y la prohíbe en párrafos, precios,
 * condiciones y mayúsculas sostenidas. Se carga un solo peso para que no haya
 * tentación de usarla como familia de interfaz.
 */
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: {
      default: t("defaultTitle"),
      template: `%s · ${t("siteName")}`,
    },
    description: t("defaultDescription"),
    alternates: {
      // hreflang — spec-tecnica.md §3.5. `es` va sin prefijo por la estrategia
      // "as-needed", así que su URL canónica es la raíz.
      languages: {
        es: "/",
        en: "/en",
        "x-default": "/",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Next.js 16: `params` es una promesa, el acceso síncrono ya no existe
  // (spec-tecnica.md §2.1.1).
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Habilita el renderizado estático de las páginas de este locale.
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${montserrat.variable} ${lato.variable} ${caveat.variable} h-full antialiased`}
    >
      {/*
        Este layout NO monta navbar ni footer, a propósito.

        El sitio tiene DOS cromos distintos y los layouts anidados de Next.js se
        componen en vez de reemplazarse, así que poner el navbar aquí lo haría
        aparecer también en las landings de campaña, donde está prohibido: una
        landing no lleva navegación porque cada enlace es una fuga del embudo
        (brief-v0.md §7).

        El cromo completo vive en `(sitio)/layout.tsx` y el mínimo en
        `lp/[campana]/layout.tsx`. Los route groups no cambian las URLs.
      */}
      <body className="bg-surface-base text-neutral-900 flex min-h-full flex-col font-body">
        <NextIntlClientProvider>
          {children}
          {/*
            El banner SÍ va en el layout raíz, aunque el resto del cromo no.

            Es la excepción deliberada a la nota de arriba: el consentimiento de
            cookies aplica a todas las páginas, incluidas las landings de campaña,
            que no llevan navbar ni pie. Montarlo en `(sitio)` lo dejaría fuera de
            justo las páginas que reciben tráfico pago.
          */}
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
