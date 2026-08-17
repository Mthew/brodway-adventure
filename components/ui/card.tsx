import Image from "next/image";
import { getFormatter, getTranslations } from "next-intl/server";

import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Destination } from "@/lib/types/destination";
import type { Offer } from "@/lib/types/offer";

import { Badge } from "./badge";

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-surface-base overflow-hidden rounded-lg border border-neutral-200 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Tarjeta de destino.
 *
 * Recibe un `Destination` completo y no campos sueltos, igual que `PackageCard`
 * recibe una `Offer`: así el contenido editorial y su precio no se pueden separar
 * por accidente al componer una página.
 *
 * `precioDesde` es opcional porque lo calcula `lib/destinations` de las ofertas
 * VIGENTES del destino. Si no hay ninguna, la tarjeta se muestra sin precio: un
 * precio desactualizado es peor que ningún precio.
 */
export async function DestinationCard({
  destino,
  precioDesde,
  moneda = "COP",
  destacado = false,
  imagenExpandida = false,
}: {
  destino: Destination;
  precioDesde?: number;
  moneda?: "COP" | "USD";
  /**
   * La tarjeta 2x2 de la rejilla asimétrica de escritorio (spec-home-v1.md
   * §5.1, ≥1024px). Implica `imagenExpandida` y además ensancha el `sizes`
   * de la imagen: esta tarjeta ocupa ~62vw en ese layout, no el 30vw de una
   * tarjeta normal, y sin ajustar `sizes` Next pediría una resolución de
   * menos de la mitad de lo que realmente se pinta.
   */
  destacado?: boolean;
  /**
   * Tarjeta lateral de la misma rejilla: la imagen llena su celda del grid
   * en vez de recortarse a `aspect-[4/3]`, pero conserva el `sizes` normal
   * porque su ancho renderizado no cambia (sigue siendo ~30vw).
   */
  imagenExpandida?: boolean;
}) {
  const t = await getTranslations("precio");
  const td = await getTranslations("destinos");
  const format = await getFormatter();

  const expandir = destacado || imagenExpandida;

  return (
    /*
      SIN borde y con sombra que sube al hover, en vez del marco de 1px que
      tenía antes. El borde dibujaba una caja alrededor de la foto y hacía que
      la tarjeta se leyera como una ficha de documento; sin él, la fotografía
      llega hasta el filo y manda ella. La sombra es lo que sigue separando la
      tarjeta del fondo blanco de la sección.

      La transición cuelga de `motion-safe:` porque `prefers-reduced-motion`
      también aplica a un cambio de sombra, aunque no desplace nada.
    */
    <Card className="group flex h-full flex-col border-0 shadow-md motion-safe:transition-shadow motion-safe:duration-300 hover:shadow-xl">
      {/*
        `overflow-hidden` es lo que recorta el zoom al hover; sin él la foto
        ampliada se sale de la tarjeta.

        RELACIÓN 4:5 (vertical) y no 4:3. Es el cambio que más peso visual le
        da a la tarjeta: con 4:3 la foto quedaba en una franja de ~150px de
        alto contra un bloque de texto de ~130px, así que la mitad de la
        tarjeta era espacio blanco y el resultado se parecía más a una ficha
        que a una tarjeta de viajes. En vertical la foto pasa a mandar, que es
        lo que hacen los referentes del sector.

        Las fotos de origen son 4:3 (1000x750): `object-cover` recorta a los
        lados, no estira. Verificado destino por destino que el motivo sigue
        entrando en el recorte vertical.

        Con `expandir`, la imagen pasa de la relación fija a `flex-1` (llena
        el espacio que le sobra a la columna después del bloque de texto) —
        pero SÓLO en `lg:`. Por debajo de ese breakpoint la tarjeta no vive
        dentro de una fila de grid con alto explícito (`page.tsx` sólo define
        `lg:grid-rows-[...]`), así que `flex-1` ahí no tendría contra qué
        crecer y la imagen colapsaría a 0 de alto. El `h-full` de `Card` es
        igual de inerte fuera de ese contexto: un `height: 100%` contra un
        padre de alto automático se resuelve como `auto`, así que no cambia
        nada en el carrusel móvil ni en la rejilla de 2 columnas de `md:`.
      */}
      <div
        className={cn(
          "zoom-foto reveal-curtain relative w-full overflow-hidden bg-neutral-100",
          expandir
            ? "aspect-[4/5] lg:aspect-auto lg:min-h-0 lg:flex-1"
            : "aspect-[4/5]",
        )}
      >
        {/*
          Aquí iría el morph de tarjeta a cabecera de destino con
          `<ViewTransition name={...} share="morph">`, que es la transición de
          ruta que este sitio pide y que costaría 0 kb.

          NO se puede hoy: `ViewTransition` no existe en React 19.2.8 estable
          (`node -e "require('react').ViewTransition"` da undefined), y la guía
          `node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`
          asume que el App Router resuelve una canary de React, cosa que esta
          combinación 16.3.0 + 19.2.8 no hace. Probado: da "Element type is
          invalid" en el servidor. Habilitarlo obliga a mover el proyecto al
          canal experimental de React, y eso no se hace en un sitio de captación
          por una animación. Revisar cuando ViewTransition llegue a estable.
        */}
        <Image
          src={destino.imagen}
          alt=""
          fill
          sizes={
            destacado
              ? "(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 62vw"
              : "(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 30vw"
          }
          className="object-cover"
        />
      </div>
      {/*
        `flex-1` en el texto sirve para que, en una fila de tarjetas de alto
        automático, todas se estiren igual y el enlace quede alineado abajo
        (junto al `mt-auto` del `Link`).

        Pero cuando la imagen es `lg:flex-1` las dos cajas compiten por el
        espacio sobrante y se lo reparten: medido, la destacada quedaba con
        406px de foto contra 446px de texto, es decir más texto que
        fotografía, que es exactamente lo contrario de lo que busca esta
        tarjeta. En ese caso el texto pasa a `lg:flex-none` (alto natural) y
        todo lo que sobra va a la foto.
      */}
      <div
        className={cn(
          "flex flex-1 flex-col gap-2.5 p-5",
          expandir && "lg:flex-none",
        )}
      >
        <Badge variant="destino" className="self-start">
          {td(destino.tipo)}
        </Badge>
        <h3 className="text-h3 text-brand-navy">{destino.nombre}</h3>
        {/*
          `line-clamp-2`: los resúmenes del mock van de 2 a 3 líneas, y en una
          fila de tres tarjetas esa línea de más desalineaba el precio y el
          enlace de una tarjeta respecto a sus vecinas. Recortar a 2 los deja
          a la misma altura sin tener que igualar el copy a mano cada vez que
          alguien edite un destino. El texto completo vive en la ficha.
        */}
        <p className="text-body-sm line-clamp-2 text-neutral-600">
          {destino.resumen}
        </p>
        {/*
          El precio es el dato que decide, así que sube de tamaño mientras el
          "desde" y el "por persona" se quedan pequeños. No es letra chica
          engañosa al revés: los dos matices siguen visibles y legibles, que es
          lo que exige el bloque de disclosure (brief-v0.md §6).
        */}
        {precioDesde ? (
          <p className="text-caption text-neutral-700">
            {t("desde")}{" "}
            <span className="text-body text-brand-navy font-semibold">
              {format.number(precioDesde, {
                style: "currency",
                currency: moneda,
                maximumFractionDigits: 0,
              })}
            </span>{" "}
            {t("porPersona")}
          </p>
        ) : null}
        <Link
          href={`/destinos/${destino.slug}`}
          /* `min-h-11` = 44px: mínimo táctil, que aplica también a enlaces de texto. */
          className="text-body text-brand-turquoise-text mt-auto inline-flex min-h-11 items-center font-semibold underline-offset-4 group-hover:underline"
        >
          {td("verOpciones")}
        </Link>
      </div>
    </Card>
  );
}

