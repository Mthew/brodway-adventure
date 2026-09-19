import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { RNT_NUMBER } from "@/lib/config";

/**
 * Cromo MÍNIMO de las landings de campaña.
 *
 * Lo que NO lleva, y cada ausencia es deliberada (brief-v0.md §7):
 *
 *   - Sin navegación. Cero enlaces que saquen a la persona del flujo. Una landing
 *     de pauta se paga por clic: cada enlace de salida es presupuesto tirado.
 *   - El logo NO enlaza al inicio, por lo mismo. Es identificación, no navegación.
 *   - Sin botón flotante de WhatsApp: la landing ya repite su CTA a lo largo del
 *     scroll, y apilar un flotante encima es ruido.
 *   - Pie reducido a lo que la ley exige: RNT y aviso ESCNNA.
 */
export default async function LandingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  /* `campana` va en el tipo aunque no se use: los params de un layout incluyen
     TODOS los segmentos dinámicos de su ruta, y omitirlo no compila. */
  params: Promise<{ locale: string; campana: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("footer");

  return (
    <>
      <header className="bg-surface-base shadow-[inset_0_-1px_0_var(--color-neutral-200)]">
        <div className="mx-auto flex max-w-6xl items-center px-6 py-3 md:px-8">
          {/*
            Sin <Link>: identifica la marca, no navega. N-02.1 reemplazó el archivo
            por la firma horizontal oficial del kit (public/README); las dimensiones
            reales declaradas (width/height 1759×894) evitan que Next distorsione el
            aspect ratio.

            N-02.2 (fase-2-la-firma.md §4.2): dimensionado por ANCHO, no por altura
            — el mínimo del manual (180px) se mide en el ancho. Esta landing NO
            tiene el techo de 80px de la barra de navegación (§4.1 es exclusivo de
            `navbar.tsx`; §4.2 no menciona ningún límite de alto para el
            encabezado de campaña), así que aquí sí se puede cumplir el mínimo real
            del manual sin el conflicto que sí existe en `navbar.tsx` (ver el
            comentario ahí y docs/brand/specs/ejecucion/nodos/N-02.2.json): 200px
            de ancho da ~102px de alto (200 × 894/1759), bien por encima de los
            180px mínimos, con margen frente a compresión del contenedor.
          */}
          <Image
            src="/brand/logo-horizontal.png"
            alt="BroWay Adventures"
            width={1759}
            height={894}
            priority
            className="h-auto w-[200px]"
          />
        </div>
      </header>

      <div className="flex flex-1 flex-col">{children}</div>

      <footer className="bg-brand-navy text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-10 md:px-8">
          <p className="text-body-sm font-semibold">
            {t("rnt", { numero: RNT_NUMBER })}
          </p>
          {/* Exigido por la Ley 679 de 2001 a los prestadores turísticos. */}
          <p className="text-caption max-w-[70ch] text-white/90">
            {t("escnna")}
          </p>
          <p className="text-caption text-white/90">
            {t("derechos", { anio: new Date().getFullYear() })}
          </p>
        </div>
      </footer>
    </>
  );
}
