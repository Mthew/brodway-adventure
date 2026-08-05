import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Sección Hero — home y landings de campaña.
 *
 * Es el último componente base que pedía `spec-tecnica.md` §4.1 para cerrar la
 * Fase 0, y el que más pesa en el negocio: es el LCP de la página y el 83% del
 * tráfico lo ve en un móvil.
 *
 * Dos decisiones que NO son estéticas:
 *
 * 1. `priority` y `sizes` van fijos aquí, no como props. El hero SIEMPRE es el
 *    LCP; dejarlo a criterio de quien arma la página es cómo se pierde el
 *    objetivo de LCP < 1s en una landing y nadie se entera hasta que cae la
 *    conversión.
 * 2. El overlay es un token, no un valor por página. El contraste del titular
 *    sobre la foto depende de él, y una foto clara con un overlay flojo rompe el
 *    4.5:1 sin que salte ningún error. Ver la nota de `overlay` más abajo.
 */

/**
 * Los dos niveles están medidos contra el PEOR caso posible: una foto blanca
 * pura debajo. Así el hero es seguro con cualquier imagen, sin tener que
 * re-verificar el contraste cada vez que marketing cambia la foto.
 *
 * El primer valor que se probó aquí fue navy/60, que parece suficiente y no lo
 * es: rinde 3.94:1 sobre foto blanca. Alcanza para el titular (texto grande,
 * umbral 3:1) pero deja el microcopy por debajo de 4.5:1.
 */
const OVERLAY = {
  /** Foto oscura o de contraste medio. Peor caso: 5.32:1 el texto, 4.68:1 el microcopy. */
  normal: "bg-brand-navy/70",
  /** Foto clara: nieve, playa a mediodía, cielo abierto. Peor caso: 8.48:1 / 7.21:1. */
  fuerte: "bg-brand-navy/85",
} as const;

export function Hero({
  titulo,
  subtitulo,
  imagen,
  imagenAlt,
  overlay = "normal",
  acciones,
  microcopy,
  className,
  ...props
}: Omit<React.ComponentProps<"section">, "title"> & {
  /** Menos de 12 palabras (brief-v0.md §5). Va como <h1>. */
  titulo: React.ReactNode;
  /** Una línea. Qué hace la agencia, sin promesas genéricas. */
  subtitulo?: React.ReactNode;
  imagen: string;
  /**
   * Texto alternativo. Obligatorio y sin valor por defecto: una foto de hero
   * comunica algo, y `alt=""` debe ser una decisión consciente de que es
   * decorativa, no el descuido de no haberlo escrito.
   */
  imagenAlt: string;
  overlay?: keyof typeof OVERLAY;
  /** CTA primario + a lo sumo un secundario. */
  acciones?: React.ReactNode;
  /** "Respuesta en minutos, sin compromiso", debajo de los botones. */
  microcopy?: React.ReactNode;

  /**
   * NO existe una prop para los sellos de confianza, y es deliberado.
   *
   * El Pre-Flight (brief-v0.md §11.B) exige que RNT/ANATO/IATA y cualquier prueba
   * social vivan en una sección DEBAJO del hero, nunca dentro, y que el hero tenga
   * como máximo 4 elementos de texto. Una prop `pruebaSocial` invitaba justo a lo
   * contrario: existía y la usaba la guía de diseño. Se quitó para que la casilla
   * no dependa de que alguien recuerde la regla.
   */
}) {
  return (
    <section className={cn("relative isolate", className)} {...props}>
      <Image
        src={imagen}
        alt={imagenAlt}
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div className={cn("absolute inset-0 -z-10", OVERLAY[overlay])} />

      <div className="mx-auto w-full max-w-6xl px-6 py-20 md:px-8 md:py-28">
        <div className="flex max-w-2xl flex-col gap-5">
          <h1 className="text-display text-white">{titulo}</h1>

          {subtitulo ? (
            <p className="text-body-lg text-white">{subtitulo}</p>
          ) : null}

          {acciones ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {acciones}
            </div>
          ) : null}

          {/*
            white/90, no white/80: el microcopy es texto pequeño y necesita
            4.5:1. Con /80 sobre el overlay `normal` y una foto clara se queda en
            4.07:1 — el tipo de fallo que no se ve hasta que alguien cambia la
            foto por una de playa.
          */}
          {microcopy ? (
            <p className="text-body-sm text-white/90">{microcopy}</p>
          ) : null}
        </div>

      </div>
    </section>
  );
}
