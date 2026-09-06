"use server";

import { redirect } from "next/navigation";

import { parsearCamposOferta } from "@/lib/admin/campos";
import {
  actualizarOfertaExistente,
  crearBorradorOferta,
  guardarSeccionesOferta,
  publicarOferta,
  reactivarOfertaExistente,
  vencerOfertaExistente,
} from "@/lib/admin/ofertas";
import { revalidarOferta } from "@/lib/admin/revalidar";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

import { exigirSesion, type EstadoFormulario } from "./sesion";

/** Paso 1: transcribe la oferta como borrador y sigue al paso de fotos. */
export async function crearBorrador(
  _previo: EstadoFormulario,
  datos: FormData,
): Promise<EstadoFormulario> {
  await exigirSesion();
  const supabase = await getSupabaseAdmin();
  const resultado = parsearCamposOferta(datos);
  if ("error" in resultado) return { error: resultado.error };
  const creada = await crearBorradorOferta({ supabase, valores: resultado.valores });
  if ("error" in creada) return { error: creada.error };
  redirect(`/admin/ofertas/${creada.id}/fotos`);
}

/** Paso 3: dónde aparece la oferta y en qué orden. */
export async function guardarSecciones(
  _previo: EstadoFormulario,
  datos: FormData,
): Promise<EstadoFormulario> {
  await exigirSesion();
  const supabase = await getSupabaseAdmin();
  const id = String(datos.get("id") ?? "");
  if (!id) return { error: "Falta la oferta." };
  const resultado = await guardarSeccionesOferta({
    supabase,
    id,
    mejoresOfertas: datos.get("mejores_ofertas") === "on",
    playasYHoteles: datos.get("playas_y_hoteles") === "on",
    home: datos.get("home") === "on",
    orden: Number(datos.get("orden") ?? 0),
  });
  if ("error" in resultado) return { error: resultado.error };
  redirect(`/admin/ofertas/${id}/publicar`);
}

/** Paso 4: publicar. */
export async function publicar(
  _previo: EstadoFormulario,
  datos: FormData,
): Promise<EstadoFormulario> {
  await exigirSesion();
  const supabase = await getSupabaseAdmin();
  const id = String(datos.get("id") ?? "");
  if (!id) return { error: "Falta la oferta." };
  const resultado = await publicarOferta({ supabase, id });
  if ("error" in resultado) return { error: resultado.error };
  revalidarOferta(resultado.slug, resultado.destinoSlug);
  redirect(`/admin?publicada=${resultado.slug}`);
}

/** Edita una oferta existente, sea borrador, vigente o vencida. */
export async function actualizarOferta(
  _previo: EstadoFormulario,
  datos: FormData,
): Promise<EstadoFormulario> {
  await exigirSesion();
  const supabase = await getSupabaseAdmin();
  const id = String(datos.get("id") ?? "");
  if (!id) return { error: "Falta la oferta." };
  const resultado = parsearCamposOferta(datos);
  if ("error" in resultado) return { error: resultado.error };
  const actualizada = await actualizarOfertaExistente({ supabase, id, valores: resultado.valores });
  if ("error" in actualizada) return { error: actualizada.error };
  revalidarOferta(actualizada.slug, actualizada.destinoSlug);
  redirect(`/admin?actualizada=${actualizada.slug}`);
}

/** Saca la oferta del sitio de inmediato, sin esperar a que venza por fecha. */
export async function vencerOferta(datos: FormData) {
  await exigirSesion();
  const supabase = await getSupabaseAdmin();
  const id = String(datos.get("id") ?? "");
  if (!id) return;
  const resultado = await vencerOfertaExistente({ supabase, id });
  if (!resultado) return;
  revalidarOferta(resultado.slug, resultado.destinoSlug);
  redirect(`/admin/ofertas/${id}/editar?vencida=1`);
}

/** Reactiva una oferta vencida a mano, salvo que su vigencia ya haya pasado por fecha. */
export async function reactivarOferta(datos: FormData) {
  await exigirSesion();
  const supabase = await getSupabaseAdmin();
  const id = String(datos.get("id") ?? "");
  if (!id) return;
  const resultado = await reactivarOfertaExistente({ supabase, id });
  if (!resultado) return;
  if ("bloqueada" in resultado) {
    redirect(`/admin/ofertas/${id}/editar?error=vigencia_vencida`);
  }
  revalidarOferta(resultado.slug, resultado.destinoSlug);
  redirect(`/admin/ofertas/${id}/editar?reactivada=1`);
}
