import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

const nextConfig: NextConfig = {
  /*
   * Ya no hay `images.remotePatterns`, y es a propósito.
   *
   * Estaba abierto a `picsum.photos` mientras la fotografía era de relleno
   * aleatorio. Ahora todas las imágenes viven en `public/destinos/`, así que
   * la lista queda vacía y eso mismo actúa de cierre: cualquier `<Image>` que
   * apunte a un host externo falla en build en vez de colarse a producción.
   *
   * Las fotos actuales son de Unsplash y NO son del cliente: hay que
   * sustituirlas por fotografía propia antes de publicar (ver `CURRENT.md`).
   */
};

export default withNextIntl(nextConfig);
