import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import type { DestinationCategory } from "@/lib/types/destination";

type FilaOrdenable = { id: string; orden: number };

/**
 * Encuentra la fila y su vecina en la dirección pedida.
 *
 * Agnóstico de tabla a propósito: no sabe qué columna filtra el grupo (`oferta_id`
 * para imágenes, `tipo` para destinos), solo recibe la lista ya filtrada y ordenada.
 * Es la única parte de verdad compartida entre `moverImagenEnOrden` y
 * `moverDestinoEnOrden` — generalizar también la llamada a Supabase pelearía con su
 * tipado fuerte por tabla para ahorrar tres líneas (ver el comentario de cada
 * función), así que esas tres líneas quedan duplicadas a propósito.
 */
function encontrarVecino(
  filas: FilaOrdenable[],
  id: string,
  direccion: "arriba" | "abajo",
): { actual: FilaOrdenable; vecino: FilaOrdenable } | null {
  const i = filas.findIndex((fila) => fila.id === id);
  const j = direccion === "arriba" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= filas.length) return null;
  return { actual: filas[i], vecino: filas[j] };
}

/**
 * Intercambia el `orden` de una imagen con su vecina, dentro de la misma oferta.
 *
 * Valor puente (`-1`): un intercambio directo en dos `UPDATE` chocaría si `orden`
 * tuviera algún día un índice único por oferta.
 */
export async function moverImagenEnOrden({
  supabase,
  ofertaId,
  imagenId,
  direccion,
}: {
  supabase: SupabaseClient<Database>;
  ofertaId: string;
  imagenId: string;
  direccion: "arriba" | "abajo";
}): Promise<void> {
  const { data: imagenes } = await supabase
    .from("imagenes")
    .select("id, orden")
    .eq("oferta_id", ofertaId)
    .order("orden");
  if (!imagenes) return;

  const par = encontrarVecino(imagenes, imagenId, direccion);
  if (!par) return;
  const { actual, vecino } = par;

  await supabase.from("imagenes").update({ orden: -1 }).eq("id", actual.id);
  await supabase.from("imagenes").update({ orden: actual.orden }).eq("id", vecino.id);
  await supabase.from("imagenes").update({ orden: vecino.orden }).eq("id", actual.id);
}

/**
 * Intercambia el `orden` de un destino con su vecino, dentro de la misma categoría.
 *
 * Igual que en imágenes: el admin piensa en tres listas separadas (nacional,
 * internacional, pueblos de antioquia), aunque la columna `orden` sea global y sin
 * unicidad por categoría — mismo argumento que `oferta_id` en `moverImagenEnOrden`.
 */
export async function moverDestinoEnOrden({
  supabase,
  tipo,
  destinoId,
  direccion,
}: {
  supabase: SupabaseClient<Database>;
  tipo: DestinationCategory;
  destinoId: string;
  direccion: "arriba" | "abajo";
}): Promise<void> {
  const { data: destinos } = await supabase
    .from("destinos")
    .select("id, orden")
    .eq("tipo", tipo)
    .order("orden");
  if (!destinos) return;

  const par = encontrarVecino(destinos, destinoId, direccion);
  if (!par) return;
  const { actual, vecino } = par;

  await supabase.from("destinos").update({ orden: -1 }).eq("id", actual.id);
  await supabase.from("destinos").update({ orden: actual.orden }).eq("id", vecino.id);
  await supabase.from("destinos").update({ orden: vecino.orden }).eq("id", actual.id);
}
