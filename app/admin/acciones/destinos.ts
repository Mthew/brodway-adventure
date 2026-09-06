"use server";

import { redirect } from "next/navigation";

import { parsearCamposDestino } from "@/lib/admin/campos";
import {
  actualizarDestinoExistente,
  crearDestinoNuevo,
  crearDestinoRapidoNuevo,
  type ResultadoDestinoRapido,
} from "@/lib/admin/destinos";
import { moverDestinoEnOrden } from "@/lib/admin/orden";
import { revalidarDestino } from "@/lib/admin/revalidar";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { DestinationCategory } from "@/lib/types/destination";

import { exigirSesion, type EstadoFormulario } from "./sesion";

/** Crea un destino nuevo y sigue a su pantalla de edición. */
export async function crearDestino(
  _previo: EstadoFormulario,
  datos: FormData,
): Promise<EstadoFormulario> {
  await exigirSesion();
  const supabase = await getSupabaseAdmin();

  const resultado = parsearCamposDestino(datos);
  if ("error" in resultado) return { error: resultado.error };

  const creado = await crearDestinoNuevo({ supabase, valores: resultado.valores });
  if ("error" in creado) return { error: creado.error };

  redirect(`/admin/destinos/${creado.id}/editar?creado=1`);
}

/** Edita un destino existente. */
export async function actualizarDestino(
  _previo: EstadoFormulario,
  datos: FormData,
): Promise<EstadoFormulario> {
  await exigirSesion();
  const supabase = await getSupabaseAdmin();

  const id = String(datos.get("id") ?? "");
  if (!id) return { error: "Falta el destino." };

  const resultado = parsearCamposDestino(datos);
  if ("error" in resultado) return { error: resultado.error };

  const actualizado = await actualizarDestinoExistente({
    supabase,
    id,
    valores: resultado.valores,
  });
  if ("error" in actualizado) return { error: actualizado.error };

  revalidarDestino(actualizado.slug);
  redirect(`/admin/destinos?actualizado=${actualizado.slug}`);
}

/** Sube o baja un destino un puesto dentro de la misma categoría. */
export async function moverDestino(datos: FormData) {
  await exigirSesion();
  const supabase = await getSupabaseAdmin();

  const destinoId = String(datos.get("destino_id") ?? "");
  const tipo = String(datos.get("tipo") ?? "") as DestinationCategory;
  const direccion = datos.get("direccion") === "arriba" ? "arriba" : "abajo";
  if (!destinoId || !tipo) return;

  await moverDestinoEnOrden({ supabase, tipo, destinoId, direccion });
  revalidarDestino();
}

export type EstadoDestinoRapido = ResultadoDestinoRapido | null;

/**
 * Crea un destino desde el diálogo del asistente de ofertas, sin abandonar la carga.
 * No revalida: nace inactivo, nada público cambia todavía.
 */
export async function crearDestinoRapido(
  _previo: EstadoDestinoRapido,
  datos: FormData,
): Promise<EstadoDestinoRapido> {
  await exigirSesion();
  const supabase = await getSupabaseAdmin();

  const nombre = String(datos.get("nombre") ?? "").trim();
  const tipo = String(datos.get("tipo") ?? "");
  const resumen = String(datos.get("resumen") ?? "").trim() || null;

  return crearDestinoRapidoNuevo({ supabase, nombre, tipo, resumen });
}
