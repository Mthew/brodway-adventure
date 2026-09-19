import path from "node:path";
import { imageSize } from "image-size";
import { imageSizeFromFile } from "image-size/fromFile";

/**
 * `openGraph.images` por página, con dimensiones REALES.
 *
 * fase-2-la-firma.md §4.4: "declarar el tamaño real evita que el scraper la recorte
 * mal". No se puede asumir 1200×630 (ni ningún otro valor fijo) para la foto de una
 * oferta, un destino o una campaña: son fotos subidas desde el panel sin normalizar
 * (`comprimirImagen` en `src/modules/offers/presentation/admin/fotos/comprimir.ts`
 * solo topa el lado mayor a 2000px, no fija un ratio) o imágenes del repo con
 * proporciones distintas entre sí (hero 1920×1080, tarjeta 1000×750, galería
 * 600×600 — medido con Pillow el 2026-09-18). El ancho/alto se miden del ARCHIVO
 * real en cada `generateMetadata`, no se guardan en la base porque ninguna tabla
 * los tiene hoy.
 */
export type OgImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

/**
 * Imagen social por defecto (N-02.4, `app/[locale]/layout.tsx`).
 *
 * Vive aquí y no inline en el layout para que las páginas con foto propia (N-02.5)
 * puedan caer en ELLA —no en "sin imagen"— cuando su registro no tiene foto: Next.js
 * hace *shallow merge* de `metadata` por segmento (`generate-metadata.md` §Merging:
 * "All openGraph fields ... are replaced"), así que en cuanto una página declara su
 * propio `openGraph`, el `openGraph.images` del layout padre desaparece ENTERO, no
 * se combina con el suyo. Sin este fallback explícito, una oferta sin fotos
 * publicaría una tarjeta sin imagen en vez de heredar la genérica.
 */
export const DEFAULT_OG_IMAGE: OgImage = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "Firma de BroWay Adventures sobre fondo navy de marca.",
};

/**
 * Mide el archivo real y arma el objeto de `openGraph.images`.
 *
 * `src` puede ser una ruta relativa a `public/` (fotos del repo, ej.
 * `/destinos/cartagena-hero.webp`) o una URL absoluta de Supabase Storage (fotos
 * subidas desde el panel, ej.
 * `https://<proyecto>.supabase.co/storage/v1/object/public/catalogo/...`) — el mismo
 * campo (`Offer.imagenes[].url`, `Destination.imagen`/`imagenHero`,
 * `Campaign.imagen`) trae los dos orígenes indistintamente.
 *
 * Devuelve `null` si falta la foto, si el archivo no se puede leer (borrado del
 * bucket, red caída) o si no se le puede leer cabecera de imagen válida — nunca
 * lanza: un dato de imagen roto no debe tumbar la página ni el build. El llamador
 * decide el respaldo (`DEFAULT_OG_IMAGE`).
 */
export async function buildOgImage(
  src: string | undefined | null,
  alt: string,
): Promise<OgImage | null> {
  if (!src) return null;

  const dimensiones = await medirImagen(src);
  if (!dimensiones) return null;

  return { url: src, alt, ...dimensiones };
}

async function medirImagen(
  src: string,
): Promise<{ width: number; height: number } | null> {
  try {
    if (/^https?:\/\//.test(src)) {
      const respuesta = await fetch(src);
      if (!respuesta.ok) return null;

      const buffer = new Uint8Array(await respuesta.arrayBuffer());
      const { width, height } = imageSize(buffer);
      return width && height ? { width, height } : null;
    }

    // Ruta relativa a `public/` — misma convención que sirve el archivo en runtime.
    const rutaAbsoluta = path.join(process.cwd(), "public", src);
    const { width, height } = await imageSizeFromFile(rutaAbsoluta);
    return width && height ? { width, height } : null;
  } catch {
    return null;
  }
}
