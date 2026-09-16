import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // ADR-0002: domain/ y application/ no pueden importar Next.js, React ni el cliente de
  // Supabase — esa es la única regla de dependencia entre capas dentro de un módulo. El
  // patrón matchea src/modules/ aunque todavía no exista: queda activa desde el día 1 de la
  // migración en vez de depender de que alguien la añada "cuando el equipo crezca".
  {
    files: [
      "src/modules/*/domain/**/*.{ts,tsx}",
      "src/modules/*/application/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["next", "next/*"],
              message:
                "domain/ y application/ no importan Next.js (ADR-0002) — eso es presentation/.",
            },
            {
              group: ["react", "react-dom"],
              message:
                "domain/ y application/ no importan React (ADR-0002) — eso es presentation/.",
            },
            {
              group: ["@supabase/*"],
              message:
                "domain/ y application/ no importan el cliente de Supabase (ADR-0002) — eso es infrastructure/.",
            },
          ],
        },
      ],
    },
  },
  // ADR-0004: identificadores de código en inglés. No hay forma genérica de detectar "esto es
  // español" por AST, así que esta es una lista mantenida a mano (mismo criterio que
  // COLUMNAS_OFERTA en lib/supabase/client.ts, ver CURRENT.md) — se amplía cada vez que un PR
  // (de un agente o de una persona) reintroduce una de estas palabras. El segundo selector
  // atrapa cualquier identificador con tilde o eñe, que en código en inglés no debería aparecer
  // nunca. Los segmentos de ruta pública en español (destinos/, ofertas/, etc., excepción de
  // ADR-0004 §2) son nombres de carpeta, no identificadores — esta regla no los toca.
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Identifier[name=/[ñáéíóúÁÉÍÓÚÑ]/]",
          message:
            "ADR-0004: identificador con tilde/eñe — el código va en inglés.",
        },
        {
          selector: `Identifier[name=/^(${[
            "destino",
            "destinos",
            "telefono",
            "ciudadOrigen",
            "vigenciaHasta",
            "validadaEl",
            "nombre",
            "ocupacionBase",
            "precioDesde",
            "fechaAproximada",
            "viajeros",
            "contacto",
            "oportunidad",
            "atribucion",
            "consentimiento",
            "guion",
            "respuestas",
            "entrar",
            "olvide",
            "restablecer",
            "acciones",
            "piezas",
            "orden",
            "revalidar",
          ].join("|")})$/]`,
          message:
            "ADR-0004: identificador en la lista de palabras en español ya detectadas en " +
            "mapeo-arquitectura-actual.md §4 — usa su traducción. Si es un caso legítimo nuevo " +
            "(falso positivo), ajusta la lista en este archivo, no silencies la regla.",
        },
      ],
    },
  },
  // arquitectura-modular.md §3: un módulo con capas colapsadas (domain+application en un solo
  // archivo, ej. demo-crm/application.ts) deja de ser trivial cuando crece. En vez de dejarlo a
  // criterio, el límite de línea da el mismo tipo de disparador objetivo que ya usa
  // plan-backoffice.md §2.2 para Server Actions (~25 líneas) — escalado porque aquí se están
  // fusionando dos capas, no una. Al superarlo, el lint falla y toca separar en
  // domain/ + application/.
  {
    files: ["src/modules/*/domain.ts", "src/modules/*/application.ts"],
    rules: {
      "max-lines": [
        "error",
        { max: 60, skipBlankLines: true, skipComments: true },
      ],
    },
  },
]);

export default eslintConfig;
