import type { Metadata } from "next";

import {
  CategoryList,
  metadataDeCategoria,
} from "@/src/modules/destinations/presentation/components/category-list";

/**
 * Pueblos de Antioquia (`estructura-funcional-cliente.md` §14).
 *
 * Ruta estática a propósito: gana sobre `/destinos/[slug]`, y por eso "pueblos-de-antioquia"
 * es un slug reservado (ver `lib/destinations/categorias.ts`). Toda la estructura
 * está en `CategoryList`, compartida con las otras dos categorías.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return metadataDeCategoria(locale, "pueblos-de-antioquia");
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <CategoryList locale={locale} tipo="pueblos-de-antioquia" />;
}
