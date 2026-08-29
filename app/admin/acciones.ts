"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSupabaseAdmin, getUsuarioAdmin } from "@/lib/supabase/admin";

/**
 * Acciones del backoffice.
 *
 * Todas empiezan comprobando la sesión. No basta con que el layout redirija a quien no
 * ha entrado: una Server Action es un endpoint, y se puede invocar sin pasar por la
 * página que la contiene. RLS es la última barrera, pero fallar aquí da un mensaje
 * entendible en vez de un error de permisos de Postgres.
 */

async function exigirSesion() {
  const usuario = await getUsuarioAdmin();
  if (!usuario) redirect("/admin/entrar");
  return usuario;
}

export type EstadoFormulario = { error: string } | null;

export async function entrar(
  _previo: EstadoFormulario,
  datos: FormData,
): Promise<EstadoFormulario> {
  const correo = String(datos.get("correo") ?? "").trim();
  const clave = String(datos.get("clave") ?? "");

  if (!correo || !clave) {
    return { error: "Escribe tu correo y tu contraseña." };
  }

  const supabase = await getSupabaseAdmin();
  const { error } = await supabase.auth.signInWithPassword({
    email: correo,
    password: clave,
  });

  if (error) {
    /*
     * Mensaje genérico a propósito: distinguir "ese correo no existe" de "la
     * contraseña es incorrecta" le confirma a un desconocido qué correos tienen
     * cuenta. El texto dice qué hacer, que es lo que necesita quien sí trabaja aquí.
     */
    return { error: "No pudimos entrar con esos datos. Revísalos e inténtalo otra vez." };
  }

  redirect("/admin");
}

export async function salir() {
  const supabase = await getSupabaseAdmin();
  await supabase.auth.signOut();
  redirect("/admin/entrar");
}

/**
 * Paso 1: crea la oferta como BORRADOR y devuelve su id.
 *
 * La oferta existe en la base desde el primer paso, no al final del asistente. Es la
 * diferencia entre perder diez minutos de transcripción porque se cerró el navegador y
 * volver a encontrarla donde se dejó. El estado `borrador` ya garantiza que nada de
 * esto sea visible en el sitio mientras se completa.
 */
