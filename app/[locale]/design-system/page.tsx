import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, PackageCard } from "@/components/ui/card";
import { Checkbox, Input, Select, Textarea } from "@/components/ui/field";
import { LeadForm } from "@/components/forms/lead-form";
import { Hero } from "@/components/ui/hero";
import { PriceDisclosure } from "@/components/ui/price-disclosure";
import { Section } from "@/components/ui/section";
import { listActiveOffers } from "@/lib/offers";
import { cn } from "@/lib/utils";

/**
 * Guía viva del sistema de diseño.
 *
 * Cumple el propósito de consistencia mientras el equipo es pequeño. Storybook está
 * explícitamente diferido a Fase 2-3 (spec-tecnica.md §4.4): añadir esa
 * infraestructura ahora sería sobre-ingeniería.
 */
export const metadata: Metadata = {
  title: "Sistema de diseño",
  robots: { index: false, follow: false },
};

const COLORS = [
  { name: "brand-navy", hex: "#003062", contrast: "13.13:1 con texto blanco" },
  { name: "brand-turquoise", hex: "#00AAC3", contrast: "4.71:1 con texto navy" },
  { name: "brand-orange", hex: "#FF6A03", contrast: "4.57:1 con texto navy" },
  { name: "whatsapp", hex: "#25D366", contrast: "6.62:1 con texto navy" },
  {
    name: "brand-orange-text",
    hex: "#C24A00",
    contrast: "texto sobre claro — 5.98 blanco / 5.56 alt / 5.32 tinte",
  },
  {
    name: "brand-turquoise-text",
    hex: "#006B7D",
    contrast: "texto sobre claro — 6.18 blanco / 5.75 alt / 5.55 tinte",
  },
] as const;

/**
 * Los estados se documentan con sus tres ratios porque el error que se coló la
 * primera vez fue verificarlos sólo contra blanco: un badge los pinta sobre un
 * tinte del propio color, que es MÁS claro que el blanco de al lado.
 */
const STATES = [
  { name: "success", hex: "#0A7550", swatch: "bg-success" },
  { name: "error", hex: "#C0362C", swatch: "bg-error" },
  { name: "warning", hex: "#95590A", swatch: "bg-warning" },
  { name: "info", hex: "#006B7D", swatch: "bg-info" },
] as const;

/**
 * Las clases van COMPLETAS y literales a propósito.
 *
 * Tailwind v4 escanea el código fuente como texto plano: no evalúa JavaScript.
 * Escribir `bg-neutral-${step}` no genera ninguna clase, y esta página — que es
 * justamente la referencia de la paleta — mostraba 9 de sus 10 muestras
 * transparentes. Sobrevivía sólo `bg-neutral-100`, porque esa cadena sí aparece
 * literal en otros componentes.
 */
const NEUTRALS = [
  { step: "50", className: "bg-neutral-50" },
  { step: "100", className: "bg-neutral-100" },
  { step: "200", className: "bg-neutral-200" },
  { step: "300", className: "bg-neutral-300" },
  { step: "400", className: "bg-neutral-400" },
  { step: "500", className: "bg-neutral-500" },
  { step: "600", className: "bg-neutral-600" },
  { step: "700", className: "bg-neutral-700" },
  { step: "800", className: "bg-neutral-800" },
  { step: "900", className: "bg-neutral-900" },
] as const;

const TYPE_SCALE = [
  { token: "text-display", label: "Display" },
  { token: "text-h1", label: "Título 1" },
  { token: "text-h2", label: "Título 2" },
  { token: "text-h3", label: "Título 3" },
  { token: "text-body-lg", label: "Cuerpo grande" },
  { token: "text-body", label: "Cuerpo" },
  { token: "text-body-sm", label: "Cuerpo pequeño" },
  { token: "text-caption", label: "Caption" },
] as const;

