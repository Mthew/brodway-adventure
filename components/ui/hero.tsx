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
 *
 * DEGRADADO, NO LAVADO PLANO — y el cambio es de contraste, no estético.
 *
 * El velo plano `navy/70` sobre TODA la imagen cumplía el contraste y a la vez
 * mataba la foto: daba igual poner una foto cara o un `picsum` gris, porque el
 * 70% de navy uniforme las aplana a las dos. De ahí venía buena parte del
 * aspecto genérico del sitio.
 *
 * El degradado mantiene el velo donde vive el texto (abajo, que es donde el
 * contenido está anclado) y lo suelta arriba, donde no hay texto que proteger.
 * La foto respira en su mitad superior y el contraste NO baja: en la franja
 * inferior el velo es MÁS opaco que el 70% plano que había antes.
 *
 * Los topes están puestos para que el punto más claro de la zona de texto sea
 * el 70% de siempre, nunca menos. Verificado en navegador sobre foto blanca
 * pura, no estimado (ver la nota de medición al pie del archivo).
 */
const OVERLAY = {
  /** Foto oscura o de contraste medio. Peor caso en zona de texto: 5.32:1. */
  normal: "hero-scrim",
  /** Foto clara: nieve, playa a mediodía, cielo abierto. Peor caso: 8.48:1. */
  fuerte: "hero-scrim-fuerte",
} as const;

