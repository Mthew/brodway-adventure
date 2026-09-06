import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";

/**
 * Reglas de imágenes del backoffice: sugerencia de ALT, guardado de ALT, portada y
 * borrado (fila + objeto de Storage).
 *
 * La SUBIDA (comprimir + `.upload()` + `insert`) no vive aquí a propósito, aunque
 * `plan-backoffice.md` §2.2 la mencione en la misma línea que este archivo: ese paso
 * corre en el NAVEGADOR (`fotos/subir.tsx` y `fotos/comprimir.ts`) y usa
 * `document`/`canvas`/`Image` — `lib/admin/**` tiene que seguir siendo Node-safe. Lo
 * que sí corre en el servidor vive aquí: ordenar (portada), guardar el ALT y borrar.
 */

const PREFIJO_STORAGE_CATALOGO = "/storage/v1/object/public/catalogo/";

/**
 * Deriva la ruta interna del bucket a partir de la URL pública guardada en `imagenes.url`.
 *
 * No hay una columna `ruta` aparte por decisión: añadirla exigiría un `ALTER TABLE`
 * manual (no hay `supabase/config.toml` versionado) para un dato que la URL ya contiene
 * entero, con un prefijo fijo (el mismo que usa `next.config.ts` para el
 * `remotePatterns` de `next/image`). `null` si la URL no trae ese prefijo — una fila
 * tocada a mano en Supabase no debe tumbar el borrado.
 */
export function rutaDesdeUrlPublica(url: string): string | null {
  const i = url.indexOf(PREFIJO_STORAGE_CATALOGO);
  if (i < 0) return null;
  return decodeURIComponent(url.slice(i + PREFIJO_STORAGE_CATALOGO.length));
}

/**
 * Borra el objeto de Storage de una imagen. Nunca lanza.
 *
 * Hoy (antes del paso manual de `plan-backoffice.md` §5) NO existen las políticas RLS de
 * `delete` + `select` sobre `storage.objects` para el bucket `catalogo`. Sin la política
 * de `select`, `.remove()` no encuentra el objeto como candidato y Storage responde
 * ÉXITO con una lista vacía — no hay un `error` que comprobar. Por eso esta función no
 * expone ni comprueba el resultado: no existe una señal fiable de "falló". La
 * verificación real es la que pide el "Hecho cuando" de la Fase 3: listar el bucket a
 * mano, no confiar en el código.
 */
export async function borrarObjetoStorage(
  supabase: SupabaseClient<Database>,
  url: string,
): Promise<void> {
  const ruta = rutaDesdeUrlPublica(url);
  if (!ruta) return;
  await supabase.storage.from("catalogo").remove([ruta]);
}

/**
 * Borra una imagen entera: primero el objeto de Storage, luego la fila.
 *
 * La fila se borra SIEMPRE, incluso si el paso de Storage no borró nada de verdad (ver
 * `borrarObjetoStorage`). Bloquear el borrado de la fila hasta que exista la política
 * manual dejaría "Quitar" roto en el panel HOY, con el código ya listo para cuando se
 * aplique la política — el trade-off contrario (fallar toda la acción) no arregla nada
 * mientras la política no exista, solo le quita al usuario una función que hoy funciona.
 */
export async function eliminarImagenYObjeto({
  supabase,
  imagenId,
}: {
  supabase: SupabaseClient<Database>;
  imagenId: string;
}): Promise<void> {
  const { data: fila } = await supabase
    .from("imagenes")
    .select("url")
    .eq("id", imagenId)
    .maybeSingle();

  if (fila?.url) await borrarObjetoStorage(supabase, fila.url);

  await supabase.from("imagenes").delete().eq("id", imagenId);
}

/**
 * Mueve una imagen al primer puesto (portada) de su oferta.
 *
 * Distinto de `moverImagenEnOrden` (intercambio con el vecino inmediato, en
 * `lib/admin/orden.ts`): la portada puede estar a varios puestos de distancia, así que
 * esto no es un swap de dos filas, es un renumerado completo del grupo. La foto elegida
 * pasa a `orden` 0; el resto se corre +1 conservando su orden relativo entre sí.
 */
export async function moverImagenAlPrincipio({
  supabase,
  ofertaId,
  imagenId,
}: {
  supabase: SupabaseClient<Database>;
  ofertaId: string;
  imagenId: string;
}): Promise<void> {
  const { data: imagenes } = await supabase
    .from("imagenes")
    .select("id, orden")
    .eq("oferta_id", ofertaId)
    .order("orden");
  if (!imagenes || imagenes.length === 0) return;

  const elegida = imagenes.find((imagen) => imagen.id === imagenId);
  if (!elegida || elegida.id === imagenes[0].id) return; // ya es la portada

  const resto = imagenes.filter((imagen) => imagen.id !== imagenId);

  // Valor puente negativo, mismo criterio que el `-1` de `moverImagenEnOrden`: evita
  // que la foto elegida choque con los `orden` 1..N que se están reasignando al resto.
  await supabase.from("imagenes").update({ orden: -1 }).eq("id", elegida.id);
  for (const [i, imagen] of resto.entries()) {
    await supabase.from("imagenes").update({ orden: i + 1 }).eq("id", imagen.id);
  }
  await supabase.from("imagenes").update({ orden: 0 }).eq("id", elegida.id);
}

/**
 * Sugerencia automática de ALT (§29): "Hotel Riu Palace en Punta Cana", o solo el
 * destino si la oferta no tiene hotel (un tour, por ejemplo).
 *
 * No le antepone la palabra "Hotel": `hotel` ya trae el nombre tal como se transcribió
 * del flyer (`components/ui/card.tsx` lo imprime igual, sin prefijo) — anteponerla aquí
 * la duplicaría cuando el dato ya la incluya.
 */
export function sugerirAlt({
  destino,
  hotel,
}: {
  destino: string;
  hotel: string | null;
}): string {
  return hotel ? `${hotel} en ${destino}` : destino;
}

/** Guarda (o corrige) el ALT de una foto. Cadena vacía se guarda como `null`, no `""`. */
export async function guardarAltImagen({
  supabase,
  imagenId,
  alt,
}: {
  supabase: SupabaseClient<Database>;
  imagenId: string;
  alt: string;
}): Promise<void> {
  const valor = alt.trim();
  await supabase
    .from("imagenes")
    .update({ alt: valor === "" ? null : valor })
    .eq("id", imagenId);
}
