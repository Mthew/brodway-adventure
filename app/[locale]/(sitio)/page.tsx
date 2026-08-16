import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ChatCircleText,
  ChatText,
  Clock,
  Compass,
  HourglassSimple,
  ListChecks,
  MapPin,
  SealCheck,
  ShieldCheck,
  Tag,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, DestinationCard } from "@/components/ui/card";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { LeadForm } from "@/components/forms/lead-form";
import { WhatsAppIcon } from "@/components/layout/whatsapp-floating";
import { buildWhatsAppUrl, CONTACT, RNT_NUMBER, SITE_URL } from "@/lib/config";
import { Link } from "@/lib/i18n/navigation";
import { getDestinationFromPrice, listDestinations } from "@/lib/destinations";
import { cn } from "@/lib/utils";

/**
 * Home.
 *
 * Objetivo doble y en este orden: dar credibilidad institucional y llevar a
 * WhatsApp (brief-v0-producto.md §9.1).
 *
 * REGLAS CONTABLES DEL PRE-FLIGHT §11.B que esta página cumple a propósito, y que
 * hay que recontar si se añade o quita una sección:
 *
 *   - NUEVE secciones y NUEVE estructuras distintas. El mínimo exigido son 4. En
 *     concreto: hero a sangre · franja compacta · rejilla de tarjetas con
 *     scroll-snap · flujo de 3 pasos con conector · rejilla de 4 con ícono ·
 *     franja de color a ancho completo · destacado asimétrico 1+2 · dos columnas
 *     texto/lista · cierre en navy con formulario.
 *   - CERO eyebrows. El techo sería 3 (techo de 9/3), pero la regla dice que en la
 *     mayoría de los casos el titular solo basta.
 *   - Ninguna fila de 3 tarjetas idénticas. Los 3 pasos son un flujo conectado, no
 *     tarjetas; los testimonios son 1 destacado + 2, no 3 iguales.
 *   - Nunca 3 secciones seguidas con el patrón imagen-a-un-lado / texto-al-otro.
 *   - "Next Stop" aparece EXACTAMENTE una vez, en la franja turquesa.
 *   - Los sellos de confianza van en la sección 2, DEBAJO del hero, nunca dentro.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return { title: t("defaultTitle"), description: t("defaultDescription") };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tc = await getTranslations("cta");
  const tm = await getTranslations("microcopy");

  const destinos = await listDestinations();
  const tarjetas = await Promise.all(
    destinos.map(async (destino) => {
      const precio = await getDestinationFromPrice(destino.slug);
      return { destino, precio };
    }),
  );

  const whatsappHref = buildWhatsAppUrl({ message: t("heroSubtitulo") });

  const pasos = [
    { icono: ChatText, titulo: "paso1Titulo", texto: "paso1Texto" },
    { icono: ListChecks, titulo: "paso2Titulo", texto: "paso2Texto" },
    { icono: UsersThree, titulo: "paso3Titulo", texto: "paso3Texto" },
  ] as const;

  const razones = [
    { icono: Tag, titulo: "porQue1Titulo", texto: "porQue1Texto" },
    { icono: ChatCircleText, titulo: "porQue2Titulo", texto: "porQue2Texto" },
    { icono: SealCheck, titulo: "porQue3Titulo", texto: "porQue3Texto" },
    { icono: HourglassSimple, titulo: "porQue4Titulo", texto: "porQue4Texto" },
  ] as const;

  const testimonios = [
    ["testimonio1", "testimonio1Autor", "testimonio1Rol"],
    ["testimonio2", "testimonio2Autor", "testimonio2Rol"],
    ["testimonio3", "testimonio3Autor", "testimonio3Rol"],
  ] as const;

  return (
    <>
      <JsonLd locale={locale} />

      {/* 1. HERO. Tres elementos de texto: titular, subtítulo y CTAs.
          Sin micro-línea bajo los botones y sin sellos dentro (§2.bis). */}
      <Hero
        titulo={t("heroTitulo")}
        subtitulo={t("heroSubtitulo")}
        imagen="/destinos/home-hero.webp"
        imagenMovil="/destinos/home-hero-movil.webp"
        imagenAlt={t("heroImagenAlt")}
        ciclo={[
          { imagen: "/destinos/cartagena-hero.webp", alt: t("heroImagenAlt2") },
          { imagen: "/destinos/san-andres-hero.webp", alt: t("heroImagenAlt3") },
        ]}
        acciones={
          <>
            {/*
              Variante `whatsapp` y no `primary`: todo botón que lleva a WhatsApp
              es verde en TODO el sitio, por reconocimiento del canal (§2). El
              naranja queda para la acción que no sale a WhatsApp, que es enviar
              el formulario. Tenerlo naranja aquí y verde en el navbar pintaba la
              misma acción de dos colores encima del pliegue.
            */}
            <ButtonLink
              href={whatsappHref}
              variant="whatsapp"
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="size-5" />
              {tc("cotizaWhatsapp")}
            </ButtonLink>
            {/*
              SIN `bg-white/10`, y no es un detalle estético. Ese 10% de blanco
              aclara el fondo lo justo para que el texto blanco del botón caiga a
              4.29:1 sobre el peor caso (una foto clara bajo el overlay navy/70).
              Sin él, el texto se apoya directamente en el overlay y rinde 5.31:1,
              que es el valor que el propio componente Hero tiene medido.
            */}
            <ButtonLink
              href="/destinos"
              variant="outline"
              size="lg"
              className="hover:text-brand-navy border-white bg-transparent text-white hover:bg-white"
            >
              {tc("descubreOpciones")}
            </ButtonLink>
          </>
        }
      />

      {/* 2. FRANJA DE CONFIANZA. Debajo del hero, nunca dentro (spec-home-v1.md
          §4). Tres señales, no una: el RNT es el sello oficial (Badge, como
          en el resto del sitio); las otras dos son texto con ícono, más
          liviano, porque son afirmaciones de la agencia, no un registro
          verificable por un tercero. Cero cifras del tipo "+X viajeros" o
          años de experiencia — es justo donde pierde credibilidad la
          competencia medida en el spec, y el manual de marca lo prohíbe. */}
      <Section spacing="compact" background="alt">
        <div className="reveal flex flex-wrap items-center gap-x-8 gap-y-3">
          <Badge variant="trust">RNT {RNT_NUMBER}</Badge>
          <Link
            href="/nosotros"
            className="text-body-sm text-brand-turquoise-text inline-flex min-h-11 items-center gap-2 font-semibold underline-offset-4 hover:underline"
          >
            <MapPin weight="regular" className="size-4 shrink-0" aria-hidden="true" />
            {t("franjaVerificable")}
          </Link>
          <p className="text-body-sm inline-flex items-center gap-2 text-neutral-700">
            <Clock weight="regular" className="size-4 shrink-0" aria-hidden="true" />
            {t("franjaRespuesta")}
          </p>
        </div>
      </Section>

      {/* 3. DESTINOS. Scroll-snap horizontal en móvil, rejilla 2 columnas en
          tablet (md), rejilla ASIMÉTRICA en escritorio (lg, spec-home-v1.md
          §5.1): la primera tarjeta ocupa un bloque de 2x2 y las dos
          siguientes se apilan a su lado — nunca la fila de 6 tarjetas
          idénticas que §2.bis prohíbe como recurso genérico. CSS puro, sin
          librería de carrusel.

          `lg:grid-rows-[18rem_18rem_auto]`: filas 1 y 2 con alto FIJO a
          propósito. Con `auto` en las tres, la tarjeta destacada (que
          ocupa las dos filas) y la pareja de tarjetas laterales (una por
          fila) podrían terminar de alturas distintas, porque cada fila
          `auto` se mide por su propio contenido. Con alto fijo, la
          destacada mide exactamente `2×18rem + gap` y la pareja lateral
          suma exactamente lo mismo: coinciden siempre, sea cual sea el
          largo del texto de cada tarjeta.

          `reveal` sobre el <ul> entero y NO `reveal-stagger` sobre las tarjetas:
          `overflow-x: auto` obliga al navegador a calcular `overflow-y` como
          `auto` también, así que este <ul> ES un contenedor de scroll vertical
          aunque nunca se desplace en vertical. Las tarjetas, al ser hijas suyas,
          anclarían su `view(block)` a un scroll que no se mueve y no aparecerían
          jamás. La fila entera sí se ancla al scroll de la página. */}
      <Section>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="reveal-strong text-h2 text-brand-navy max-w-[18ch]">
            {t("destinosTitulo")}
          </h2>
          <Link
            href="/destinos"
            className="text-body text-brand-turquoise-text inline-flex min-h-11 items-center font-semibold underline-offset-4 hover:underline"
          >
            {t("destinosVerTodos")}
          </Link>
        </div>

        <ul className="reveal carrusel-destinos -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-3 lg:grid-rows-[18rem_18rem_auto] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tarjetas.map(({ destino, precio }, i) => (
            <li
              key={destino.slug}
              className={cn(
                "w-[80vw] shrink-0 snap-start sm:w-[55vw] md:w-auto",
                // La primera tarjeta es la destacada: ocupa 2 columnas y las
                // 2 filas de alto fijo. Sin span explícito, la colocación
                // automática de grid ya deja las tarjetas 2 y 3 apiladas a
                // su lado (fila 1 y fila 2 de la 3ª columna) y las tarjetas
                // 4-6 en la fila `auto` de abajo — no hace falta más CSS.
                i === 0 && "lg:col-span-2 lg:row-span-2",
              )}
            >
              <DestinationCard
                destino={destino}
                precioDesde={precio?.precioDesde}
                moneda={precio?.moneda}
                destacado={i === 0}
                imagenExpandida={i === 1 || i === 2}
              />
            </li>
          ))}
        </ul>
      </Section>

      {/* 4. CÓMO FUNCIONA. Flujo de 3 pasos con línea conectora, NO tres tarjetas
          idénticas: esa fila es la firma de una plantilla. */}
      <Section background="navy">
        <h2 className="reveal-strong text-h2 mb-12 max-w-[18ch]">{t("comoFuncionaTitulo")}</h2>

        <ol className="reveal-stagger relative grid gap-10 md:grid-cols-3 md:gap-8">
          {/* La línea conectora sólo existe en escritorio, donde el flujo es
              horizontal. En móvil los pasos se apilan y la línea sobra.
              `line-draw` la dibuja de izquierda a derecha según entra en
              pantalla (globals.css): un `<div>`, no un SVG, así que sigue
              siendo `transform: scaleX()`, no `stroke-dashoffset`. */}
          <div
            aria-hidden="true"
            className="line-draw absolute top-6 right-0 left-0 hidden h-px bg-white/20 md:block"
          />

          {pasos.map(({ icono: Icono, titulo, texto }) => (
            <li key={titulo} className="relative flex flex-col gap-3">
              <span className="bg-brand-navy ring-brand-turquoise/40 flex size-12 items-center justify-center rounded-full ring-2">
                <Icono
                  weight="regular"
                  className="text-brand-turquoise size-6"
                  aria-hidden="true"
                />
              </span>
              <h3 className="text-h3">{t(titulo)}</h3>
              <p className="text-body max-w-[38ch] text-white/90">{t(texto)}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* 5. POR QUÉ BROWAY. Rejilla 2x2 de tarjetas con superficie propia
          (spec-home-v1.md §7), no la lista de checks planos de antes: al
          lado de la rejilla de 6 beneficios de Apple Travel, los checks se
          veían menos sustanciosos que su competencia. Siguen siendo 4 y no
          6 — Apple Travel enumera servicios operativos (tiquetes, seguros,
          traslados); estos son razones de confianza, y estirarlos a 6
          obligaría a inventar dos. Un ícono DISTINTO por tarjeta, no el
          mismo check cuatro veces: ayuda a leerlas como cuatro ideas, no
          como una lista continua. */}
      <Section>
        <h2 className="reveal-strong text-h2 text-brand-navy mb-10 max-w-[18ch]">
          {t("porQueTitulo")}
        </h2>
        <dl className="reveal-stagger grid gap-6 md:grid-cols-2">
          {razones.map(({ icono: Icono, titulo, texto }) => (
            <div
              key={titulo}
              className="bg-surface-alt flex flex-col gap-3 rounded-md border border-neutral-200 p-6"
            >
              <Icono
                weight="regular"
                className="text-brand-turquoise size-7"
                aria-hidden="true"
              />
              <dt className="text-h3 text-brand-navy">{t(titulo)}</dt>
              <dd className="text-body max-w-[45ch] text-neutral-700">
                {t(texto)}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* 6. NEXT STOP. Única aparición de la firma verbal en toda la página. */}
      <Section background="turquoise" spacing="compact">
        <div className="reveal-scale flex flex-col items-start gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-h2">{t("nextStopTitulo")}</h2>
            <p className="text-body max-w-[45ch]">{t("nextStopTexto")}</p>
          </div>
          <ButtonLink
            href={whatsappHref}
            variant="secondary"
            size="lg"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            {tc("planeemosViaje")}
          </ButtonLink>
        </div>
      </Section>

      {/* 7. TESTIMONIOS. Uno destacado y dos apilados: asimétrico a propósito,
          para no caer en la fila de tres iguales. */}
      <Section background="alt">
        <h2 className="reveal text-h2 text-brand-navy mb-3 max-w-[20ch]">
          {t("testimoniosTitulo")}
        </h2>
        {/* Marcados como relleno de forma evidente: ni cifras inventadas ni
            reseñas firmadas con nombres de personas reales. */}
        <p className="text-body-sm mb-8 text-neutral-600">
          {t("testimoniosNota")}
        </p>

        <div className="reveal-stagger grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Testimonio
            cita={t(testimonios[0][0])}
            autor={t(testimonios[0][1])}
            rol={t(testimonios[0][2])}
            destacado
          />
          <div className="grid gap-6">
            {testimonios.slice(1).map(([cita, autor, rol]) => (
              <Testimonio
                key={cita}
                cita={t(cita)}
                autor={t(autor)}
                rol={t(rol)}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* 8. CONFIANZA / ANTI-FRAUDE. Dos columnas: explicación y lista de
          comprobación. Tono sereno: informa, no asusta. */}
      <Section>
        <div className="reveal-stagger grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-4">
            <ShieldCheck
              weight="regular"
              className="text-brand-turquoise size-8"
              aria-hidden="true"
            />
            <h2 className="text-h2 text-brand-navy">{t("confianzaTitulo")}</h2>
            <p className="text-body max-w-[50ch] text-neutral-700">
              {t("confianzaTexto")}
            </p>
            <div className="flex flex-wrap gap-x-6">
              <Link
                href="/nosotros"
                className="text-body text-brand-turquoise-text inline-flex min-h-11 items-center font-semibold underline-offset-4 hover:underline"
              >
                {t("confianzaEnlaceNosotros")}
              </Link>
              <Link
                href="/legal"
                className="text-body text-brand-turquoise-text inline-flex min-h-11 items-center font-semibold underline-offset-4 hover:underline"
              >
                {t("confianzaEnlaceLegal")}
              </Link>
            </div>
          </div>

          <ul className="flex flex-col gap-5">
            {["check1", "check2", "check3"].map((clave) => (
              <li
                key={clave}
                className="border-brand-turquoise/40 text-body border-l-2 pl-5 text-neutral-700"
              >
                {t(clave)}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 9. CIERRE. WhatsApp como vía principal y el formulario como alternativa
          real, no como enlace escondido. */}
      <Section background="navy">
        <div className="reveal-stagger grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="flex flex-col items-start gap-5">
            <h2 className="text-h2 max-w-[18ch]">{t("cierreTitulo")}</h2>
            <p className="text-body max-w-[45ch] text-white/90">
              {t("cierreTexto")}
            </p>
            <ButtonLink
              href={whatsappHref}
              variant="whatsapp"
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="size-5" />
              {tc("cotizaWhatsapp")}
            </ButtonLink>
            <p className="text-body-sm text-white/90">
              {tm("respuestaEnMinutos")}
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 md:p-8">
            <p className="text-body-sm text-brand-navy mb-5 font-semibold">
              {t("cierreFormulario")}
            </p>
            <LeadForm paginaOrigen="/" />
          </div>
        </div>
      </Section>
    </>
  );
}

function Testimonio({
  cita,
  autor,
  rol,
  destacado = false,
}: {
  cita: string;
  autor: string;
  rol: string;
  /** La atribución lleva nombre Y rol, nunca sólo el nombre (§11.B). */
  destacado?: boolean;
}) {
  return (
    <Card className={destacado ? "flex flex-col justify-center p-8" : "p-6"}>
      <blockquote
        className={`${destacado ? "text-body-lg" : "text-body"} text-neutral-800`}
      >
        {cita}
      </blockquote>
      <p className="text-body-sm mt-4 text-neutral-600">
        <span className="text-brand-navy font-semibold">{autor}</span>, {rol}
      </p>
    </Card>
  );
}

/**
 * `LocalBusiness` con los datos que existen.
 *
 * Los que no están confirmados NO se emiten: un dato estructurado inventado es
 * peor que su ausencia, porque los buscadores lo tratan como declaración formal
 * del negocio.
 */
async function JsonLd({ locale }: { locale: string }) {
  const base = locale === "es" ? SITE_URL : `${SITE_URL}/${locale}`;

  const datos = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "BroWay Adventures",
    url: base,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.direccion,
      addressLocality: "Medellín",
      addressCountry: "CO",
    },
    telephone: `+57${CONTACT.telefono.replace(/\D/g, "")}`,
    email: CONTACT.email,
    areaServed: "CO",
    /**
     * El RNT va como identificador oficial del prestador turístico.
     *
     * Todo lo que se emite aquí está confirmado por el cliente: un dato
     * estructurado inventado es peor que su ausencia, porque los buscadores lo
     * tratan como declaración formal del negocio.
     */
    identifier: {
      "@type": "PropertyValue",
      name: "Registro Nacional de Turismo",
      value: RNT_NUMBER,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(datos) }}
    />
  );
}