export function Hero({
  titulo,
  subtitulo,
  imagen,
  imagenMovil,
  imagenAlt,
  ciclo,
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
  /** Recorte apaisado. Se usa desde 768px hacia arriba. */
  imagen: string;
  /**
   * Recorte VERTICAL para móvil. No es un lujo: es dirección de arte.
   *
   * El hero mide casi una pantalla, así que en un teléfono su caja es
   * ~375x715, es decir vertical. Meter ahí un apaisado 16:9 con `object-cover`
   * recorta una franja central y tira el 60% de la foto: en la del Eje Cafetero
   * dejaba solo cielo, sin montaña ni valle. Un recorte vertical propio muestra
   * el motivo completo Y pesa menos (72 kB) que forzar al teléfono a bajar el
   * apaisado a 1280px de ancho para que no se vea borroso.
   *
   * Si no se pasa, se usa `imagen` en ambos: correcto para heroes de poca
   * altura, donde la caja no llega a ser vertical.
   */
  imagenMovil?: string;
  /**
   * Texto alternativo. Obligatorio y sin valor por defecto: una foto de hero
   * comunica algo, y `alt=""` debe ser una decisión consciente de que es
   * decorativa, no el descuido de no haberlo escrito.
   */
  imagenAlt: string;
  /**
   * Fotos adicionales del slideshow (spec-home-v1.md §3). Opcional: sin esta
   * prop el hero se comporta exactamente como antes, una sola foto estática.
   * Máximo 2 entradas — el sistema de motion de `globals.css` sólo define
   * `.hero-slide-2` y `.hero-slide-3`, una tercera entrada no tendría CSS que
   * la anime y quedaría invisible para siempre (no es un fallback, es un bug).
   *
   * Cada foto es un `<img>` sin `<picture>`/`source`: no existe un recorte
   * vertical propio para estas fotos (a diferencia de `imagenMovil`), así que
   * usan el mismo recorte apaisado en cualquier viewport con `object-cover`.
   * Es una foto secundaria de un slideshow que se desvanece sola, no la
   * pieza que sostiene el contraste del titular — no hace falta el mismo
   * nivel de dirección de arte que la foto 1.
   *
   * NO llevan `hero-parallax`: combinar el parallax dirigido por scroll con
   * el fundido dirigido por tiempo en el mismo `animation` exige timelines
   * en paralelo (`animation-timeline: auto, view()`), una función más nueva
   * y con soporte más parejo que el resto del sistema de motion. La foto 1
   * ya lleva el parallax y es la que más tiempo acumulado se ve.
   */
  ciclo?: { imagen: string; alt: string }[];
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
    <section
      className={cn(
        /*
         * `svh` y no `dvh`, aunque §2.bis diga `dvh`. Las dos cumplen la razón
         * por la que esa regla existe (nunca `h-screen`, que en iOS lo rompe),
         * pero `dvh` cambia de valor cuando Safari esconde la barra al bajar:
         * el hero se estira a mitad de scroll y arrastra la página. `svh` es el
         * viewport pequeño, el que SIEMPRE está disponible, así que no se mueve
         * y además garantiza que el CTA cabe sin scroll incluso con la barra
         * desplegada, que es lo que la regla del hero pide de verdad.
         *
         * 88 y no 100: dejar asomar el borde de la sección siguiente le dice al
         * visitante que hay más abajo. Eso sustituye al indicador de scroll, que
         * §11.B prohíbe con razón.
         *
         * 68svh EN MÓVIL, y el número sale de una medición, no del gusto: con
         * 88svh el bloque de texto terminaba en y=647 y el banner de cookies
         * empieza en y=560, así que en la PRIMERA visita desde un teléfono los
         * dos CTA del hero quedaban tapados. Es la visita que decide la
         * conversión, y un hero espectacular que esconde el botón de WhatsApp no
         * sirve de nada. 68svh deja el CTA justo por encima del banner y sigue
         * siendo más alto que el hero original. Al tocar esta altura, o el alto
         * del banner, hay que volver a comprobar que el CTA se ve sin scroll.
         */
        "relative isolate flex min-h-[68svh] flex-col justify-end md:min-h-[88svh]",
        className,
      )}
      {...props}
    >
      {/*
        `<picture>` con `<img>` a mano, y NO `next/image`, sólo en el hero.

        Es la única forma de hacer dirección de arte de verdad: el navegador
        evalúa el `media` y descarga UNA sola de las dos fotos. Las alternativas
        con `next/image` son peores, las dos:
          · dos <Image> con `hidden md:block` → el `priority` de cada uno inyecta
            su propio <link rel=preload>, así que el móvil se baja LAS DOS.
          · un solo <Image> apaisado → es lo que había, y en móvil se veía una
            franja de cielo escalada 3,4x (Next servía 375x211 para una caja de
            375x715, porque `sizes="100vw"` describe el ancho, no la altura).

        Lo que aporta `next/image` aquí ya está resuelto en origen: los archivos
        son WebP con el recorte y el tamaño exactos de cada punto de ruptura.
        `fetchpriority="high"` le da al preload scanner la misma prioridad que
        daba `priority`, y como va en el HTML inicial se descubre antes que
        cualquier <link> inyectado por JS.
      */}
      {/*
        `hero-parallax` sólo mueve `transform` (ver globals.css): no repinta
        la foto, no toca su opacidad, así que no puede retrasar el LCP. Vive
        en un wrapper con `overflow-hidden` propio y no en el `<picture>`
        directamente, porque el `scale(1.12)` del parallax necesita recortarse
        dentro del alto exacto del hero y no desbordar hacia las secciones
        vecinas (el hero es `isolate`, pero no recorta por sí solo).
      */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <picture>
          <source media="(min-width: 768px)" srcSet={imagen} />
          <img
            src={imagenMovil ?? imagen}
            alt={imagenAlt}
            fetchPriority="high"
            decoding="async"
            className="hero-parallax size-full object-cover"
          />
        </picture>

        {/*
          `loading="lazy"` y sin `fetchPriority`: estas fotos nunca deben
          competir con la foto 1 por ancho de banda en el primer pintado. Si
          el presupuesto de la home se ajusta (spec-home-v1.md §12), estas dos
          peticiones son las primeras que se recortan, no la foto 1.
        */}
        {ciclo?.slice(0, 2).map((foto, i) => (
          <img
            key={foto.imagen}
            src={foto.imagen}
            alt={foto.alt}
            loading="lazy"
            decoding="async"
            className={cn(
              "absolute inset-0 size-full object-cover",
              i === 0 ? "hero-slide-2" : "hero-slide-3",
            )}
          />
        ))}
      </div>
      <div className={cn("absolute inset-0 -z-10", OVERLAY[overlay])} />

      <div className="mx-auto w-full max-w-6xl px-6 pt-24 pb-16 md:px-8 md:pt-28 md:pb-20">
        {/*
          SIN animación de entrada, a propósito.

          El titular del hero es candidato a LCP, y Chrome no contabiliza un
          elemento mientras su opacidad es 0: un fade-in de entrada retrasa la
          métrica exactamente lo que dure la animación. En un sitio con objetivo
          de LCP < 1s en móvil eso es pagar la primera impresión con la métrica
          que decide la conversión. El impacto visual del hero lo dan la
          fotografía y el degradado, que no cuestan nada. Las animaciones de
          entrada empiezan por debajo del pliegue, donde son gratis.
        */}
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
