import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, PackageCard } from "@/components/ui/card";
import { Checkbox, Input, Select, Textarea } from "@/components/ui/field";
import { PriceDisclosure } from "@/components/ui/price-disclosure";
import { Section } from "@/components/ui/section";
import { listActiveOffers } from "@/lib/offers";

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
    contrast: "para texto sobre fondo claro",
  },
  {
    name: "brand-turquoise-text",
    hex: "#007D91",
    contrast: "para texto sobre fondo claro",
  },
] as const;

const NEUTRALS = [
  "50", "100", "200", "300", "400", "500", "600", "700", "800", "900",
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
            {NEUTRALS.map((step) => (
              <div key={step} className="flex flex-col items-center gap-1">
                <div
                  className={`size-16 rounded-md border border-neutral-200 bg-neutral-${step}`}
                />
                <span className="text-caption text-neutral-600">{step}</span>
              </div>
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
          <p className="text-caption text-neutral-500">
            La etiqueta de dato muestra escasez real y editable. Nunca acompañada
            de un contador: la urgencia inventada está vetada por marca.
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
