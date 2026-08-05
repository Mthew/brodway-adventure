import type { PreguntaFrecuente } from "@/lib/types/offer";

/**
 * Un destino es contenido EDITORIAL, no una tarifa.
 *
 * Esa frontera es la decisión de Fase 0 que sigue abierta (`spec-tecnica.md` §7.4):
 * el destino describe un lugar y no caduca; la tarifa vive en `Offer`, tiene
 * vigencia y trazabilidad. No se modelan las dos cosas juntas ni se duplica el
 * precio aquí — el "desde" de un destino se calcula de sus ofertas vigentes.
 *
 * En Fase 1 este contenido vive en el repositorio. `fases-entrega.md` coloca la
 * migración a un CMS en Fase 2, y por eso todo el acceso pasa por
 * `lib/destinations/`: cuando llegue el CMS cambia esa capa y ninguna página.
 */
export type Destination = {
  slug: string;
  nombre: string;
  tipo: "nacional" | "internacional";

  /** Imagen de tarjeta (4:3). */
  imagen: string;
  /** Imagen de cabecera de la página de destino (panorámica). */
  imagenHero: string;

  /** Una línea para la tarjeta y para la metadescripción. */
  resumen: string;

  /**
   * Introducción editorial: qué es, por qué ir, para quién es.
   *
   * Son 2-3 párrafos y no un adorno: esta página se posiciona por búsquedas de
   * alta intención ("viaje a Eje Cafetero 4 días"). Una página con sólo tarjetas
   * no cumple su función (brief-v0.md §8).
   */
  introduccion: string[];

  /** Bloque informativo útil, no comercial. */
  mejorEpoca: string;

  /** 4-6 experiencias destacadas. */
  queHacer: { titulo: string; descripcion: string }[];

  faq: PreguntaFrecuente[];
};
