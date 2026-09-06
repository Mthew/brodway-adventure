import type { SupabaseClient } from "@supabase/supabase-js";

import { aSlug, type CamposOfertaValores } from "@/lib/admin/campos";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Reglas de negocio de ofertas: crear, publicar, editar, vencer, reactivar.
 *
 * Sin JSX, sin `"use server"`, sin `revalidatePath`/`redirect` — eso vive en el
 * envoltorio de `app/admin/acciones/ofertas.ts` (mismo patrón que ya sigue
 * `lib/admin/imagenes.ts` con `app/admin/acciones/imagenes.ts`).
 */

export type ResultadoId = { error: string } | { id: string };
export type ResultadoOferta = { error: string } | { slug: string; destinoSlug: string | null };

/** Sin el caso `error`: vencer/reactivar no muestran mensaje, igual que antes del refactor. */
export type ExitoOferta = { slug: string; destinoSlug: string | null };

type DestinoRelacionado = { slug: string } | null;

/**
 * Paso 1: crea la oferta como BORRADOR y devuelve su id.
 *
 * La oferta existe en la base desde el primer paso, no al final del asistente. Es la
 * diferencia entre perder diez minutos de transcripción porque se cerró el navegador y
 * volver a encontrarla donde se dejó. El estado `borrador` ya garantiza que nada de
 * esto sea visible en el sitio mientras se completa.
 */
