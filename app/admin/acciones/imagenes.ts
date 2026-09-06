"use server";

import {
  eliminarImagenYObjeto,
  guardarAltImagen,
  moverImagenAlPrincipio,
} from "@/lib/admin/imagenes";
import { moverImagenEnOrden } from "@/lib/admin/orden";
import { revalidarFotos } from "@/lib/admin/revalidar";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

import { exigirSesion } from "./sesion";

/** Quita una imagen de la galería: la fila y, si la política de Storage ya existe, el objeto. */
export async function eliminarImagen(datos: FormData) {
  await exigirSesion();
  const supabase = await getSupabaseAdmin();

  const imagenId = String(datos.get("imagen_id") ?? "");
  const ofertaId = String(datos.get("oferta_id") ?? "");
  if (!imagenId) return;

  await eliminarImagenYObjeto({ supabase, imagenId });
  revalidarFotos(ofertaId);
}

/** Sube o baja una foto un puesto dentro de la misma oferta. */
export async function moverImagen(datos: FormData) {
  await exigirSesion();
  const supabase = await getSupabaseAdmin();

  const ofertaId = String(datos.get("oferta_id") ?? "");
  const imagenId = String(datos.get("imagen_id") ?? "");
  const direccion = datos.get("direccion") === "arriba" ? "arriba" : "abajo";
  if (!ofertaId || !imagenId) return;

  await moverImagenEnOrden({ supabase, ofertaId, imagenId, direccion });
  revalidarFotos(ofertaId);
}

/** Marca una foto como portada: la mueve al primer puesto de la oferta. */
export async function usarComoPortada(datos: FormData) {
  await exigirSesion();
  const supabase = await getSupabaseAdmin();

  const ofertaId = String(datos.get("oferta_id") ?? "");
  const imagenId = String(datos.get("imagen_id") ?? "");
  if (!ofertaId || !imagenId) return;

  await moverImagenAlPrincipio({ supabase, ofertaId, imagenId });
  revalidarFotos(ofertaId);
}

/** Guarda (o corrige) el ALT de una foto. */
export async function guardarAlt(datos: FormData) {
  await exigirSesion();
  const supabase = await getSupabaseAdmin();

  const imagenId = String(datos.get("imagen_id") ?? "");
  const ofertaId = String(datos.get("oferta_id") ?? "");
  const alt = String(datos.get("alt") ?? "");
  if (!imagenId) return;

  await guardarAltImagen({ supabase, imagenId, alt });
  revalidarFotos(ofertaId);
}
