import type { Metadata } from "next";
import { Lato, Montserrat } from "next/font/google";

import "@/app/globals.css";

/*
<!--
THESIS: publicar una oferta es una secuencia, no un formulario; el panel refusa la
tabla densa de escritorio que todo backoffice copia por defecto.
OWN-WORLD: la identidad del sitio, sin inventar nada — navy #003062, turquesa
#00aac3, naranja #ff6a03 para la acción que avanza, Montserrat en títulos y Lato en
lectura, superficies blancas sobre #f4f7fa. Reconocible con el contenido tapado por
sus objetivos táctiles enormes y su única columna.
STORY: alguien del equipo llega con un flyer de mayorista en la mano, lo transcribe,
le pone fotos, elige dónde aparece y lo publica, sin salir del pulgar.
FIRST VIEWPORT: una barra de progreso de cuatro pasos arriba; debajo, el flyer visible
mientras se transcribe; los campos en una sola columna; y el botón de avanzar fijo al
fondo de la pantalla, a 56px de alto, siempre alcanzable.
FORM: asistente de publicación, posición 3 de mi lista ordenada, elegido por el
usuario sobre el líder del dado. Seed d05b70b8.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
-->
*/

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Panel · BroWay Adventures",
  /*
   * El panel no se indexa. No es una preferencia: publica precios en borrador y
   * nombres de mayorista, y ninguna de las dos cosas debe aparecer en un buscador.
   */
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Cromo propio del backoffice.
 *
 * Es un tercer cromo, además de `(sitio)` y `lp/[campana]`: sin navbar público, sin
 * pie, sin botón flotante de WhatsApp y sin selector de idioma. Comparte los tokens y
 * las tipografías del sitio —la identidad no se reinventa para uso interno— pero
 * ninguno de sus componentes de navegación.
 *
 * Vive fuera de `[locale]` porque es interno y sólo en español; ver la nota del
 * `matcher` en `proxy.ts`.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${montserrat.variable} ${lato.variable}`}>
      <body className="bg-surface-alt text-brand-navy min-h-svh antialiased">
        {children}
      </body>
    </html>
  );
}