export async function crearBorradorOferta({
  supabase,
  valores,
}: {
  supabase: SupabaseClient<Database>;
  valores: CamposOfertaValores;
}): Promise<ResultadoId> {
  const hoy = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("ofertas")
    .insert({
      // El identificador de negocio se genera aquí y no se edita nunca: viaja al CRM
      // y tiene que sobrevivir a cualquier cambio de título.
      offer_id: `OF-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      // El slug se congela aquí. `actualizarOfertaExistente` nunca lo recalcula: cambiar
      // el título de una oferta publicada no debe mover su URL ni romper una campaña o
      // un enlace ya compartido.
      slug: aSlug(valores.titulo),
      destino_id: valores.destinoId,
      titulo: valores.titulo,
      beneficio_corto: valores.beneficioCorto,
      hotel: valores.hotel,
      alimentacion: valores.alimentacion,
      fecha_periodo: valores.fechaPeriodo,
      precio_desde: valores.precioDesde,
      noches: valores.noches,
      ciudad_origen: valores.ciudadOrigen,
      ocupacion_base: valores.ocupacionBase,
      vigencia_desde: valores.vigenciaDesde,
      vigencia_hasta: valores.vigenciaHasta,
      incluye: valores.incluye,
      no_incluye: valores.noIncluye,
      mayorista: valores.mayorista,
      notas_internas: valores.notasInternas,
      // Sin validar todavía: es exactamente lo que significa `borrador`.
      validada_el: hoy,
      estado: "borrador",
    })
    .select("id")
    .single();

  if (error) return { error: `No se pudo guardar: ${error.message}` };
  return { id: data.id };
}

/** Paso 3: dónde aparece la oferta y en qué orden. */
export async function guardarSeccionesOferta({
  supabase,
  id,
  mejoresOfertas,
  playasYHoteles,
  home,
  orden,
}: {
  supabase: SupabaseClient<Database>;
  id: string;
  mejoresOfertas: boolean;
  playasYHoteles: boolean;
  home: boolean;
  orden: number;
}): Promise<{ error: string } | { ok: true }> {
  const { error } = await supabase
    .from("ofertas")
    .update({
      mostrar_en_mejores_ofertas: mejoresOfertas,
      mostrar_en_playas_y_hoteles: playasYHoteles,
      mostrar_en_home: home,
      orden,
      actualizado_el: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: `No se pudo guardar: ${error.message}` };
  return { ok: true };
}

/**
 * Paso 4: publicar.
 *
 * Pasar de `borrador` a `vigente` es la validación humana de la tarifa, así que mueve
 * `validada_el` a hoy. Ese dato se muestra al visitante junto al precio, y es la
 * diferencia entre "alguien confirmó esto" y "esto lleva meses aquí".
 *
 * `mayorista` NO se valida aquí a propósito: es una decisión de producto (§6.1 y §7 de
 * `docs/product/plan-backoffice.md`) dejarlo como recomendación, no como bloqueo, hasta
 * que se resuelva si el backoffice es la base de ofertas o solo publica sobre una
 * externa.
 */
export async function publicarOferta({
  supabase,
  id,
}: {
  supabase: SupabaseClient<Database>;
  id: string;
}): Promise<ResultadoOferta> {
  const { data: oferta, error: errorLectura } = await supabase
    .from("ofertas")
    .select("slug, destino_id, destinos(slug)")
    .eq("id", id)
    .single();

  if (errorLectura || !oferta) {
    return { error: "No encontramos la oferta que ibas a publicar." };
  }

  const { count } = await supabase
    .from("imagenes")
    .select("id", { count: "exact", head: true })
    .eq("oferta_id", id);

  if (!count) {
    return { error: "Añade al menos una foto antes de publicar. Vuelve al paso de fotos." };
  }

  const { error } = await supabase
    .from("ofertas")
    .update({
      estado: "vigente",
      validada_el: new Date().toISOString().slice(0, 10),
      actualizado_el: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: `No se pudo publicar: ${error.message}` };

  return {
    slug: oferta.slug,
    destinoSlug: (oferta.destinos as DestinoRelacionado)?.slug ?? null,
  };
}

/**
 * Edita una oferta existente, sea borrador, vigente o vencida.
 *
 * No toca `slug`, `offer_id`, `estado` ni `validada_el`: el slug se congela al crear
 * (decisión explícita, no se recalcula del título), el `offer_id` no se edita nunca,
 * y `estado`/`validada_el` son de publicar/vencer/reactivar, no de corregir contenido
 * — corregir una falta de ortografía no es volver a confirmar la tarifa con el
 * mayorista.
 */
export async function actualizarOfertaExistente({
  supabase,
  id,
  valores,
}: {
  supabase: SupabaseClient<Database>;
  id: string;
  valores: CamposOfertaValores;
}): Promise<ResultadoOferta> {
  const { data: oferta, error } = await supabase
    .from("ofertas")
    .update({
      destino_id: valores.destinoId,
      titulo: valores.titulo,
      beneficio_corto: valores.beneficioCorto,
      hotel: valores.hotel,
      alimentacion: valores.alimentacion,
      fecha_periodo: valores.fechaPeriodo,
      precio_desde: valores.precioDesde,
      noches: valores.noches,
      ciudad_origen: valores.ciudadOrigen,
      ocupacion_base: valores.ocupacionBase,
      vigencia_desde: valores.vigenciaDesde,
      vigencia_hasta: valores.vigenciaHasta,
      incluye: valores.incluye,
      no_incluye: valores.noIncluye,
      mayorista: valores.mayorista,
      notas_internas: valores.notasInternas,
      informacion_importante: valores.informacionImportante,
      requisitos: valores.requisitos,
      documentacion: valores.documentacion,
      politica_cancelacion: valores.politicaCancelacion,
      actualizado_el: new Date().toISOString(),
    })
    .eq("id", id)
    .select("slug, destinos(slug)")
    .single();

  if (error) return { error: `No se pudo guardar: ${error.message}` };

  return {
    slug: oferta.slug,
    destinoSlug: (oferta.destinos as DestinoRelacionado)?.slug ?? null,
  };
}

/**
 * Saca la oferta del sitio de inmediato, sin esperar a que venza por fecha.
 *
 * `isExpired` (`lib/types/offer.ts`) ya trata `estado !== "vigente"` como vencida: no
 * hace falta ninguna lógica nueva de renderizado, el sitio público ya sabe mostrar
 * este estado con su página de tarifa vencida en vez de un 404.
 */
export async function vencerOfertaExistente({
  supabase,
  id,
}: {
  supabase: SupabaseClient<Database>;
  id: string;
}): Promise<ExitoOferta | null> {
  const { data: oferta, error } = await supabase
    .from("ofertas")
    .update({ estado: "vencida", actualizado_el: new Date().toISOString() })
    .eq("id", id)
    .select("slug, destinos(slug)")
    .single();

  if (error) return null;

  return {
    slug: oferta.slug,
    destinoSlug: (oferta.destinos as DestinoRelacionado)?.slug ?? null,
  };
}

export type ResultadoReactivar = ExitoOferta | { bloqueada: true } | null;

/**
 * Reactiva una oferta vencida a mano.
 *
 * Si la vigencia ya pasó por fecha, reactivar sin más la deja igual de invisible:
 * `isExpired` sigue viendo la fecha vencida y la mostraría vencida otra vez. Se
 * bloquea con un mensaje explícito en vez de dejar creer que ya se ve.
 */
export async function reactivarOfertaExistente({
  supabase,
  id,
}: {
  supabase: SupabaseClient<Database>;
  id: string;
}): Promise<ResultadoReactivar> {
  const { data: actual } = await supabase
    .from("ofertas")
    .select("vigencia_hasta")
    .eq("id", id)
    .maybeSingle();

  if (actual && actual.vigencia_hasta < new Date().toISOString().slice(0, 10)) {
    return { bloqueada: true };
  }

  const { data: oferta, error } = await supabase
    .from("ofertas")
    .update({ estado: "vigente", actualizado_el: new Date().toISOString() })
    .eq("id", id)
    .select("slug, destinos(slug)")
    .single();

  if (error) return null;

  return {
    slug: oferta.slug,
    destinoSlug: (oferta.destinos as DestinoRelacionado)?.slug ?? null,
  };
}
