import type { SupabaseClient } from "@supabase/supabase-js";

import { aSlug, validarNombreDestino, type CamposDestinoValores } from "@/lib/admin/campos";
import type { Database } from "@/lib/supabase/database.types";
import type { DestinationCategory } from "@/lib/types/destination";

/**
 * Reglas de negocio de destinos: crear, actualizar, crear rápido.
 *
 * Sin JSX, sin `"use server"`, sin `revalidatePath`/`redirect` — mismo patrón que
 * `lib/admin/ofertas.ts` e `imagenes.ts`.
 */

export type ResultadoId = { error: string } | { id: string };
export type ResultadoDestino = { error: string } | { slug: string };

/**
 * Crea un destino nuevo.
 *
 * Nace `inactivo` siempre, sin importar lo que traiga el formulario: no puede
 * activarse sin sus dos fotos, tarjeta y cabecera (`actualizarDestinoExistente` lo
 * bloquea), y en esta pantalla todavía no hay dónde subirlas — eso vive en
 * `[id]/editar`.
 */
export async function crearDestinoNuevo({
  supabase,
  valores,
}: {
  supabase: SupabaseClient<Database>;
  valores: CamposDestinoValores;
}): Promise<ResultadoId> {
  const { data, error } = await supabase
    .from("destinos")
    .insert({
      slug: aSlug(valores.nombre),
      nombre: valores.nombre,
      tipo: valores.tipo,
      resumen: valores.resumen,
      destacado_en_home: valores.destacadoEnHome,
      estado: "inactivo",
    })
    .select("id")
    .single();

  if (error) return { error: `No se pudo crear: ${error.message}` };
  return { id: data.id };
}

/**
 * Edita un destino existente. No toca `slug` nunca: se congela al crear, igual que
 * en ofertas — cambiar el nombre no debe mover la URL pública.
 */
export async function actualizarDestinoExistente({
  supabase,
  id,
  valores,
}: {
  supabase: SupabaseClient<Database>;
  id: string;
  valores: CamposDestinoValores;
}): Promise<ResultadoDestino> {
  if (valores.estado === "activo") {
    const { data: actual } = await supabase
      .from("destinos")
      .select("imagen, imagen_hero")
      .eq("id", id)
      .maybeSingle();
    if (!actual?.imagen || !actual?.imagen_hero) {
      return { error: "Sube la foto de tarjeta y la de cabecera antes de activar este destino." };
    }
  }

  const { data: destino, error } = await supabase
    .from("destinos")
    .update({
      nombre: valores.nombre,
      tipo: valores.tipo,
      resumen: valores.resumen,
      destacado_en_home: valores.destacadoEnHome,
      estado: valores.estado,
      actualizado_el: new Date().toISOString(),
    })
    .eq("id", id)
    .select("slug")
    .single();

  if (error) return { error: `No se pudo guardar: ${error.message}` };
  return { slug: destino.slug };
}

export type ResultadoDestinoRapido = { error: string } | { destino: { id: string; nombre: string } };

/**
 * Crea un destino desde el diálogo del asistente de ofertas, sin abandonar la carga.
 *
 * Solo pide nombre/categoría/resumen (no el formulario completo) para no derailar el
 * flujo que de verdad importa. No revalida: nace inactivo, nada público cambia
 * todavía — eso ocurre cuando alguien lo active desde `/admin/destinos`.
 */
export async function crearDestinoRapidoNuevo({
  supabase,
  nombre,
  tipo,
  resumen,
}: {
  supabase: SupabaseClient<Database>;
  nombre: string;
  tipo: string;
  resumen: string | null;
}): Promise<ResultadoDestinoRapido> {
  const errorNombre = validarNombreDestino(nombre);
  if (errorNombre) return { error: errorNombre };
  if (!["nacional", "internacional", "pueblos-de-antioquia"].includes(tipo)) {
    return { error: "Elige una categoría." };
  }

  const { data, error } = await supabase
    .from("destinos")
    .insert({
      slug: aSlug(nombre),
      nombre,
      tipo: tipo as DestinationCategory,
      resumen,
      estado: "inactivo",
    })
    .select("id, nombre")
    .single();

  if (error) return { error: `No se pudo crear: ${error.message}` };
  return { destino: data };
}
