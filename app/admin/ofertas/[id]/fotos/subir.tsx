"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { BotonPrincipal, Error as ErrorFormulario } from "@/app/admin/piezas";
import type { Database } from "@/lib/supabase/database.types";

import { comprimirImagen } from "./comprimir";

/**
 * Subida de fotos.
 *
 * Sube desde el NAVEGADOR directo a Supabase Storage, no a través de una Server Action.
 * Una acción de servidor tendría que recibir el archivo entero como FormData, y en
 * Vercel el cuerpo de una petición está limitado: un par de fotos de teléfono modernas
 * lo revientan. Subiendo desde el cliente el archivo nunca pasa por nuestro servidor y
 * el límite es el del bucket (10 MB por archivo).
 *
 * Antes de subir se COMPRIME (`comprimir.ts`): redimensiona al lado mayor a ~2000px y
 * recodifica a WebP. El nombre y el `contentType` se derivan del archivo que la
 * compresión REALMENTE devuelve (normalmente `.webp`, salvo el fallback raro en que
 * devuelve el original sin tocar) — nunca se fijan a ciegas, porque etiquetar bytes de
 * otro formato como WebP rompe la decodificación en vez de solo perder la optimización.
 */
export function SubirFotos({
  ofertaId,
  slug,
  desde,
}: {
  ofertaId: string;
  slug: string;
  /** Cuántas imágenes ya existen, para seguir numerando. */
  desde: number;
}) {
  const router = useRouter();
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string>();

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );

  async function subir(archivos: FileList) {
    setSubiendo(true);
    setError(undefined);

    try {
      for (const [i, archivo] of Array.from(archivos).entries()) {
        const comprimido = await comprimirImagen(archivo);
        const extension = comprimido.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const nombre = `${slug}-${desde + i + 1}.${extension}`;
        const ruta = `ofertas/${ofertaId}/${nombre}`;

        const { error: errorSubida } = await supabase.storage
          .from("catalogo")
          .upload(ruta, comprimido, { upsert: true, contentType: comprimido.type });

        if (errorSubida) throw new Error(errorSubida.message);

        const { data } = supabase.storage.from("catalogo").getPublicUrl(ruta);

        const { error: errorFila } = await supabase.from("imagenes").insert({
          oferta_id: ofertaId,
          url: data.publicUrl,
          orden: desde + i,
        });

        if (errorFila) throw new Error(errorFila.message);
      }

      router.refresh();
    } catch (e) {
      setError(
        e instanceof Error
          ? `No se pudo subir: ${e.message}`
          : "No se pudo subir la foto.",
      );
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <ErrorFormulario mensaje={error} />

      <label className="text-body-sm flex min-h-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-neutral-300 bg-white px-4 text-center text-neutral-600">
        <span className="font-display font-semibold text-neutral-800">
          {subiendo ? "Comprimiendo y subiendo…" : "Añadir fotos"}
        </span>
        <span>Puedes elegir varias a la vez.</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          disabled={subiendo}
          className="sr-only"
          onChange={(e) => {
            if (e.target.files?.length) subir(e.target.files);
            e.target.value = "";
          }}
        />
      </label>
    </div>
  );
}

export function SeguirASecciones({ ofertaId }: { ofertaId: string }) {
  const router = useRouter();
  return (
    <BotonPrincipal
      type="button"
      onClick={() => router.push(`/admin/ofertas/${ofertaId}/secciones`)}
    >
      Seguir a secciones
    </BotonPrincipal>
  );
}
