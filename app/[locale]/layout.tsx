import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Manrope } from "next/font/google";

import { SITE_URL } from "@/lib/config";
import { routing } from "@/lib/i18n/routing";
import { THEME_COLOR_NAVY } from "@/lib/theme-color";
import { CookieBanner } from "@/src/modules/tracking/presentation/components/cookie-banner";
import "../globals.css";

/**
 * Next.js 16: `themeColor` ya NO va dentro de `metadata`, sale a un export
 * `viewport` aparte (fase-2-la-firma.md §4.4). Navy oficial de marca — hex
 * literal aislado en `lib/theme-color.ts` porque este atributo no es CSS y no
 * puede leer `var(--color-brand-navy)` (ver comentario de ese archivo).
 */
export const viewport: Viewport = {
  themeColor: THEME_COLOR_NAVY,
};

/**
 * TIPOGRAFÍA OFICIAL DE MARCA. Manrope, una sola familia (D-A, decidido
 * 2026-09-11, `docs/brand/aprobaciones.md`). Sustituye a las tres familias con
 * función separada del manual v2.0 — ver `docs/brand/specs/fase-6-tipografia.md`
 * §3.1.
 *
 * Se cargan los cinco pesos que la jerarquía del manual necesita: 400 Regular
 * (párrafos) · 500 Medium · 600 SemiBold (H4, botones, cuerpo con énfasis) ·
 * 700 Bold (H2, H3) · 800 ExtraBold (H1). La familia anterior de cuerpo no
 * tenía 500/600 (su salto era 400→700); Manrope sí, así que la jerarquía se
 * cumple tal como la escribe el manual por primera vez.
 *
 * La firma narrativa manuscrita sale del sistema (D-B): «Next Stop» deja de
 * firmarse en cursiva. Tenía cero usos en componentes, así que retirarla no
 * toca ningún JSX — ver `docs/brand/aprobaciones.md` para el porqué.
 *
 * `display: "swap"`: el texto se ve con la fuente de respaldo desde el primer
 * frame en vez de quedar invisible mientras descarga, que es lo que arruina
 * el LCP en una conexión móvil.
 */
const manrope = Manrope({
  // Deliberadamente NO se llama `--font-display` ni `--font-body`: esos son
  // los tokens de globals.css, que se declaran como `var(--font-manrope), …`.
  // Usar el mismo nombre en los dos lados crea una autorreferencia que mata
  // la cadena de respaldo (el mismo defecto que tenía el panel, corregido
  // aquí en los dos layouts a la vez — fase-6-tipografia.md §1.2 y §2.2).
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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

  // `es` va sin prefijo por la estrategia "as-needed" de next-intl, así que su
  // URL canónica es la raíz.
  const path = locale === routing.defaultLocale ? "/" : `/${locale}`;

  return {
    // Sin esto, `openGraph.images`/`opengraph-image.png` se resuelven como
    // rutas relativas — inválidas para un scraper externo (WhatsApp, Slack,
    // Meta) que necesita una URL absoluta. fase-2-la-firma.md §4.4.
    metadataBase: new URL(SITE_URL),
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
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      locale,
      title: t("defaultTitle"),
      description: t("defaultDescription"),
      url: path,
      // La convención de archivo `app/opengraph-image.png` NO se resuelve
      // sola aquí: vive en `app/` (fuera de `[locale]`) y Next.js 16 no cruza
      // esa frontera de segmento dinámico para adjuntar imágenes estáticas —
      // verificado por mutación (ver más abajo). Se referencia a mano en su
      // lugar; `metadataBase` (arriba) la vuelve absoluta.
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: "Firma de BroWay Adventures sobre fondo navy de marca.",
        },
      ],
      // Páginas con foto propia (oferta, destino, campaña) sobrescriben este
      // array con su propia foto — fuera de este nodo (N-02.5).
    },
    twitter: {
      card: "summary_large_image",
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
      className={`${manrope.variable} h-full antialiased`}
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
