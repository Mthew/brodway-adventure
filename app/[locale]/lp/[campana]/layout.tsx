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
          {/* Sin <Link>: identifica la marca, no navega. */}
          <Image
            src="/logo-broway.png"
            alt="BroWay Adventures"
            width={180}
            height={56}
            priority
            className="h-14 w-auto"
          />
        </div>
      </header>

      <div className="flex flex-1 flex-col">{children}</div>

      <footer className="bg-brand-navy text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-10 md:px-8">
          {/* TODO: VERIFICAR dato legal real antes de publicar */}
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
