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
import { Card, DestinationCard, HotelCard, PackageCard } from "@/components/ui/card";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { LeadForm } from "@/components/forms/lead-form";
import { WhatsAppIcon } from "@/components/layout/whatsapp-floating";
import { buildWhatsAppUrl, CONTACT, RNT_NUMBER, SITE_URL } from "@/lib/config";
import { Link } from "@/lib/i18n/navigation";
import {
  getDestinationFromPrice,
  listFeaturedDestinations,
} from "@/lib/destinations";
import { listOffersByCollection } from "@/lib/offers";
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
 *   - TRECE secciones. Las cinco comerciales que pide `estructura-funcional-cliente.md`
 *     §3 (Mejores Ofertas · Playas y Hoteles · Internacionales · Nacionales ·
 *     Pueblos de Antioquia) son todas listados de producto, así que apiladas serían
 *     cinco rejillas seguidas: exactamente la plantilla que §11.B prohíbe. Se evita
 *     de dos maneras, y las dos hay que mantenerlas al tocar esta página:
 *
 *       (a) Cada una usa una ESTRUCTURA distinta: rejilla asimétrica 1+resto ·
 *           carril horizontal de tarjetas verticales 3:4 · rejilla asimétrica de 3 ·
 *           carril horizontal compacto · lista editorial a dos columnas sin tarjeta.
 *       (b) Se INTERCALAN con las secciones que no son listados. "Cómo funciona"
 *           separa Ofertas de Hoteles, y la franja "Next Stop" separa Hoteles de las
 *           tres de destino. Nunca hay dos rejillas de tarjetas seguidas.
 *
 *   - CERO eyebrows. El techo sería 4 (techo de 13/3), pero la regla dice que en la
 *     mayoría de los casos el titular solo basta.
 *   - Ninguna fila de 3 tarjetas idénticas. Los 3 pasos son un flujo conectado, no
 *     tarjetas; los testimonios son 1 destacado + 2; Internacionales es 1 grande + 2.
 *   - Nunca 3 secciones seguidas con el patrón imagen-a-un-lado / texto-al-otro.
 *   - "Next Stop" aparece EXACTAMENTE una vez, en la franja turquesa.
 *   - Los sellos de confianza van en la sección 2, DEBAJO del hero, nunca dentro.
 *
 * Pendiente de verificar EN NAVEGADOR, no leyendo: que el ritmo aguante 13 secciones
 * en móvil y que el LCP siga por debajo de 1s con más imágenes sobre el pliegue.
 */