export async function crearBorrador(
  _previo: EstadoFormulario,
  datos: FormData,
): Promise<EstadoFormulario> {
  await exigirSesion();
  const supabase = await getSupabaseAdmin();

  const titulo = String(datos.get("titulo") ?? "").trim();
  const destinoId = String(datos.get("destino_id") ?? "");
  const precio = Number(datos.get("precio_desde") ?? 0);
  const noches = Number(datos.get("noches") ?? 0);
  const ciudadOrigen = String(datos.get("ciudad_origen") ?? "").trim();
  const ocupacion = String(datos.get("ocupacion_base") ?? "doble").trim();
  const vigenciaDesde = String(datos.get("vigencia_desde") ?? "");
  const vigenciaHasta = String(datos.get("vigencia_hasta") ?? "");

  if (!titulo || !destinoId || !ciudadOrigen) {
    return { error: "Faltan el nombre de la oferta, el destino o la ciudad de salida." };
  }
  if (!(precio > 0)) {
    return { error: "El precio tiene que ser mayor que cero." };
  }
  if (!(noches > 0)) {
    return { error: "Las noches tienen que ser al menos una." };
  }
  if (!vigenciaDesde || !vigenciaHasta) {
    return { error: "La vigencia necesita fecha de inicio y de fin." };
  }
  if (vigenciaHasta < vigenciaDesde) {
    return { error: "La vigencia termina antes de empezar. Revisa las fechas." };
  }

  const hoy = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("ofertas")
    .insert({
      // El identificador de negocio se genera aquí y no se edita nunca: viaja al CRM
      // y tiene que sobrevivir a cualquier cambio de título.
      offer_id: `OF-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      slug: aSlug(titulo),
      destino_id: destinoId,
      titulo,
      beneficio_corto: String(datos.get("beneficio_corto") ?? "").trim(),
      hotel: vacioANulo(datos.get("hotel")),
      alimentacion: vacioANulo(datos.get("alimentacion")),
      fecha_periodo: vacioANulo(datos.get("fecha_periodo")),
      precio_desde: precio,
      noches,
      ciudad_origen: ciudadOrigen,
      ocupacion_base: ocupacion,
      vigencia_desde: vigenciaDesde,
      vigencia_hasta: vigenciaHasta,
      incluye: aLista(datos.get("incluye")),
      no_incluye: aLista(datos.get("no_incluye")),
      // Sin validar todavía: es exactamente lo que significa `borrador`.
      validada_el: hoy,
      estado: "borrador",
    })
    .select("id")
    .single();

  if (error) {
    return { error: `No se pudo guardar: ${error.message}` };
  }

  redirect(`/admin/ofertas/${data.id}/fotos`);
}

/** Paso 3. Dónde aparece la oferta y en qué orden. */
export async function guardarSecciones(
  _previo: EstadoFormulario,
  datos: FormData,
): Promise<EstadoFormulario> {
  await exigirSesion();
  const supabase = await getSupabaseAdmin();

  const id = String(datos.get("id") ?? "");
  if (!id) return { error: "Falta la oferta." };

  const { error } = await supabase
    .from("ofertas")
    .update({
      mostrar_en_mejores_ofertas: datos.get("mejores_ofertas") === "on",
      mostrar_en_playas_y_hoteles: datos.get("playas_y_hoteles") === "on",
      mostrar_en_home: datos.get("home") === "on",
      orden: Number(datos.get("orden") ?? 0),
      actualizado_el: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: `No se pudo guardar: ${error.message}` };

  redirect(`/admin/ofertas/${id}/publicar`);
}

/**
 * Paso 4: publicar.
 *
 * Pasar de `borrador` a `vigente` es la validación humana de la tarifa, así que mueve
 * `validada_el` a hoy. Ese dato se muestra al visitante junto al precio, y es la
 * diferencia entre "alguien confirmó esto" y "esto lleva meses aquí".
 */
export async function publicar(
  _previo: EstadoFormulario,
  datos: FormData,
): Promise<EstadoFormulario> {
  await exigirSesion();
  const supabase = await getSupabaseAdmin();

  const id = String(datos.get("id") ?? "");
  if (!id) return { error: "Falta la oferta." };

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

  /*
   * Revalidar es parte de publicar, no un extra.
   *
   * El sitio es estático: sin esto la oferta queda publicada en la base y el visitante
   * sigue viendo la página de antes, que es justo el problema que el panel viene a
   * resolver (§26 del documento del cliente).
   */
  const destinoSlug = (oferta.destinos as { slug: string } | null)?.slug;
  revalidatePath("/", "layout");
  revalidatePath("/ofertas");
  revalidatePath(`/ofertas/${oferta.slug}`);
  if (destinoSlug) revalidatePath(`/destinos/${destinoSlug}`);

  redirect(`/admin?publicada=${oferta.slug}`);
}

/** Quita una imagen de la galería. */
export async function eliminarImagen(datos: FormData) {
  await exigirSesion();
  const supabase = await getSupabaseAdmin();

  const imagenId = String(datos.get("imagen_id") ?? "");
  const ofertaId = String(datos.get("oferta_id") ?? "");
  if (!imagenId) return;

  await supabase.from("imagenes").delete().eq("id", imagenId);
  revalidatePath(`/admin/ofertas/${ofertaId}/fotos`);
}

// ---------------------------------------------------------------------------

function vacioANulo(valor: FormDataEntryValue | null): string | null {
  const texto = String(valor ?? "").trim();
  return texto === "" ? null : texto;
}

/** Una línea por elemento: es como viene escrito en un flyer. */
function aLista(valor: FormDataEntryValue | null): string[] {
  return String(valor ?? "")
    .split("\n")
    .map((linea) => linea.trim())
    .filter(Boolean);
}

/**
 * Slug a partir del título.
 *
 * Quita tildes y eñes con `normalize`, porque un slug con `ñ` o `é` se codifica en la
 * URL y deja de ser legible en un anuncio. Es editable después: el `offer_id` es lo
 * que no cambia nunca.
 */
function aSlug(titulo: string): string {
  return titulo
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
