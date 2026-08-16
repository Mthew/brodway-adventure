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
    <Card className="group flex h-full flex-col">
      {/*
        `overflow-hidden` es lo que recorta el zoom al hover; sin él la foto
        ampliada se sale de la tarjeta.

        Con `expandir`, la imagen pasa de `aspect-[4/3]` (una relación fija)
        a `flex-1` (llena el espacio que le sobra a la columna después del
        bloque de texto) — pero SÓLO en `lg:`. Por debajo de ese breakpoint
        la tarjeta no vive dentro de una fila de grid con alto explícito
        (`page.tsx` sólo define `lg:grid-rows-[...]`), así que `flex-1` ahí
        no tendría contra qué crecer y la imagen colapsaría a 0 de alto. El
        `h-full` de `Card` es igual de inerte fuera de ese contexto: un
        `height: 100%` contra un padre de alto automático se resuelve como
        `auto`, así que no cambia nada en el carrusel móvil ni en la rejilla
        de 2 columnas de `md:`.
      */}
      <div
        className={cn(
          "zoom-foto reveal-curtain relative w-full overflow-hidden bg-neutral-100",
          expandir
            ? "aspect-[4/3] lg:aspect-auto lg:min-h-0 lg:flex-1"
            : "aspect-[4/3]",
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
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Badge variant="destino" className="self-start">
          {td(destino.tipo)}
        </Badge>
        <h3 className="text-h3 text-brand-navy">{destino.nombre}</h3>
        <p className="text-body-sm text-neutral-600">{destino.resumen}</p>
        {precioDesde ? (
          <p className="text-body-sm text-neutral-700">
            {t("desde")}{" "}
            <span className="text-brand-navy font-semibold">
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
 * Tarjeta de paquete.
 *
 * Recibe una `Offer` completa, no campos sueltos: así el precio nunca se muestra
 * sin su ciudad de origen y su ocupación base.
 */
export async function PackageCard({ offer }: { offer: Offer }) {
  const t = await getTranslations("precio");
  const format = await getFormatter();

  return (
    <Card className="group flex flex-col">
      <div className="zoom-foto reveal-curtain relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
        {offer.imagenes[0] ? (
          <Image
            src={offer.imagenes[0]}
            alt=""
            fill
            sizes="(max-width: 768px) 85vw, 45vw"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-h3 text-brand-navy">{offer.titulo}</h3>
        <p className="text-body-sm text-neutral-600">{offer.beneficioCorto}</p>
        <div className="mt-auto flex flex-col gap-1">
          <p className="text-body-sm text-neutral-700">
            {t("desde")}{" "}
            <span className="text-brand-navy font-semibold">
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
          href={`/paquetes/${offer.slug}`}
          /* `min-h-11` = 44px: mínimo táctil, que aplica también a enlaces de texto. */
          className="text-body text-brand-turquoise-text inline-flex min-h-11 items-center font-semibold underline-offset-4 group-hover:underline"
        >
          Ver el plan completo
        </Link>
      </div>
    </Card>
  );
}
