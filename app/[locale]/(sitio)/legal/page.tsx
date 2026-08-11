import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { Section } from "@/components/ui/section";
import { POLICY_VERSION } from "@/lib/consent";
import { CONTACT, RNT_NUMBER } from "@/lib/config";

/**
 * Página legal.
 *
 * ⚠️ TODO: TODO EL TEXTO LEGAL DE ESTA PÁGINA ES UNA ESTRUCTURA DE RELLENO.
 * Debe ser redactado y validado por un abogado colombiano antes de publicar.
 * No se redactan aquí cláusulas definitivas: el riesgo legal es real.
 *
 * La versión en español es la legalmente vinculante; la traducción al inglés es
 * informativa y no la sustituye (spec-tecnica.md §3.7).
 */

export const metadata: Metadata = {
  title: "Información legal",
  description:
    "Política de tratamiento de datos personales, términos y condiciones, política de cancelación, RNT y aviso ESCNNA de BroWay Adventures.",
};

const SECTIONS = [
  { id: "datos", titulo: "1. Política de tratamiento de datos personales" },
  { id: "terminos", titulo: "2. Términos y condiciones" },
  { id: "cancelacion", titulo: "3. Política de cancelación y cambios" },
  { id: "escnna", titulo: "4. Aviso ESCNNA" },
  { id: "rnt", titulo: "5. Registro Nacional de Turismo" },
  { id: "rne", titulo: "6. Registro de Números Excluidos" },
] as const;

/** TODO: fecha real de entrada en vigencia, definida con el abogado. */
const POLICY_DATE = "por definir";

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Section>
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
        {/*
          En móvil el índice va DESPUÉS del título: una tabla de contenidos antes
          del encabezado deja al lector sin saber qué está a punto de leer.
        */}
        <nav
          aria-label="Secciones"
          className="order-2 lg:order-1 lg:sticky lg:top-28 lg:h-fit lg:w-64 lg:shrink-0"
        >
          <ul className="flex flex-col gap-2">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-body-sm hover:text-brand-navy text-neutral-600"
                >
                  {section.titulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="order-1 flex max-w-2xl flex-col gap-10 lg:order-2">
          <header className="flex flex-col gap-3">
            <h1 className="text-h1 text-brand-navy">Información legal</h1>
            <p className="text-body-sm text-neutral-600">
              Política de tratamiento de datos — versión {POLICY_VERSION},
              vigente desde {POLICY_DATE}.
            </p>
            <p className="text-body-sm bg-surface-alt rounded-md p-4 text-neutral-700">
              La versión en <strong>español</strong> es la legalmente vinculante.
              Cualquier traducción a otro idioma es informativa y no la sustituye.
            </p>
          </header>

          <section id="datos" className="flex flex-col gap-3">
            <h2 className="text-h2 text-brand-navy">{SECTIONS[0].titulo}</h2>
            <p className="text-body text-neutral-700">
              [PENDIENTE DE REDACCIÓN LEGAL] Esta sección debe declarar: el
              responsable del tratamiento y sus datos de contacto; las finalidades
              del tratamiento —gestionar la solicitud, elaborar cotizaciones, hacer
              seguimiento, enviar información comercial y publicidad
              personalizada—; los derechos del titular a conocer, actualizar,
              rectificar y suprimir sus datos y a revocar la autorización; el canal
              y el procedimiento para ejercerlos; y el aviso de transferencia
              internacional, ya que el CRM está alojado fuera de Colombia.
            </p>
            <p className="text-body-sm text-neutral-600">
              Canal para ejercer derechos: {CONTACT.email}
            </p>
          </section>

          <section id="terminos" className="flex flex-col gap-3">
            <h2 className="text-h2 text-brand-navy">{SECTIONS[1].titulo}</h2>
            <p className="text-body text-neutral-700">
              [PENDIENTE DE REDACCIÓN LEGAL] Condiciones de la prestación del
              servicio de intermediación turística, alcance de la asesoría,
              responsabilidades del viajero y de la agencia, y condiciones de las
              tarifas publicadas.
            </p>
          </section>

          <section id="cancelacion" className="flex flex-col gap-3">
            <h2 className="text-h2 text-brand-navy">{SECTIONS[2].titulo}</h2>
            <p className="text-body text-neutral-700">
              [PENDIENTE DE REDACCIÓN LEGAL] Plazos, penalidades y procedimiento
              para cancelaciones y cambios, diferenciando lo que depende de la
              agencia de lo que depende del operador o mayorista.
            </p>
          </section>

          <section id="escnna" className="flex flex-col gap-3">
            <h2 className="text-h2 text-brand-navy">{SECTIONS[3].titulo}</h2>
            <p className="text-body text-neutral-700">
              BroWay Adventures rechaza la explotación sexual comercial de niñas,
              niños y adolescentes. En cumplimiento de la Ley 679 de 2001 y sus
              normas concordantes, advertimos que dicha conducta es sancionada
              penal y administrativamente en Colombia.
            </p>
          </section>

          <section id="rnt" className="flex flex-col gap-3">
            <h2 className="text-h2 text-brand-navy">{SECTIONS[4].titulo}</h2>
            <p className="text-body text-neutral-700">
              BroWay Adventures opera bajo el Registro Nacional de Turismo número{" "}
              <strong>{RNT_NUMBER}</strong>. Puedes verificarlo en el registro
              público del Ministerio de Comercio, Industria y Turismo. Te
              recomendamos hacerlo con cualquier agencia antes de pagar.
            </p>
          </section>

          <section id="rne" className="flex flex-col gap-3">
            <h2 className="text-h2 text-brand-navy">{SECTIONS[5].titulo}</h2>
            <p className="text-body text-neutral-700">
              Desde abril de 2024, el Registro de Números Excluidos permite a
              cualquier persona en Colombia excluirse de recibir mensajes
              comerciales o publicitarios por aplicaciones de mensajería, correo
              electrónico y llamadas. Respetamos esa exclusión.
            </p>
            <p className="text-body text-neutral-700">
              Enviar un formulario en este sitio no equivale a autorizar campañas
              indefinidas por todos los canales: puedes revocar tu autorización o
              pedir que dejemos de contactarte en cualquier momento escribiendo a{" "}
              {CONTACT.email}.
            </p>
          </section>
        </div>
      </div>
    </Section>
  );
}
