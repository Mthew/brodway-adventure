import type { DestinationCategory } from "@/lib/types/destination";

/**
 * Correspondencia entre el segmento de URL y la categoría del modelo.
 *
 * Existe porque las dos cosas no coinciden y no deben coincidir: la URL va en plural
 * porque es un listado (`/destinos/internacionales`), y el valor del enum va en
 * singular porque califica a UN destino (`tipo: "internacional"`). Traducir a mano en
 * cada página es cómo aparecen las rutas que no resuelven.
 *
 * Estos tres segmentos están RESERVADOS: `/destinos/[slug]` los excluye de
 * `generateStaticParams`, porque un destino llamado `internacionales` colisionaría
 * con su propio listado. Next.js resolvería el segmento estático y el destino
 * quedaría inalcanzable sin ningún error.
 */
export const SEGMENTOS_CATEGORIA = {
  internacionales: "internacional",
  nacionales: "nacional",
  "pueblos-de-antioquia": "pueblos-de-antioquia",
} as const satisfies Record<string, DestinationCategory>;

export type SegmentoCategoria = keyof typeof SEGMENTOS_CATEGORIA;

export const SLUGS_RESERVADOS: readonly string[] = Object.keys(SEGMENTOS_CATEGORIA);

export function esSegmentoCategoria(valor: string): valor is SegmentoCategoria {
  return valor in SEGMENTOS_CATEGORIA;
}

/** Sufijo de las claves de `messages.categorias`, para no repetir el `switch`. */
export const CLAVE_CATEGORIA = {
  internacional: "Internacional",
  nacional: "Nacional",
  "pueblos-de-antioquia": "PueblosAntioquia",
} as const satisfies Record<DestinationCategory, string>;
