import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/lib/i18n/navigation";

/**
 * PLACEHOLDER DE FASE 0.
 *
 * La home real es parte de la Fase 1 y está especificada en
 * docs/design/brief-v0-producto.md §9.1. Esta página existe solo para verificar
 * que el routing por locale y el layout funcionan. Bórrala al construir la home.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("metadata");

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-24">
      <p className="text-caption text-brand-turquoise-text font-semibold tracking-widest uppercase">
        Fase 0 — fundaciones
      </p>
      <h1 className="text-h1 text-brand-navy">{t("siteName")}</h1>
      <p className="text-body-lg text-neutral-600">{t("defaultDescription")}</p>
      <p className="text-body-sm text-neutral-500">
        Locale activo: <code className="font-medium">{locale}</code>. Página
        temporal para verificar el routing — la home real se construye en Fase 1.
      </p>
      <Link
        className="text-body text-brand-turquoise-text font-semibold underline underline-offset-4"
        href="/design-system"
      >
        Ver el sistema de diseño
      </Link>
    </main>
  );
}