/**
 * Tarjeta de oferta.
 *
 * Recibe una `Offer` completa, no campos sueltos: así el precio nunca se muestra
 * sin su ciudad de origen y su ocupación base.
 */
export async function PackageCard({
  offer,
  destacado = false,
}: {
  offer: Offer;
  /**
   * La tarjeta ocupa dos columnas.
   *
   * Cambia la proporción de la foto a 21:9, y no es cosmética. Medido en navegador
   * a 1280px, con la tarjeta a 1088px de ancho:
   *
   *     4:3  -> foto 816px, tarjeta 1096px  (ocupa más de una pantalla entera)
   *     16:9 -> foto 612px, tarjeta  892px
   *     21:9 -> foto 466px, tarjeta  746px  (a la altura de las tarjetas vecinas)
   *
   * Una relación pensada para una tarjeta de ~530px no sirve al doble de ancho: el
   * alto crece con el ancho y empuja el resto de la sección fuera del pliegue.
   */
  destacado?: boolean;
}) {
  const t = await getTranslations("precio");
  const to = await getTranslations("ofertas");
  const format = await getFormatter();

  return (
    /*
      Mismo tratamiento que `DestinationCard` (sin borde, sombra que sube al
      hover): las dos conviven en `/destinos/[slug]` y en `/ofertas`, y dos
      estilos de tarjeta distintos en la misma página se leen como un error.

      La relación se queda en 4:3 y no pasa a 4:5 como la de destino: la de
      oferta es más ancha en su rejilla (dos columnas, no tres) y en vertical
      quedaría desproporcionada.
    */
    <Card className="group flex h-full flex-col border-0 shadow-md motion-safe:transition-shadow motion-safe:duration-300 hover:shadow-xl">
      <div
        className={cn(
          "zoom-foto reveal-curtain relative w-full overflow-hidden bg-neutral-100",
          destacado ? "aspect-[21/9]" : "aspect-[4/3]",
        )}
      >
        {offer.imagenes[0] ? (
          <Image
            src={offer.imagenes[0]}
            alt=""
            fill
            sizes={destacado ? "(max-width: 768px) 85vw, 90vw" : "(max-width: 768px) 85vw, 45vw"}
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        {/* El DESTINO va encima del título y no dentro: §5 y §16 lo listan como
            campo propio de la tarjeta, y es lo primero que se compara al recorrer
            una rejilla de ofertas de varios lugares. */}
        <p className="text-caption text-brand-turquoise-text font-semibold">
          {offer.destino}
        </p>
        <h3 className="text-h3 text-brand-navy">{offer.titulo}</h3>
        <p className="text-body-sm line-clamp-2 text-neutral-600">
          {offer.beneficioCorto}
        </p>

        {/*
          Ficha corta de §5: fecha o periodo · duración · hotel · alimentación.
          Cada dato sólo aparece si la oferta lo trae ("cuando corresponda" en §16):
          un tour sin hotel no debe mostrar un hueco ni un guion suelto.
        */}
        <ul className="text-caption flex flex-wrap items-center gap-x-2 gap-y-1 text-neutral-600">
          {offer.fechaPeriodo ? <li>{offer.fechaPeriodo}</li> : null}
          <li className="before:mr-2 before:text-neutral-300 not-first:before:content-['·']">
            {t("noches", { noches: offer.noches })}
          </li>
          {offer.hotel ? (
            <li className="before:mr-2 before:text-neutral-300 not-first:before:content-['·']">
              {offer.hotel}
            </li>
          ) : null}
          {offer.alimentacion ? (
            <li className="before:mr-2 before:text-neutral-300 not-first:before:content-['·']">
              {offer.alimentacion}
            </li>
          ) : null}
        </ul>

        <div className="mt-auto flex flex-col gap-1 pt-1">
          <p className="text-caption text-neutral-700">
            {t("desde")}{" "}
            <span className="text-body text-brand-navy font-semibold">
              {format.number(offer.precioDesde, {
                style: "currency",
                currency: offer.moneda,
                maximumFractionDigits: 0,
              })}
            </span>{" "}
            {t("porPersona")}
          </p>
          <p className="text-caption text-neutral-600">
            {t("saliendoDesde", { ciudad: offer.ciudadOrigen })} ·{" "}
            {t("ocupacion", { ocupacion: offer.ocupacionBase })}
          </p>
        </div>
        <Link
          href={`/ofertas/${offer.slug}`}
          /* `min-h-11` = 44px: mínimo táctil, que aplica también a enlaces de texto. */
          className="text-body text-brand-turquoise-text inline-flex min-h-11 items-center font-semibold underline-offset-4 group-hover:underline"
        >
          {to("verPlan")}
        </Link>
      </div>
    </Card>
  );
}

/**
 * Tarjeta de hotel, para "Mejores Playas y Hoteles".
 *
 * Es otra tarjeta y no una variante de `PackageCard` porque habla a otro visitante:
 * §7 la dirige a quien busca mejor experiencia y para quien **el precio no es el
 * criterio principal**. Eso cambia la jerarquía, no sólo el estilo — aquí manda la
 * fotografía y el nombre del hotel, y el precio baja al final como dato de cierre.
 *
 * Diferencias deliberadas frente a `PackageCard`:
 *   - Relación 3:4 (vertical) en vez de 4:3. §8 pide privilegiar la fotografía, y en
 *     vertical la foto ocupa cerca del doble de altura con el mismo ancho de rejilla.
 *   - El nombre del HOTEL es el titular; el destino queda debajo, en menor jerarquía.
 *   - La alimentación se muestra como etiqueta ("Todo incluido"), que en esta sección
 *     es un diferenciador de producto y no una nota al pie.
 */
export async function HotelCard({ offer }: { offer: Offer }) {
  const t = await getTranslations("precio");
  const to = await getTranslations("ofertas");
  const format = await getFormatter();

  return (
    <Card className="group flex h-full flex-col border-0 shadow-md motion-safe:transition-shadow motion-safe:duration-300 hover:shadow-xl">
      <div className="zoom-foto reveal-curtain relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
        {offer.imagenes[0] ? (
          <Image
            src={offer.imagenes[0]}
            alt=""
            fill
            sizes="(max-width: 768px) 85vw, 30vw"
            className="object-cover"
          />
        ) : null}

        {/* La alimentación va SOBRE la foto y no debajo del título: en esta sección
            es lo primero que se compara entre dos hoteles del mismo destino. */}
        {offer.alimentacion ? (
          <span className="text-caption absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 font-semibold text-neutral-800">
            {offer.alimentacion}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        {/* El hotel es el titular. Si la oferta no lo trae, cae al título del plan
            en vez de dejar un hueco: la tarjeta debe seguir siendo legible. */}
        <h3 className="text-h3 text-brand-navy">{offer.hotel ?? offer.titulo}</h3>
        <p className="text-body-sm text-neutral-600">{offer.destino}</p>
        <p className="text-body-sm line-clamp-2 text-neutral-700">
          {offer.beneficioCorto}
        </p>

        <div className="mt-auto flex flex-col gap-1 pt-2">
          <p className="text-caption text-neutral-700">
            {t("desde")}{" "}
            <span className="text-body text-brand-navy font-semibold">
              {format.number(offer.precioDesde, {
                style: "currency",
                currency: offer.moneda,
                maximumFractionDigits: 0,
              })}
            </span>{" "}
            {t("porPersona")}
          </p>
          <p className="text-caption text-neutral-600">
            {t("saliendoDesde", { ciudad: offer.ciudadOrigen })} ·{" "}
            {t("ocupacion", { ocupacion: offer.ocupacionBase })}
          </p>
        </div>

        <Link
          href={`/ofertas/${offer.slug}`}
          className="text-body text-brand-turquoise-text inline-flex min-h-11 items-center font-semibold underline-offset-4 group-hover:underline"
        >
          {to("verOferta")}
        </Link>
      </div>
    </Card>
  );
}
