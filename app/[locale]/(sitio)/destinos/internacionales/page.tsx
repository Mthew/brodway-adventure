import type { Metadata } from "next";

import {
  ListadoCategoria,
  metadataDeCategoria,
} from "@/components/destinos/listado-categoria";

/**
 * Destinos Internacionales (`estructura-funcional-cliente.md` §10).
 *
 * Ruta estática a propósito: gana sobre `/destinos/[slug]`, y por eso "internacionales"
 * es un slug reservado (ver `lib/destinations/categorias.ts`). Toda la estructura
 * está en `ListadoCategoria`, compartida con las otras dos categorías.
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
  return <ListadoCategoria locale={locale} tipo="internacional" />;
}
