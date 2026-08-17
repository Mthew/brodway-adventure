import { COLUMNAS_OFERTA, getSupabase } from "@/lib/supabase/client";
import { filaAOferta, type FilaOferta } from "@/lib/supabase/mapeo";
import { isExpired, isPublishable, type Offer } from "@/lib/types/offer";

/**
 * ÚNICA puerta de acceso a las ofertas.
 *
 * Lee de Supabase (tabla `ofertas`). Ninguna página importa de aquí hacia abajo:
 * cuando esto leía de `lib/mock/`, cambiar el origen no obligó a tocar una sola
 * página, y lo mismo valdrá para el siguiente cambio.
 *
 * Ninguna página debe consultar Supabase directamente.
 */

/**
 * Destino e imágenes vienen EMBEBIDOS, en la misma consulta.
 *
 * Resolverlos aparte convertiría un listado de seis ofertas en trece viajes a la
 * base. PostgREST los trae en uno solo siguiendo las claves foráneas.
 */
const SELECT = `${COLUMNAS_OFERTA},destinos(slug,nombre),imagenes(url,orden)`;

/**
 * El filtro de publicable se aplica en el SERVIDOR, sobre el resultado, y no como
 * condición SQL.
 *
 * Podría hacerse en la consulta, pero entonces habría dos definiciones de "se puede
 * publicar" —una en SQL y otra en `isPublishable()`— que se separarían en cuanto
 * cambiara una. RLS ya impide que un borrador salga de la base; esto garantiza que
 * la ventana de vigencia se evalúe siempre con la misma función que el resto del
 * código. Son decenas de filas: el coste es irrelevante frente a la ambigüedad.
 */
async function consultarOfertas(): Promise<Offer[]> {
  const { data, error } = await getSupabase()
    .from("ofertas")
    .select(SELECT)
    .order("orden", { ascending: true });

  if (error) {
    throw new Error(`No se pudieron leer las ofertas: ${error.message}`);
  }

  return (data as unknown as FilaOferta[]).map(filaAOferta);
}

/** Ofertas publicables: vigentes y dentro de su ventana de validez. */
export async function listActiveOffers(): Promise<Offer[]> {
  const ofertas = await consultarOfertas();
  return ofertas.filter((offer) => isPublishable(offer));
}

/** Secciones curadas de `estructura-funcional-cliente.md` §26. */
export type Coleccion = "mejores-ofertas" | "playas-y-hoteles" | "home";

/**
 * Ofertas de una colección, ya ordenadas.
 *
 * La colección es una BANDERA de la oferta, no una entidad con miembros: §26 exige
 * que "la oferta debe existir una sola vez", y así cambiar el precio actualiza todas
 * las secciones donde aparece porque sólo hay una fila que cambiar.
 */
export async function listOffersByCollection(
  coleccion: Coleccion,
): Promise<Offer[]> {
  const ofertas = await listActiveOffers();

  const bandera = {
    "mejores-ofertas": (offer: Offer) => offer.mostrarEnMejoresOfertas,
    "playas-y-hoteles": (offer: Offer) => offer.mostrarEnPlayasYHoteles,
    home: (offer: Offer) => offer.mostrarEnHome,
  }[coleccion];

  return ofertas.filter(bandera).sort((a, b) => a.orden - b.orden);
}

/**
 * Slugs que deben tener página, para `generateStaticParams`.
 *
 * Incluye las VENCIDAS a propósito: una tarifa vencida sigue teniendo página, con su
 * estado explícito y su CTA de recotización (spec-tecnica.md §8.4). Quien llega a una
 * oferta vencida sigue siendo un lead con intención alta; devolverle un 404 es
 * perderlo.
 *
 * Los borradores no aparecen porque RLS no los deja salir de la base.
 */
export async function listOfferSlugs(): Promise<string[]> {
  const { data, error } = await getSupabase().from("ofertas").select("slug");

  if (error) {
    throw new Error(`No se pudieron leer los slugs de ofertas: ${error.message}`);
  }

  return data.map((fila) => fila.slug);
}

/**
 * Busca por `offerId` en vez de por slug.
 *
 * Lo necesitan las campañas, que referencian la oferta por su identificador y no por
 * su URL: el slug puede cambiar al reescribir un título, el `offerId` no.
 */
export async function getOfferById(offerId: string): Promise<Offer | null> {
  const { data, error } = await getSupabase()
    .from("ofertas")
    .select(SELECT)
    .eq("offer_id", offerId)
    .maybeSingle();

  if (error) {
    throw new Error(`No se pudo leer la oferta ${offerId}: ${error.message}`);
  }

  return data ? filaAOferta(data as unknown as FilaOferta) : null;
}

export type OfferLookup =
  | { status: "found"; offer: Offer }
  | { status: "expired"; offer: Offer }
  | { status: "not-found" };

/**
 * Busca una oferta por slug.
 *
 * Devuelve `expired` en vez de `not-found` cuando la tarifa venció, porque la página
 * NO debe responder 404: tiene que renderizar el estado de tarifa vencida con CTA de
 * recotización (spec-tecnica.md §8.4).
 *
 * Un borrador se comporta como inexistente sin que haya que comprobarlo: RLS ya lo
 * excluye de la respuesta.
 */
export async function getOffer(slug: string): Promise<OfferLookup> {
  const { data, error } = await getSupabase()
    .from("ofertas")
    .select(SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`No se pudo leer la oferta ${slug}: ${error.message}`);
  }

  if (!data) return { status: "not-found" };

  const offer = filaAOferta(data as unknown as FilaOferta);
  return isExpired(offer)
    ? { status: "expired", offer }
    : { status: "found", offer };
}
