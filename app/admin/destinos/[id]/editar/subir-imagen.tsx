"use client";

import { createBrowserClient } from "@supabase/ssr";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Error as ErrorFormulario } from "@/app/admin/piezas";
import type { Database } from "@/lib/supabase/database.types";

/** Las dos fotos únicas de un destino: la de tarjeta (listados) y la de cabecera (hero). */
export type CampoImagenDestino = "imagen" | "imagen_hero";

const ETIQUETAS: Record<CampoImagenDestino, { titulo: string; aspecto: string }> = {
  imagen: { titulo: "Foto de tarjeta", aspecto: "aspect-[4/3]" },
  imagen_hero: { titulo: "Foto de cabecera", aspecto: "aspect-[16/9]" },
};

/**
 * Sube (o reemplaza) una de las dos fotos únicas del destino: `imagen` (tarjeta de
 * listado) o `imagen_hero` (cabecera de `/destinos/[slug]`).
 *
 * Mismo patrón que `ofertas/[id]/fotos/subir.tsx`: sube directo del navegador a
 * Storage, sin pasar por una Server Action (el cuerpo de una petición en Vercel no
 * aguanta una foto de teléfono). La diferencia es que aquí es un slot único, no una
 * galería: no hay tabla `imagenes` de por medio, se escribe directo en la columna que
 * indique `campo`. Sin esto, un destino creado desde el panel nace con tarjeta pero
 * nunca con cabecera — el asistente rápido no la pedía y no había dónde subirla.
 */
export function SubirImagenDestino({
  destinoId,
  slug,
  campo,
  valorActual,
}: {
  destinoId: string;
  slug: string;
  campo: CampoImagenDestino;
  valorActual: string | null;
}) {
  const router = useRouter();
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string>();
  const { titulo, aspecto } = ETIQUETAS[campo];

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );

  async function subir(archivo: File) {
    setSubiendo(true);
    setError(undefined);

    try {
      const extension = archivo.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const ruta = `destinos/${destinoId}/${slug}-${campo}.${extension}`;

      const { error: errorSubida } = await supabase.storage
        .from("catalogo")
        .upload(ruta, archivo, { upsert: true, contentType: archivo.type });
      if (errorSubida) throw new Error(errorSubida.message);

      const { data } = supabase.storage.from("catalogo").getPublicUrl(ruta);

      // Clave literal, no computada: Supabase rechaza un `update` con índice dinámico
      // (misma fricción que documentó `lib/admin/orden.ts` para `.from(tabla)`).
      const actualizacion =
        campo === "imagen" ? { imagen: data.publicUrl } : { imagen_hero: data.publicUrl };

      const { error: errorFila } = await supabase
        .from("destinos")
        .update(actualizacion)
        .eq("id", destinoId);
      if (errorFila) throw new Error(errorFila.message);

      router.refresh();
    } catch (e) {
      setError(
        e instanceof Error ? `No se pudo subir: ${e.message}` : "No se pudo subir la foto.",
      );
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-body-sm font-display font-semibold text-neutral-700">{titulo}</p>

      <ErrorFormulario mensaje={error} />

      {valorActual ? (
        <div className={`relative w-full overflow-hidden rounded-lg bg-neutral-100 ${aspecto}`}>
          <Image src={valorActual} alt="" fill sizes="100vw" className="object-cover" />
        </div>
      ) : null}

      <label className="text-body-sm flex min-h-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-neutral-300 bg-white px-4 text-center text-neutral-600">
        <span className="font-display font-semibold text-neutral-800">
          {subiendo ? "Subiendo…" : valorActual ? "Reemplazar foto" : "Añadir foto"}
        </span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          disabled={subiendo}
          className="sr-only"
          onChange={(e) => {
            const archivo = e.target.files?.[0];
            if (archivo) subir(archivo);
            e.target.value = "";
          }}
        />
      </label>
    </div>
  );
}