/** Enlace "ver todo" del encabezado de sección. `min-h-11` = mínimo táctil. */
const ENLACE_SECCION =
  "text-body text-brand-turquoise-text inline-flex min-h-11 items-center font-semibold underline-offset-4 hover:underline";

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

  /*
   * Las cinco secciones comerciales de §3 leen de la CURADURÍA, no del catálogo:
   * son las ofertas y los destinos que la agencia marcó, en el orden que ella fijó.
   * Sin eso la home muestra "todo lo que hay", que es justo lo que §9 descarta.
   */
  const [ofertas, hoteles, internacionales, nacionales, pueblos] =
    await Promise.all([
      listOffersByCollection("mejores-ofertas"),
      listOffersByCollection("playas-y-hoteles"),
      listFeaturedDestinations("internacional"),
      listFeaturedDestinations("nacional"),
      listFeaturedDestinations("pueblos-de-antioquia"),
    ]);

  const conPrecio = async (lista: typeof internacionales) =>
    Promise.all(
      lista.map(async (destino) => ({
        destino,
        precio: await getDestinationFromPrice(destino.slug),
      })),
    );

  const [tarjetasInternacionales, tarjetasNacionales, tarjetasPueblos] =
    await Promise.all([
      conPrecio(internacionales),
      conPrecio(nacionales),
      conPrecio(pueblos),
    ]);

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

      {/* 3. MEJORES OFERTAS (§5, §6). Rejilla ASIMÉTRICA: la primera ocupa las dos
          columnas y el resto va emparejado. No es una fila de tarjetas iguales, que
          es justo lo que prohíbe el Pre-Flight §11.B. */}
      <Section>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="reveal-strong text-h2 text-brand-navy max-w-[18ch]">
            {t("ofertasTitulo")}
          </h2>
          <Link href="/ofertas" className={ENLACE_SECCION}>
            {t("ofertasVerTodas")}
          </Link>
        </div>
        {ofertas.length > 0 ? (
          <ul className="reveal grid gap-5 md:grid-cols-2">
            {ofertas.slice(0, 5).map((offer, i) => (
              <li key={offer.slug} className={cn(i === 0 && "md:col-span-2")}>
                <PackageCard offer={offer} destacado={i === 0} />
              </li>
            ))}
          </ul>
        ) : null}
      </Section>

      {/* 4. CÓMO FUNCIONA.
          Era una fila de TRES COLUMNAS IDÉNTICAS (medidas: 3 × 180×341), que
          es literalmente el recurso que §2.bis prohíbe; lo único que la
          separaba de la plantilla genérica era una línea de 1px. Ahora es un
          layout asimétrico: el titular ocupa su propia columna y los pasos
          bajan en secuencia vertical, enhebrados por un espinazo que se
          dibuja al entrar en pantalla.

          La secuencia vertical no es sólo estética: estos son pasos de un
          proceso (un `<ol>`), y leerlos de arriba abajo comunica el orden
          mejor que tres columnas en paralelo, que sugieren simultaneidad. */}
      <Section background="navy">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-20">
          {/* `lg:self-start` y NO `lg:sticky`: con la sección en ~554px y un
              viewport de 900 el pegajoso no llega a activarse nunca, así que
              sería una promesa de comportamiento que no ocurre. */}
          <h2 className="reveal-strong text-h2 max-w-[14ch] lg:self-start">
            {t("comoFuncionaTitulo")}
          </h2>

          <ol className="reveal-stagger relative flex flex-col gap-10">
            {/* `left-6` = 24px = centro exacto del círculo de 48px, y `top-6`
                lo hace arrancar en el centro del primer ícono en vez del borde
                del <ol>: una línea que asoma por encima del primer paso se lee
                como un borde suelto, no como un hilo que los une.

                Abajo NO termina en el centro del último ícono, sino 24px antes
                del final del <ol> (medido: el último ícono está en y=292 y el
                espinazo llega a y=338). La diferencia es el alto del texto del
                último paso, que baja más que su ícono. Dejarlo correr hasta ahí
                es lo correcto: el hilo acompaña al último bloque de texto en
                vez de cortarse a media altura. */}
            <div
              aria-hidden="true"
              className="line-draw-y absolute top-6 bottom-6 left-6 w-px bg-white/20"
            />

            {pasos.map(({ icono: Icono, titulo, texto }) => (
              <li key={titulo} className="relative flex gap-5">
                {/* `z-10` + fondo navy propio: el espinazo pasa por detrás y
                    el círculo lo tapa, así la línea no se ve cruzando el
                    ícono. */}
                <span className="bg-brand-navy ring-brand-turquoise/40 z-10 flex size-12 shrink-0 items-center justify-center rounded-full ring-2">
                  <Icono
                    weight="regular"
                    className="text-brand-turquoise size-6"
                    aria-hidden="true"
                  />
                </span>
                <div className="flex flex-col gap-2 pt-2">
                  <h3 className="text-h3">{t(titulo)}</h3>
                  <p className="text-body max-w-[46ch] text-white/90">
                    {t(texto)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* 5. MEJORES PLAYAS Y HOTELES (§7, §8). Carril horizontal con scroll-snap y
          tarjetas VERTICALES (3:4): §8 pide privilegiar la fotografía, y ninguna
          otra sección de la página usa este formato.

          Va DESPUÉS de "Cómo funciona" y no pegada a Mejores Ofertas, para que dos
          rejillas de tarjetas nunca queden seguidas (§11.B).

          `reveal` sobre el <ul> y no sobre las tarjetas: `overflow-x: auto` hace del
          <ul> un contenedor de scroll, y sus hijas anclarían su `view()` a un scroll
          que nunca se mueve, así que no aparecerían jamás. */}
      <Section background="alt">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="flex max-w-[46ch] flex-col gap-2">
            <h2 className="reveal-strong text-h2 text-brand-navy">
              {t("hotelesTitulo")}
            </h2>
            <p className="text-body text-neutral-700">{t("hotelesTexto")}</p>
          </div>
          <Link href="/playas-y-hoteles" className={ENLACE_SECCION}>
            {t("hotelesVerTodas")}
          </Link>
        </div>
        {hoteles.length > 0 ? (
          <ul className="reveal -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {hoteles.slice(0, 6).map((offer) => (
              <li
                key={offer.slug}
                className="w-[70vw] shrink-0 snap-start sm:w-[45vw] lg:w-[22rem]"
              >
                <HotelCard offer={offer} />
              </li>
            ))}
          </ul>
        ) : null}
      </Section>

      {/* 6. POR QUÉ BROWAY. Rejilla 2x2 de tarjetas con superficie propia
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

      {/* 7. NEXT STOP. Única aparición de la firma verbal en toda la página. */}
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

      {/* 8. DESTINOS INTERNACIONALES (§9, §10). Rejilla asimétrica: el primero
          manda y los otros dos lo acompañan. */}
      <Section>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="reveal-strong text-h2 text-brand-navy max-w-[18ch]">
            {t("internacionalesTitulo")}
          </h2>
          <Link href="/destinos/internacionales" className={ENLACE_SECCION}>
            {t("internacionalesVerTodos")}
          </Link>
        </div>
        {tarjetasInternacionales.length > 0 ? (
          <ul className="reveal grid gap-5 md:grid-cols-3 lg:grid-rows-[24rem]">
            {tarjetasInternacionales.slice(0, 3).map(({ destino, precio }, i) => (
              <li key={destino.slug} className={cn(i === 0 && "md:col-span-2")}>
                <DestinationCard
                  destino={destino}
                  precioDesde={precio?.precioDesde}
                  moneda={precio?.moneda}
                  destacado={i === 0}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </Section>

      {/* 9. DESTINOS NACIONALES (§11, §12). Carril horizontal compacto: mismo
          contenido que la sección anterior con OTRA densidad, para no repetir
          rejilla dos veces seguidas (§11.B). */}
      <Section background="alt">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="reveal-strong text-h2 text-brand-navy max-w-[18ch]">
            {t("nacionalesTitulo")}
          </h2>
          <Link href="/destinos/nacionales" className={ENLACE_SECCION}>
            {t("nacionalesVerTodos")}
          </Link>
        </div>
        {tarjetasNacionales.length > 0 ? (
          <ul className="reveal -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tarjetasNacionales.slice(0, 6).map(({ destino, precio }) => (
              <li
                key={destino.slug}
                className="w-[70vw] shrink-0 snap-start sm:w-[42vw] lg:w-[20rem]"
              >
                <DestinationCard
                  destino={destino}
                  precioDesde={precio?.precioDesde}
                  moneda={precio?.moneda}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </Section>

      {/* 10. PUEBLOS DE ANTIOQUIA (§13, §14). Lista editorial en dos columnas, SIN
          tarjetas: es la única categoría dirigida por inventario —los pueblos
          aparecen y desaparecen con la oferta del proveedor—, así que casi siempre
          tendrá dos o tres entradas. Tres tarjetas grandes ahí se verían vacías, y
          serían la tercera rejilla seguida. */}
      <Section>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="flex flex-col items-start gap-3">
            <h2 className="reveal-strong text-h2 text-brand-navy">
              {t("pueblosTitulo")}
            </h2>
            <p className="text-body text-neutral-700">{t("pueblosTexto")}</p>
            <Link href="/destinos/pueblos-de-antioquia" className={ENLACE_SECCION}>
              {t("pueblosVerTodos")}
            </Link>
          </div>

          {tarjetasPueblos.length > 0 ? (
            <ul className="reveal grid gap-x-10 gap-y-6 sm:grid-cols-2">
              {tarjetasPueblos.slice(0, 4).map(({ destino }) => (
                <li
                  key={destino.slug}
                  className="border-brand-turquoise/40 border-l-2 pl-5"
                >
                  <Link href={`/destinos/${destino.slug}`} className="group">
                    <h3 className="text-h3 text-brand-navy group-hover:underline">
                      {destino.nombre}
                    </h3>
                    <p className="text-body-sm mt-1 text-neutral-700">
                      {destino.resumen}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Section>

      {/* 11. TESTIMONIOS. Uno destacado y dos apilados: asimétrico a propósito,
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

      {/* 12. CONFIANZA / ANTI-FRAUDE. Dos columnas: explicación y lista de
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

      {/* 13. CIERRE. WhatsApp como vía principal y el formulario como alternativa
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
