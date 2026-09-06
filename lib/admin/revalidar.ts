import { revalidatePath } from "next/cache";

/**
 * Rutas que caducan cuando una oferta cambia de estado o de datos publicables.
 *
 * Una sola definición: cada Server Action que publica o edita una oferta llama a esto
 * en vez de repetir la lista. El sitio es estático (SSG/ISR); sin esto, la base
 * cambia y el visitante sigue viendo la página vieja — justo el problema que el
 * backoffice viene a resolver (§26 del documento del cliente).
 */
export function revalidarOferta(slug: string, destinoSlug?: string | null) {
  revalidatePath("/", "layout");
  revalidatePath("/ofertas");
  revalidatePath(`/ofertas/${slug}`);
  if (destinoSlug) revalidatePath(`/destinos/${destinoSlug}`);
}

/** El paso de fotos del asistente no vive en el sitio público: se revalida solo. */
export function revalidarFotos(ofertaId: string) {
  revalidatePath(`/admin/ofertas/${ofertaId}/fotos`);
}

/**
 * Rutas que caducan cuando un destino cambia. Revalidación amplia de las tres
 * categorías (mismo criterio que `revalidarOferta` con `/ofertas`): más barato que
 * calcular cuál de las tres listas de verdad incluye a este destino.
 */
export function revalidarDestino(slug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/destinos");
  revalidatePath("/destinos/nacionales");
  revalidatePath("/destinos/internacionales");
  revalidatePath("/destinos/pueblos-de-antioquia");
  if (slug) revalidatePath(`/destinos/${slug}`);
}
