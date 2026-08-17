import { listActiveOffers } from "@/lib/offers";
import { getSupabase } from "@/lib/supabase/client";
import { filaADestino } from "@/lib/supabase/mapeo";
import type { Destination, DestinationCategory } from "@/lib/types/destination";
import type { Offer } from "@/lib/types/offer";

/**
 * ÚNICA puerta de acceso a los destinos.
 *
 * Mismo patrón que `lib/offers`: lee de Supabase y ninguna página sabe de dónde
 * vienen los datos.
 *
 * Ninguna página debe consultar Supabase directamente.
 */

async function consultarDestinos(): Promise<Destination[]> {
  const { data, error } = await getSupabase()
    .from("destinos")
    .select("*")
    .order("orden", { ascending: true })
    .order("nombre", { ascending: true });

  if (error) {
    throw new Error(`No se pudieron leer los destinos: ${error.message}`);
  }

  return data.map(filaADestino);
}

/**
 * Destinos publicables.
 *
 * Filtra por `estado` aquí y no en cada página: un destino desactivado debe
 * desaparecer de TODAS partes a la vez, y dejar ese filtro a criterio de quien
 * escribe la página es cómo se cuela en una sola.
 */
export async function listDestinations(): Promise<Destination[]> {
  const destinos = await consultarDestinos();
  return destinos.filter((destino) => destino.estado === "activo");
}

export async function listDestinationsByCategory(
  categoria: DestinationCategory,
): Promise<Destination[]> {
  const destinos = await listDestinations();
  return destinos.filter((destino) => destino.tipo === categoria);
}

/**
 * Los que la agencia eligió mostrar en la home.
 *
 * "No todos los destinos deben tener necesariamente el mismo protagonismo"
 * (`estructura-funcional-cliente.md` §9): la home es una selección curada, no el
 * catálogo entero.
 */
export async function listFeaturedDestinations(
  categoria?: DestinationCategory,
): Promise<Destination[]> {
  const destinos = categoria
    ? await listDestinationsByCategory(categoria)
    : await listDestinations();
  return destinos.filter((destino) => destino.destacadoEnHome);
}

/**
 * Slugs con página propia.
 *
 * Incluye los INACTIVOS a propósito: desactivar un destino lo saca de los listados,
 * pero su URL puede estar en un anuncio ya publicado o indexada en Google. Devolver
 * un 404 ahí pierde a alguien que llegó con intención.
 */
export async function listDestinationSlugs(): Promise<string[]> {
  const { data, error } = await getSupabase().from("destinos").select("slug");

  if (error) {
    throw new Error(`No se pudieron leer los slugs de destinos: ${error.message}`);
  }

  return data.map((fila) => fila.slug);
}

export async function getDestination(
  slug: string,
): Promise<Destination | null> {
  const { data, error } = await getSupabase()
    .from("destinos")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`No se pudo leer el destino ${slug}: ${error.message}`);
  }

  return data ? filaADestino(data) : null;
}

/**
 * Categoría de cada destino, por slug.
 *
 * La necesitan los listados de ofertas para poder filtrar por categoría: una `Offer`
 * conoce su `destinoSlug` pero no si ese destino es nacional, internacional o de
 * Antioquia. Se resuelve con UNA consulta y un mapa, en vez de preguntar por cada
 * oferta.
 */
export async function getCategoriasPorSlug(): Promise<
  Map<string, DestinationCategory>
> {
  const destinos = await consultarDestinos();
  return new Map(destinos.map((destino) => [destino.slug, destino.tipo]));
}

/** Ofertas publicables de un destino. Una vencida no se ofrece como catálogo. */
export async function listOffersForDestination(
  destinoSlug: string,
): Promise<Offer[]> {
  const offers = await listActiveOffers();
  return offers.filter((offer) => offer.destinoSlug === destinoSlug);
}

/**
 * Precio "desde" de un destino, calculado de sus ofertas VIGENTES.
 *
 * Devuelve `null` si no hay ninguna, y entonces la tarjeta se muestra sin precio.
 * Esa es la decisión correcta: un precio desactualizado es peor que ningún precio,
 * y el "desde" de un destino no es un dato editable sino el resultado de las ofertas
 * que hoy se pueden vender.
 */
export async function getDestinationFromPrice(
  destinoSlug: string,
): Promise<{ precioDesde: number; moneda: Offer["moneda"] } | null> {
  const offers = await listOffersForDestination(destinoSlug);
  if (offers.length === 0) return null;

  const masBarata = offers.reduce((minima, offer) =>
    offer.precioDesde < minima.precioDesde ? offer : minima,
  );

  return { precioDesde: masBarata.precioDesde, moneda: masBarata.moneda };
}
