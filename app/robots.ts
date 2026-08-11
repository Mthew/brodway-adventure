import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /**
       * `/lp/` son landings de pauta: no se indexan para no competir con las
       * páginas de destino en SEO. `/design-system` y `/demo-crm` son
       * documentación interna y `/gracias` es una confirmación post-lead
       * (brief-v0-producto.md §9.8).
       */
      disallow: ["/design-system", "/demo-crm", "/gracias", "/lp/", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
