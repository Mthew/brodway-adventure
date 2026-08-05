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
}: {
  destino: Destination;
  precioDesde?: number;
  moneda?: "COP" | "USD";
}) {
  const t = await getTranslations("precio");
  const td = await getTranslations("destinos");
  const format = await getFormatter();

  return (
    <Card className="group flex flex-col">
      <div className="relative aspect-[4/3] w-full bg-neutral-100">
        <Image
          src={destino.imagen}
          alt=""
          fill
          sizes="(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 30vw"
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
      <div className="relative aspect-[16/10] w-full bg-neutral-100">
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
