import type { PreguntaFrecuente } from "@/lib/types/offer";

/**
 * Una campaña es CONTENIDO, no código.
 *
 * El principio rector de una landing de pauta es el MESSAGE MATCH: tiene que
 * leerse como la continuación exacta del anuncio que trajo a la persona. Si no
 * coincide, se pierde entre el 40% y el 60% de los visitantes (brief-v0.md §7).
 *
 * Por eso todo el contenido viaja aquí y ninguna landing tiene texto propio:
 * lanzar una campaña nueva es añadir un registro, nunca tocar un componente. Si
 * para una campaña hace falta editar código, el modelo está mal.
 */
export type Campaign = {
  /** Slug de la URL: `/lp/{slug}`. */
  slug: string;

  /**
   * Código que viaja en el mensaje de WhatsApp y en el lead.
   *
   * Es lo que permite saber de qué anuncio salió la conversación cuando el
   * asesor la recibe, sin depender de que los UTMs sobrevivan al salto a
   * WhatsApp, que no sobreviven.
   */
  codigo: string;

  /** Oferta que promociona, si la hay. Viaja al CRM con el lead. */
  offerId?: string;
  destino?: string;

  /** MISMO titular que el anuncio. No lo "mejores" aquí: rompe el message match. */
  titular: string;
  subtitular: string;

  /** MISMA imagen del anuncio. */
  imagen: string;
  imagenAlt: string;

  /**
   * Vídeo vertical del anuncio, si existe.
   *
   * Se reproduce con `<video>` nativo: sin autoplay con sonido, con `poster` y
   * `playsInline`. Nada de librerías de reproductor.
   */
  video?: { src: string; poster: string };

  /** Línea de confianza bajo el hero. */
  pruebaSocial: string;

  /** 4-6 puntos escaneables. */
  incluye: string[];

  /** Resumen, NO el día a día completo: esto es una landing, no la ficha. */
  itinerarioResumen: { titulo: string; texto: string }[];

  /** 4 preguntas que resuelvan la objeción principal. */
  faq: PreguntaFrecuente[];

  /** Texto del CTA, repetido a lo largo del scroll. Uno solo por campaña. */
  cta: string;
};
