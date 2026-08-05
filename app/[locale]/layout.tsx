import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Inter, Outfit } from "next/font/google";

import { routing } from "@/lib/i18n/routing";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloating } from "@/components/layout/whatsapp-floating";
import { CookieBanner } from "@/components/layout/cookie-banner";
import "../globals.css";

/**
 * TODO: confirmar tipografía oficial con el dueño de marca.
 * El manual de marca v2.0 no define tipografías (brief-v0.md §12), así que estas
 * son sustitutas: Outfit para títulos, Inter para cuerpo.
 */
const outfit = Outfit({
  // Deliberadamente NO se llama `--font-display`: ese es el token de globals.css
  // y se declara como `var(--font-outfit), …`. Usar el mismo nombre en los dos
  // lados crea una autorreferencia que mata la cadena de respaldo.
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="bg-surface-base text-neutral-900 flex min-h-full flex-col font-body">
        <NextIntlClientProvider>
          <Navbar />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
          <WhatsAppFloating />
          {/* Va en el layout RAÍZ, dentro del provider: el banner debe aparecer
              en todas las páginas, también en las landings de campaña, que no
              llevan el resto del cromo del sitio. */}
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