function Block({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 border-t border-neutral-200 pt-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-h2 text-brand-navy">{title}</h2>
        {description ? (
          <p className="text-body-sm max-w-2xl text-neutral-600">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export default async function DesignSystemPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const offers = await listActiveOffers();

  return (
    <Section>
      <div className="flex flex-col gap-12">
        <header className="flex flex-col gap-3">
          <Badge variant="neutral" className="self-start">
            Interno · no indexado · solo español
          </Badge>
          {/*
            Esta página es documentación interna y su texto va fijo en español a
            propósito: no pasa por messages/*.json. Si la abres desde un navegador
            en inglés verás la navegación traducida y el contenido en español — no
            es un error, es la detección de idioma haciendo su trabajo.
          */}
          <h1 className="text-h1 text-brand-navy">Sistema de diseño</h1>
          <p className="text-body-lg max-w-2xl text-neutral-600">
            Tokens y componentes base de BroWay Adventures. Los valores de marca
            salen del logo oficial y sus ratios de contraste están verificados: no
            los re-derives al construir páginas.
          </p>
        </header>

        <Block
          title="Color de marca"
          description="El naranja y el turquesa de marca NO sirven como color de texto pequeño sobre blanco (~2.8:1). Para eso están sus variantes de texto."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COLORS.map((color) => (
              <Card key={color.name} className="flex flex-col">
                <div
                  className="h-20 w-full"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="flex flex-col gap-1 p-4">
                  <p className="text-body-sm text-brand-navy font-semibold">
                    {color.name}
                  </p>
                  <p className="text-caption font-mono text-neutral-600">
                    {color.hex}
                  </p>
                  <p className="text-caption text-neutral-500">
                    {color.contrast}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Block>

        <Block
          title="Neutros fríos"
          description="Matiz azulado en armonía con el navy — nunca grises puros."
        >
          <div className="flex flex-wrap gap-2">
            {NEUTRALS.map((neutral) => (
              <div
                key={neutral.step}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={cn(
                    "size-16 rounded-md border border-neutral-200",
                    neutral.className,
                  )}
                />
                <span className="text-caption text-neutral-600">
                  {neutral.step}
                </span>
              </div>
            ))}
          </div>
        </Block>

        <Block
          title="Estados"
          description="Verificados sobre las tres superficies claras del sistema: blanco, surface-alt y su propio tinte al 10% — que es como los pinta un badge. Verificar sólo contra blanco no alcanza."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATES.map((state) => (
              <div key={state.name} className="flex flex-col gap-2">
                <div className={cn("h-12 w-full rounded-md", state.swatch)} />
                <p className="text-body-sm text-brand-navy font-semibold">
                  {state.name}
                </p>
                <p className="text-caption font-mono text-neutral-600">
                  {state.hex}
                </p>
              </div>
            ))}
          </div>
        </Block>

        <Block
          title="Foco visible"
          description="Anillo doble: blanco por dentro, navy por fuera. Un anillo de un solo color no puede cumplir el 3:1 de WCAG 2.2 sobre blanco, navy y turquesa a la vez. Recórrelo con Tab sobre cada fondo."
        >
          <div className="flex flex-col gap-3">
            {(["base", "navy", "turquoise"] as const).map((background) => (
              <Section
                key={background}
                background={background}
                spacing="compact"
                className="rounded-md"
              >
                <div className="flex flex-wrap items-center gap-4">
                  <Button variant="primary" size="sm">
                    Enfócame con Tab
                  </Button>
                  <Button variant="whatsapp" size="sm">
                    Y a mí
                  </Button>
                </div>
              </Section>
            ))}
          </div>
        </Block>

        <Block
          title="Tipografía"
          description="Escala mobile-first: los tamaños crecen con clamp(). Redimensiona la ventana para verlo."
        >
          <div className="flex flex-col gap-4">
            {TYPE_SCALE.map((item) => (
              <div key={item.token} className="flex flex-col gap-1">
                <span className="text-caption font-mono text-neutral-500">
                  {item.token}
                </span>
                <span className={`${item.token} text-brand-navy`}>
                  {item.label} — Tu próxima parada
                </span>
              </div>
            ))}
          </div>
        </Block>

        <Block
          title="Botones"
          description="Prohibido: naranja con texto blanco (2.87:1) y WhatsApp con texto blanco (1.98:1). Ambos fallan AA."
        >
          <div className="flex flex-col gap-6">
            {(["primary", "secondary", "outline", "ghost", "whatsapp"] as const).map(
              (variant) => (
                <div key={variant} className="flex flex-col gap-2">
                  <span className="text-caption font-mono text-neutral-500">
                    {variant}
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant={variant} size="sm">
                      Pequeño
                    </Button>
                    <Button variant={variant} size="md">
                      Cotiza por WhatsApp
                    </Button>
                    <Button variant={variant} size="lg">
                      Grande
                    </Button>
                    <Button variant={variant} disabled>
                      Deshabilitado
                    </Button>
                  </div>
                </div>
              ),
            )}
          </div>
        </Block>

        <Block title="Etiquetas">
          <div className="flex flex-wrap gap-3">
            <Badge variant="trust">RNT XXXXXX</Badge>
            <Badge variant="trust">ANATO</Badge>
            <Badge variant="destino">Nacional</Badge>
            <Badge variant="destino">Internacional</Badge>
            <Badge variant="neutral">Grupo pequeño</Badge>
            <Badge variant="dato">Quedan 4 cupos</Badge>
          </div>

          <div className="bg-brand-navy flex flex-wrap gap-3 rounded-lg p-5">
            <Badge variant="destinoOscuro">Nacional</Badge>
            <Badge variant="destinoOscuro">Internacional</Badge>
          </div>

          <p className="text-caption text-neutral-500">
            La etiqueta de dato muestra escasez real y editable. Nunca acompañada
            de un contador: la urgencia inventada está vetada por marca.
          </p>
          <p className="text-caption text-neutral-500">
            <strong>destinoOscuro existe por una razón medible.</strong> Sobre el
            navy de un hero, la variante clara rinde 1.82:1 e ilegible, porque su
            texto está medido sobre superficies claras y no sobre esta. La variante
            oscura rinde 8.46:1. Verifica siempre contra la superficie que el
            componente pinta de verdad, no contra blanco.
          </p>
        </Block>

        <Block
          title="Campos de formulario"
          description="El label siempre va asociado por htmlFor. El placeholder no es un label."
        >
          <div className="flex max-w-lg flex-col gap-5">
            <Input label="Nombre" name="demo-nombre" required />
            <Input
              label="WhatsApp"
              name="demo-telefono"
              hint="Incluye el indicativo si estás fuera de Colombia"
              required
            />
            <Input
              label="Con error"
              name="demo-error"
              error="Este campo es obligatorio"
            />
            <Select label="Ciudad de salida" name="demo-ciudad" required>
              <option value="">Elige una ciudad</option>
              <option value="medellin">Medellín</option>
              <option value="bogota">Bogotá</option>
            </Select>
            <Textarea label="Cuéntanos algo más" name="demo-mensaje" />
            <Checkbox
              name="demo-consentimiento"
              label="Autorizo el tratamiento de mis datos personales para gestionar mi solicitud, elaborar cotizaciones, hacer seguimiento y enviarme información comercial y publicidad personalizada, conforme a la Política de Tratamiento de Datos."
            />
            <p className="text-caption text-neutral-500">
              El componente Checkbox no acepta la prop <code>defaultChecked</code>:
              el tipo la excluye para que el compilador impida pre-marcar una
              autorización.
            </p>
          </div>
        </Block>

        <Block
          title="Formulario de captación"
          description="Los cuatro campos no son negociables: son los que el asesor necesita para cotizar sin volver a preguntar. El botón está deshabilitado hasta marcar la autorización, y el servidor la vuelve a exigir."
        >
          <div className="max-w-lg">
            <LeadForm paginaOrigen="/design-system" destino="Eje Cafetero" />
          </div>
        </Block>

        <Block
          title="Precio con su disclosure"
          description="Todo precio publicado va acompañado de este bloque. Sin ciudad de salida y ocupación, un precio 'desde' no significa nada."
        >
          {offers[0] ? (
            <Card className="max-w-md p-6">
              <PriceDisclosure offer={offers[0]} />
            </Card>
          ) : null}
        </Block>

        <Block title="Tarjetas de paquete">
          <div className="grid gap-6 sm:grid-cols-2">
            {offers.slice(0, 2).map((offer) => (
              <PackageCard key={offer.offerId} offer={offer} />
            ))}
          </div>
        </Block>

        <Block
          title="Acordeón"
          description="Sobre <details>/<summary> nativos: accesible por teclado y buscable con Ctrl+F, sin JavaScript."
        >
          <Accordion className="max-w-2xl">
            <AccordionItem title="¿Cómo se reserva un viaje?" open>
              Hablas con un asesor por WhatsApp, te enviamos las opciones y
              separas con el 30%.
            </AccordionItem>
            <AccordionItem title="¿Puedo cambiar las fechas?">
              Depende de las condiciones de cada tarifa. Te las explicamos antes
              de que pagues.
            </AccordionItem>
          </Accordion>
        </Block>

        <Block
          title="Hero"
          description="El overlay tiene dos niveles y los dos están medidos contra el peor caso (foto blanca pura debajo), para que cambiar la foto no obligue a re-verificar el contraste."
        >
          <div className="overflow-hidden rounded-lg">
            <Hero
              imagen="https://picsum.photos/seed/broway-eje-cafetero/1600/900"
              imagenAlt=""
              overlay="normal"
              titulo="Elige tu próximo viaje con claridad y compañía"
              subtitulo="Te ayudamos a comparar opciones reales y a decidir sin apuro."
              microcopy="Respuesta en minutos, sin compromiso"
              acciones={
                <>
                  <Button variant="primary">Cotiza por WhatsApp</Button>
                  <Button variant="outline" className="bg-white">
                    Descubre las opciones
                  </Button>
                </>
              }
            />
          </div>
          <p className="text-caption text-neutral-600">
            La variante <code className="font-mono">fuerte</code> (navy/85) es
            para fotos claras. Ante la duda, esa.
          </p>
          <p className="text-caption text-neutral-600">
            El Hero <strong>no acepta sellos de confianza</strong>. El Pre-Flight
            §11.B los quiere en una sección debajo, nunca dentro, y limita el hero
            a cuatro elementos de texto. La prop existía e invitaba a incumplirlo,
            así que se quitó: la casilla ya no depende de que alguien recuerde la
            regla.
          </p>
        </Block>

        <Block title="Fondos de sección">
          <div className="flex flex-col gap-3">
            {(["base", "alt", "navy", "turquoise"] as const).map((background) => (
              <Section
                key={background}
                background={background}
                spacing="compact"
                className="rounded-md"
              >
                <p className="text-body font-semibold">
                  Fondo <code className="font-mono">{background}</code>
                </p>
              </Section>
            ))}
          </div>
        </Block>
      </div>
    </Section>
  );
}
