import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

/**
 * Host de Supabase Storage, derivado de la URL del proyecto.
 *
 * Se deriva en vez de escribirse a mano para que un proyecto distinto (otro entorno,
 * otra cuenta) no obligue a acordarse de tocar este archivo: la variable ya existe y
 * es la misma que usa el cliente.
 */
const hostSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    /*
     * La lista se mantiene lo más corta posible a propósito: un `<Image>` que apunte
     * a un host no declarado FALLA, y ese fallo es la barrera que impide que una foto
     * de un tercero se cuele a producción sin que nadie lo decida.
     *
     * Sólo entra el bucket `catalogo` de Supabase Storage, que es donde el backoffice
     * sube las fotos de ofertas y destinos. Sin esta entrada, la pantalla de fotos del
     * panel se cae con "Invalid src prop" en cuanto se sube la primera imagen.
     *
     * Las fotos de `public/destinos/` son de Unsplash y NO son del cliente: hay que
     * sustituirlas por fotografía propia antes de publicar (ver `CURRENT.md`).
     */
    remotePatterns: hostSupabase
      ? [
          {
            protocol: "https",
            hostname: hostSupabase,
            pathname: "/storage/v1/object/public/catalogo/**",
          },
        ]
      : [],
  },
};

export default withNextIntl(nextConfig);
