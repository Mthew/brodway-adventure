import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { CampoRespuesta } from "@/components/demo-crm/campo-respuesta";
import {
  BANDERAS,
  BLOQUES,
  CONTRATO,
  OBLIGATORIAS,
  PRUEBAS,
} from "@/lib/demo-crm/guion";
import { leerRespuestas } from "@/lib/demo-crm/respuestas";

/**
 * Guion de la demo de GoHighLevel, con las respuestas anotadas en vivo.
 *
 * Documentación interna, igual que `/design-system`: no se indexa, no entra al
 * sitemap y su texto va fijo en español. Existe porque el contrato de `/api/lead`
 * sigue abierto (`CURRENT.md` §Bloqueos) y en GoHighLevel un campo creado para el
 * objeto Contacto NO se puede convertir a Oportunidad después: lo que no se cierre
 * en la demo se paga rehaciendo la instancia.
 *
 * Las preguntas viven en `lib/demo-crm/guion.ts` y las respuestas en
 * `data/demo-crm-respuestas.json`. La lista larga está en
 * `docs/research/sistema-comercial.md`.
 */
export const metadata: Metadata = {
  title: "Demo GoHighLevel — preguntas",
  robots: { index: false, follow: false },
};

/**
 * Sin prerender: la página lee un archivo que cambia mientras dura la reunión.
 *
 * Estática, Next.js resolvería `leerRespuestas()` una sola vez al construir y la
 * página mostraría siempre las respuestas del momento del build — vacías. Es la
 * única ruta del sitio que renuncia al estático, y lo hace a cambio de algo real.
 */
export const dynamic = "force-dynamic";

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

