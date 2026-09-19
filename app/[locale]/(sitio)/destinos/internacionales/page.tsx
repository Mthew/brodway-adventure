import type { Metadata } from "next";

import {
  CategoryList,
  metadataDeCategoria,
} from "@/src/modules/destinations/presentation/components/category-list";

/**
 * Destinos Internacionales (`estructura-funcional-cliente.md` §10).
 *
 * Ruta estática a propósito: gana sobre `/destinos/[slug]`, y por eso "internacionales"
 * es un slug reservado (ver `lib/destinations/categorias.ts`). Toda la estructura
 * está en `CategoryList`, compartida con las otras dos categorías.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return metadataDeCategoria(locale, "internacional");
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <CategoryList locale={locale} tipo="internacional" />;
}
