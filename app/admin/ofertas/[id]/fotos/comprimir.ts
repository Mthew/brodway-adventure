/**
 * Compresión de fotos en el NAVEGADOR, antes de subirlas.
 *
 * Vive junto a `subir.tsx` y no en `lib/admin/imagenes.ts` a propósito: usa `document`,
 * `Image` y `canvas`, que solo existen en el navegador, y `lib/admin/**` tiene que seguir
 * siendo código Node-safe que las Server Actions puedan importar sin arrastrar APIs de
 * navegador. Lo que sí es server-side (portada, ALT, borrado) sí vive en
 * `lib/admin/imagenes.ts`.
 *
 * Corre en el navegador porque las transformaciones de imagen de Supabase Storage
 * requieren plan Pro (`plan-backoffice.md` §3) — esto es gratis, sin dependencias nuevas
 * (Canvas API nativo), y además quita carga al bucket antes de que el archivo salga del
 * dispositivo.
 */

/** Lado mayor tras redimensionar. Preserva el aspecto. */
const LADO_MAYOR_MAXIMO = 2000;

/**
 * Calidad de codificación WebP.
 *
 * 0.82: por debajo de ~0.75 empiezan a verse artefactos de bloque en cielos y piel a
 * 2000px de lado; por encima de ~0.85 el peso sube sin ganancia visible perceptible.
 * Combinado con el tope de 2000px, deja una foto de 12 MB de móvil (que suele venir en
 * 3000-4000px de lado mayor) muy por debajo de los 500 KB del "Hecho cuando" de la Fase 3
 * — verificar con una foto real antes de cerrar la fase, no basta con esta estimación.
 */
const CALIDAD_WEBP = 0.82;

function cargarImagen(url: string): Promise<HTMLImageElement> {
  return new Promise((resolver, rechazar) => {
    const imagen = new Image();
    imagen.onload = () => resolver(imagen);
    imagen.onerror = () => rechazar(new Error("No se pudo leer la imagen."));
    imagen.src = url;
  });
}

/**
 * Redimensiona al lado mayor a `LADO_MAYOR_MAXIMO` y recodifica a WebP.
 *
 * Si algo falla (navegador sin Canvas 2D, `toBlob` devuelve `null`), devuelve el
 * archivo ORIGINAL sin comprimir y SIN RECODIFICAR — la subida no debe bloquearse por
 * esto. Por eso el llamador (`subir.tsx`) tiene que derivar extensión/`contentType` del
 * archivo que esta función realmente devuelve, no asumir que siempre es WebP.
 */
export async function comprimirImagen(archivo: File): Promise<File> {
  const url = URL.createObjectURL(archivo);

  try {
    const imagen = await cargarImagen(url);

    const escala = Math.min(
      1,
      LADO_MAYOR_MAXIMO / Math.max(imagen.naturalWidth, imagen.naturalHeight),
    );
    const ancho = Math.round(imagen.naturalWidth * escala);
    const alto = Math.round(imagen.naturalHeight * escala);

    const canvas = document.createElement("canvas");
    canvas.width = ancho;
    canvas.height = alto;

    const contexto = canvas.getContext("2d");
    if (!contexto) return archivo;

    contexto.drawImage(imagen, 0, 0, ancho, alto);

    const blob = await new Promise<Blob | null>((resolver) =>
      canvas.toBlob(resolver, "image/webp", CALIDAD_WEBP),
    );
    if (!blob) return archivo;

    const nombre = archivo.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], nombre, { type: "image/webp" });
  } finally {
    URL.revokeObjectURL(url);
  }
}