export default async function DemoCrmPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { respuestas } = await leerRespuestas();

  /*
    El guardado escribe en el sistema de archivos del repositorio: sólo tiene
    sentido con `next dev`. Fuera de ahí los campos se muestran en sólo lectura,
    en vez de ofrecer un botón que devolvería 404.
  */
  const editable = process.env.NODE_ENV === "development";
  const contestadas = Object.keys(respuestas).length;

  return (
    <Section>
      <div className="flex flex-col gap-12">
        <header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="neutral">Interno · no indexado · solo español</Badge>
            {contestadas > 0 ? (
              <Badge variant="destino">
                {contestadas}{" "}
                {contestadas === 1 ? "respuesta guardada" : "respuestas guardadas"}
              </Badge>
            ) : null}
          </div>
          <h1 className="text-h1 text-brand-navy">
            Demo de GoHighLevel — guion de preguntas
          </h1>
          <p className="text-body-lg max-w-2xl text-neutral-600">
            Resumen operativo para la reunión. Cada pregunta guarda su respuesta
            en{" "}
            <code className="text-body-sm font-mono">
              data/demo-crm-respuestas.json
            </code>
            , dentro del repositorio. La versión larga, con el porqué de cada
            decisión, está en{" "}
            <code className="text-body-sm font-mono">
              docs/research/sistema-comercial.md
            </code>{" "}
            y en el §8 de la especificación técnica.
          </p>
        </header>

        <Block
          title="Las cinco que no pueden quedar sin respuesta"
          description="Si la reunión termina y alguna sigue abierta, hubo que volver a reunirse."
        >
          <ol className="grid gap-4 lg:grid-cols-2">
            {OBLIGATORIAS.map((item, indice) => (
              <li key={item.id}>
                <Card className="flex h-full flex-col gap-2 p-5">
                  <span className="text-caption text-brand-turquoise-text font-display font-semibold">
                    {String(indice + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-h3 text-brand-navy">{item.titulo}</h3>
                  <p className="text-body-sm text-neutral-700">{item.detalle}</p>
                  <div className="mt-auto pt-3">
                    <CampoRespuesta
                      id={item.id}
                      pregunta={item.detalle}
                      inicial={respuestas[item.id]}
                      editable={editable}
                    />
                  </div>
                </Card>
              </li>
            ))}
          </ol>
        </Block>

        {BLOQUES.map((bloque) => (
          <Block
            key={bloque.titulo}
            title={bloque.titulo}
            description={bloque.descripcion}
          >
            {/*
              Acordeón nativo: la pregunta se lee de un vistazo y el contexto se
              abre solo cuando hace falta. Con `<details>` el contenido sigue
              siendo buscable con Ctrl+F durante la reunión.

              `open` cuando ya hay respuesta: al recargar, lo contestado queda a
              la vista y no escondido detrás de un clic.
            */}
            <Accordion>
              {bloque.preguntas.map((pregunta) => (
                <AccordionItem
                  key={pregunta.id}
                  title={pregunta.q}
                  open={Boolean(respuestas[pregunta.id])}
                >
                  <div className="flex flex-col gap-4">
                    <p>{pregunta.porque}</p>
                    {pregunta.bien ? (
                      <p className="text-body-sm border-brand-turquoise/40 border-l-2 pl-4 text-neutral-600">
                        <span className="text-brand-turquoise-text font-semibold">
                          Respuesta que cierra el punto:{" "}
                        </span>
                        {pregunta.bien}
                      </p>
                    ) : null}
                    <CampoRespuesta
                      id={pregunta.id}
                      pregunta={pregunta.q}
                      inicial={respuestas[pregunta.id]}
                      editable={editable}
                    />
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </Block>
        ))}

        <Block
          title="El contrato que ya emite el sitio"
          description="Estos son los campos reales de /api/lead. Pide que los mapeen en pantalla, campo por campo."
        >
          {/* La tabla desborda en móvil; scrollea dentro de su caja, nunca la página. */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[42rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-body-sm text-brand-navy py-3 pr-4 font-semibold">
                    Objeto
                  </th>
                  <th className="text-body-sm text-brand-navy py-3 pr-4 font-semibold">
                    Campos
                  </th>
                  <th className="text-body-sm text-brand-navy py-3 font-semibold">
                    Por qué
                  </th>
                </tr>
              </thead>
              <tbody>
                {CONTRATO.map((fila) => (
                  <tr key={fila.objeto} className="border-b border-neutral-200">
                    <td className="text-body-sm text-brand-navy py-3 pr-4 align-top font-semibold">
                      {fila.objeto}
                    </td>
                    <td className="text-body-sm py-3 pr-4 align-top font-mono text-neutral-700">
                      {fila.campos}
                    </td>
                    <td className="text-body-sm py-3 align-top text-neutral-600">
                      {fila.nota}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Block>

        <Block
          title="Banderas rojas"
          description="Si sale alguna de estas frases, el punto se anota y se resuelve antes de firmar."
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-body-sm text-brand-navy py-3 pr-4 font-semibold">
                    Si escuchas
                  </th>
                  <th className="text-body-sm text-brand-navy py-3 font-semibold">
                    Qué significa
                  </th>
                </tr>
              </thead>
              <tbody>
                {BANDERAS.map((fila) => (
                  <tr
                    key={fila.escuchas}
                    className="border-b border-neutral-200"
                  >
                    <td className="text-body-sm py-3 pr-4 align-top text-neutral-700">
                      {fila.escuchas}
                    </td>
                    <td className="text-body-sm text-error py-3 align-top">
                      {fila.significa}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Block>

        <Block
          title="Pídelo en vivo, no en diapositiva"
          description="Casos de aceptación de sistema-comercial.md. Con cuatro demostrados basta para saber si el sistema existe."
        >
          <ul className="flex flex-col gap-3">
            {PRUEBAS.map((prueba) => (
              <li key={prueba} className="text-body flex gap-3 text-neutral-700">
                <span
                  aria-hidden="true"
                  className="text-brand-turquoise-text shrink-0 font-semibold"
                >
                  →
                </span>
                {prueba}
              </li>
            ))}
          </ul>
        </Block>

        <Block
          title="Lo que decides tú, no el proveedor"
          description="Siguen abiertos en CURRENT.md y se vuelven caros si se resuelven después."
        >
          <ul className="text-body flex list-disc flex-col gap-2 pl-5 text-neutral-700">
            <li>
              El texto legal del consentimiento sigue sin validar por un abogado
              colombiano.
            </li>
            <li>
              Las cuentas de GA4, Meta y TikTok siguen sin titular definido. Los
              datos de una cuenta ajena no se migran después.
            </li>
            <li>
              La base de ofertas no existe todavía: hoy las tarifas viven en el
              repo. Falta decidir quién la construye y quién es su dueño.
            </li>
          </ul>
        </Block>
      </div>
    </Section>
  );
}
