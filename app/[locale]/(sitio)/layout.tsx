import { setRequestLocale } from "next-intl/server";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloating } from "@/components/layout/whatsapp-floating";

/**
 * Cromo del sitio: navegación completa, pie y botón flotante.
 *
 * Vive en un route group `(sitio)` y no en `[locale]/layout.tsx` porque las
 * landings de campaña necesitan un cromo DISTINTO, no uno añadido: en Next.js los
 * layouts anidados se componen, así que un navbar declarado arriba aparecería
 * también en las landings, donde cada enlace es una fuga del embudo.
 *
 * Los paréntesis del nombre hacen que el grupo NO aparezca en la URL: `/destinos`
 * sigue siendo `/destinos`.
 */
export default async function SitioLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  /**
   * Obligatorio, aunque este layout no traduzca nada por sí mismo.
   *
   * `next-intl` exige `setRequestLocale` en CADA layout y página de la cadena para
   * mantener el renderizado estático. Al introducir este layout sin la llamada,
   * las 44 rutas del sitio pasaron de prerenderizadas (●) a dinámicas (ƒ) en el
   * build, sin ningún error: el síntoma es un sitio entero que deja de ser
   * estático y nadie se entera hasta que sube el TTFB.
   */
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
      <WhatsAppFloating />
    </>
  );
}
