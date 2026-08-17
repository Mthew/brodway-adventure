import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { WhatsAppIcon } from "@/components/layout/whatsapp-floating";
import { ButtonLink } from "@/components/ui/button";
import { DestinationCard } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { buildWhatsAppUrl } from "@/lib/config";
import {
  getDestinationFromPrice,
  listDestinationsByCategory,
} from "@/lib/destinations";
import { CLAVE_CATEGORIA } from "@/lib/destinations/categorias";
import type { DestinationCategory } from "@/lib/types/destination";

/**
 * Listado de una de las tres categorías principales de destino
 * (`estructura-funcional-cliente.md` §10, §12, §14).
 *
 * Vive en un componente y no en la página porque las tres categorías tienen la misma
 * estructura y sólo cambian el título, la introducción y el filtro. Las páginas de
 * `/destinos/internacionales`, `/destinos/nacionales` y
 * `/destinos/pueblos-de-antioquia` son tres archivos de cinco líneas que delegan aquí.
 *
 * Por qué tres rutas ESTÁTICAS y no una `[categoria]` dinámica: `/destinos/[slug]` ya
 * ocupa ese nivel, y Next.js no admite dos segmentos dinámicos hermanos. Los
 * segmentos estáticos, además, tienen precedencia sobre `[slug]` — que es justo lo
 * que hace falta, y la razón por la que esos tres nombres están reservados en
 * `lib/destinations/categorias.ts`.
 */

type Claves = {
  titulo: "tituloNacional";
  intro: "introNacional";
};

function claves(tipo: DestinationCategory): Claves {
  const sufijo = CLAVE_CATEGORIA[tipo];
  return {
    titulo: `titulo${sufijo}` as Claves["titulo"],
    intro: `intro${sufijo}` as Claves["intro"],
  };
}

export async function metadataDeCategoria(
  locale: string,
  tipo: DestinationCategory,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "categorias" });
  const k = claves(tipo);
  return { title: t(k.titulo), description: t(k.intro) };
}

export async function ListadoCategoria({
  locale,
  tipo,
}: {
  locale: string;
  tipo: DestinationCategory;
}) {
  setRequestLocale(locale);

  const t = await getTranslations("categorias");
  const tc = await getTranslations("cta");
  const k = claves(tipo);

  const destinos = await listDestinationsByCategory(tipo);

  const tarjetas = await Promise.all(
    destinos.map(async (destino) => {
      const precio = await getDestinationFromPrice(destino.slug);
      return (
        <DestinationCard
          destino={destino}
          precioDesde={precio?.precioDesde}
          moneda={precio?.moneda}
        />
      );
    }),
  );

  const titulo = t(k.titulo);
  const intro = t(k.intro);

  return (
    <>
      <Section spacing="compact">
        <div className="flex max-w-[55ch] flex-col gap-4">
          <h1 className="text-h1 text-brand-navy">{titulo}</h1>
          <p className="text-body-lg text-neutral-700">{intro}</p>
        </div>
      </Section>

      <Section spacing="compact">
        {tarjetas.length === 0 ? (
          /*
           * Estado vacío real, no una rejilla en blanco.
           *
           * Es el caso NORMAL en Pueblos de Antioquia: §13 dice que esa categoría no
           * lleva lista fija y sus destinos aparecen y desaparecen con la oferta del
           * proveedor. Una categoría sin destinos no es un error.
           */
          <p className="text-body-lg max-w-[55ch] text-neutral-600">{t("vacio")}</p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {destinos.map((destino, i) => (
              <li key={destino.slug}>{tarjetas[i]}</li>
            ))}
          </ul>
        )}
      </Section>

      <Section background="navy">
        <div className="flex flex-col items-start gap-5">
          <h2 className="text-h2 max-w-[20ch]">{titulo}</h2>
          <ButtonLink
            href={buildWhatsAppUrl({ message: intro })}
            variant="whatsapp"
            size="lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon className="size-5" />
            {tc("hablaConAsesor")}
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
