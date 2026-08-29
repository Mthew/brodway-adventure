import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Avance } from "@/app/admin/piezas";
import { getSupabaseAdmin, getUsuarioAdmin } from "@/lib/supabase/admin";

import { FormularioPublicar } from "./formulario";

/**
 * Paso 4: revisar y publicar.
 *
 * Enseña la oferta como la verá el visitante, no como filas de base de datos, y sobre
 * todo enseña lo que LE FALTA. Publicar es la validación humana de la tarifa, así que
 * la pantalla anterior a ese botón tiene que dejar ver qué se está afirmando.
 */
export default async function PublicarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const usuario = await getUsuarioAdmin();
  if (!usuario) redirect("/admin/entrar");

  const { id } = await params;
  const supabase = await getSupabaseAdmin();

  const { data: oferta } = await supabase
    .from("ofertas")
    .select("*, destinos(nombre)")
    .eq("id", id)
    .maybeSingle();

  if (!oferta) notFound();

  const { data: imagenes } = await supabase
    .from("imagenes")
    .select("url")
    .eq("oferta_id", id)
    .order("orden")
    .limit(1);

  const portada = imagenes?.[0]?.url;

  /*
   * Los huecos que impiden publicar, en el idioma de quien los tiene que arreglar.
   * Cada uno con el enlace al paso donde se resuelve: decir "falta una foto" sin decir
   * dónde ponerla es la mitad del trabajo.
   */
  const faltantes: { texto: string; paso: string; ruta: string }[] = [];
  if (!portada) {
    faltantes.push({ texto: "No tiene ninguna foto", paso: "Fotos", ruta: "fotos" });
  }
  if (!oferta.beneficio_corto) {
    faltantes.push({
      texto: "Le falta la línea que la describe",
      paso: "Transcribir",
      ruta: "fotos",
    });
  }
  if (oferta.incluye.length === 0) {
    faltantes.push({
      texto: "No dice qué incluye",
      paso: "Transcribir",
      ruta: "fotos",
    });
  }
  if (
    !oferta.mostrar_en_mejores_ofertas &&
    !oferta.mostrar_en_playas_y_hoteles &&
    !oferta.mostrar_en_home
  ) {
    faltantes.push({
      texto: "No está en ninguna sección: nadie la encontraría",
      paso: "Secciones",
      ruta: "secciones",
    });
  }

  const puedePublicar = !!portada;
  const precio = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: oferta.moneda,
    maximumFractionDigits: 0,
  }).format(oferta.precio_desde);

  return (
    <div className="flex min-h-svh flex-col">
      <div className="flex flex-1 flex-col gap-5 px-5 pt-4 pb-6">
        <Avance paso={4} ofertaId={id} />

        <h1 className="text-h3 font-display">Revisa antes de publicar</h1>

        {faltantes.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {faltantes.map((falta) => (
              <li
                key={falta.texto}
                className="text-body-sm flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900"
              >
                <span>{falta.texto}</span>
                <Link
                  href={`/admin/ofertas/${id}/${falta.ruta}`}
                  className="inline-flex min-h-11 shrink-0 items-center font-semibold underline"
                >
                  {falta.paso}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        {/* Vista previa: lo que el visitante va a ver. */}
        <div className="bg-surface-base overflow-hidden rounded-lg border border-neutral-200">
          {portada ? (
            <div className="relative aspect-[4/3] w-full bg-neutral-100">
              <Image src={portada} alt="" fill sizes="100vw" className="object-cover" />
            </div>
          ) : (
            <div className="text-body-sm flex aspect-[4/3] items-center justify-center bg-neutral-100 text-neutral-500">
              Sin foto
            </div>
          )}
          <div className="flex flex-col gap-2 p-4">
            <p className="text-caption text-brand-turquoise-text font-semibold">
              {(oferta.destinos as { nombre: string } | null)?.nombre}
            </p>
            <h2 className="text-h3 font-display">{oferta.titulo}</h2>
            {oferta.beneficio_corto ? (
              <p className="text-body-sm text-neutral-600">{oferta.beneficio_corto}</p>
            ) : null}
            <p className="text-caption text-neutral-700">
              desde <span className="text-body font-semibold">{precio}</span> por persona
            </p>
            {/*
              Estos dos datos van pegados al precio también aquí, no sólo en el sitio:
              quien publica tiene que ver la misma frase completa que verá el visitante.
            */}
            <p className="text-caption text-neutral-600">
              Saliendo desde {oferta.ciudad_origen} · Ocupación {oferta.ocupacion_base}
            </p>
            <p className="text-caption text-neutral-600">
              Vale hasta el {oferta.vigencia_hasta}
            </p>
          </div>
        </div>
      </div>

      <FormularioPublicar ofertaId={id} puedePublicar={puedePublicar} />
    </div>
  );
}
