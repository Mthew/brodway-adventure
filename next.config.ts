import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Fotografía de relleno mientras no haya banco de imágenes propio
      // (brief-v0.md §2 la autoriza explícitamente). Al llegar las fotos reales
      // esto se quita: en producción no debe quedar ningún host externo.
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default withNextIntl(nextConfig);
