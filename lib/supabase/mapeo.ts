import type { Tables } from "@/lib/supabase/database.types";
import type { Destination } from "@/lib/types/destination";
import type {
  FechaSalida,
  ItinerarioDia,
  Offer,
  PreguntaFrecuente,
} from "@/lib/types/offer";

/**
 * Traducción entre las filas de Postgres y los tipos de dominio.
 *
 * Vive aquí y no en las páginas para que el resto del código no sepa que existe
 * `snake_case`, ni Supabase, ni una base de datos. Es la mitad de la costura que
 * permitió cambiar de mocks a Supabase sin tocar ninguna página; la otra mitad son
 * `lib/offers` y `lib/destinations`.
 */

/** Las imágenes llegan con su orden; la galería es ese campo, no el de inserción. */
type FilaImagen = { url: string; orden: number };

function urlsOrdenadas(imagenes: FilaImagen[] | null | undefined): string[] {
  return [...(imagenes ?? [])]
    .sort((a, b) => a.orden - b.orden)
    .map((imagen) => imagen.url);
}

export type FilaDestinoConImagenes = Tables<"destinos">;

export function filaADestino(fila: FilaDestinoConImagenes): Destination {
  return {
    slug: fila.slug,
    nombre: fila.nombre,
    tipo: fila.tipo,
    imagen: fila.imagen ?? "",
    imagenHero: fila.imagen_hero ?? "",
    resumen: fila.resumen ?? "",
    introduccion: fila.introduccion,
    mejorEpoca: fila.mejor_epoca ?? "",
    queHacer: (fila.que_hacer ?? []) as Destination["queHacer"],
    faq: (fila.faq ?? []) as PreguntaFrecuente[],
    destacadoEnHome: fila.destacado_en_home,
    orden: fila.orden,
    estado: fila.estado,
  };
}

/**
 * Fila de oferta con sus relaciones embebidas.
 *
 * El destino y las imágenes vienen en la MISMA consulta, no en una por oferta: un
 * listado de seis ofertas haría trece viajes a la base si se resolvieran aparte.
 */
export type FilaOferta = Omit<
  Tables<"ofertas">,
  "mayorista" | "notas_internas" | "creado_el"
> & {
  destinos: { slug: string; nombre: string } | null;
  imagenes: FilaImagen[] | null;
};

export function filaAOferta(fila: FilaOferta): Offer {
  return {
    offerId: fila.offer_id,
    slug: fila.slug,

    destino: fila.destinos?.nombre ?? "",
    destinoSlug: fila.destinos?.slug ?? "",
    ciudadOrigen: fila.ciudad_origen,
    noches: fila.noches,
    ocupacionBase: fila.ocupacion_base,

    hotel: fila.hotel ?? undefined,
    alimentacion: fila.alimentacion ?? undefined,
    fechaPeriodo: fila.fecha_periodo ?? undefined,

    precioDesde: fila.precio_desde,
    moneda: fila.moneda,

    titulo: fila.titulo,
    beneficioCorto: fila.beneficio_corto,
    imagenes: urlsOrdenadas(fila.imagenes),
    highlights: fila.highlights,
    incluye: fila.incluye,
    noIncluye: fila.no_incluye,

    itinerario: (fila.itinerario ?? []) as ItinerarioDia[],
    fechasSalida: (fila.fechas_salida ?? []) as FechaSalida[],

    politicaCancelacion: fila.politica_cancelacion ?? "",
    faq: (fila.faq ?? []) as PreguntaFrecuente[],

    informacionImportante: fila.informacion_importante,
    requisitos: fila.requisitos,
    documentacion: fila.documentacion,

    vigenciaDesde: fila.vigencia_desde,
    vigenciaHasta: fila.vigencia_hasta,
    validadaEl: fila.validada_el,
    actualizadoEl: fila.actualizado_el,
    estado: fila.estado,

    /*
     * `mayorista` no se mapea NUNCA aquí.
     *
     * La columna está revocada para el rol anónimo, así que no llega en la respuesta.
     * Sigue existiendo en el tipo `Offer` porque el backoffice la necesitará, pero el
     * sitio público no debe ni poder mostrarla.
     */

    mostrarEnMejoresOfertas: fila.mostrar_en_mejores_ofertas,
    mostrarEnPlayasYHoteles: fila.mostrar_en_playas_y_hoteles,
    mostrarEnHome: fila.mostrar_en_home,
    orden: fila.orden,
  };
}
