// ADR-0002 / ADR-0001: reglas de dependencia ENTRE módulos que ESLint no puede expresar
// (no-restricted-imports es un patrón estático por carpeta, no puede comparar "¿el módulo de
// origen es el mismo que el de destino?"). Este archivo es el guardrail determinista para lo
// que antes se revisaba "a ojo" (arquitectura-modular.md §2). Corre con `pnpm check:deps`,
// incluido en `pnpm check` → `pnpm build`.
//
// Los patrones apuntan a `src/modules/**` aunque esa carpeta todavía no exista (ADR-0001/0005:
// migración incremental) — igual que la regla de ESLint de ADR-0002, queda dormido sin fallar
// hasta que el primer módulo migre, y se activa solo.

/** @type {import('dependency-cruiser').IConfiguration} */
export default {
  forbidden: [
    {
      name: "no-circular",
      comment:
        "Dos módulos no pueden depender entre sí en ambos sentidos (arquitectura-modular.md " +
        "§2: 'destinations → offers' está permitido, 'offers → destinations' además crearía un " +
        "ciclo). Antes de esta regla el chequeo era manual; con 6 módulos ya no escala a ojo.",
      severity: "error",
      from: {},
      to: { circular: true },
    },
    {
      name: "no-cross-module-internals",
      comment:
        "Un módulo solo puede importar la application/ (o el application.ts colapsado, ver " +
        "arquitectura-modular.md §3) de OTRO módulo — nunca su domain/, infrastructure/ ni " +
        "presentation/. Ir hacia domain/infrastructure/presentation de otro módulo salta la " +
        "capa que ese módulo expone como pública y acopla los dos por su interior. Usa group " +
        "matching de dependency-cruiser ($1/$2 capturados en from.path, referenciados en " +
        "to.path) para comparar 'mismo módulo vs. otro módulo' sin listar los 6 módulos a mano.",
      severity: "error",
      from: { path: "^(src/modules/)([^/]+)/" },
      to: {
        path: "^$1(?!$2/)[^/]+/(domain|infrastructure|presentation)/",
      },
    },
    {
      name: "no-presentation-skipping-application",
      comment:
        "presentation/ no puede importar infrastructure/ directamente, ni de su propio módulo " +
        "ni de otro — tiene que pasar por application/ (ADR-0002: la cadena real es " +
        "presentation/ → application/ → infrastructure/ → domain/, corregida el 2026-09-15; " +
        "antes de la corrección el texto y el diagrama se contradecían entre sí).",
      severity: "error",
      from: { path: "^src/modules/[^/]+/presentation/" },
      to: { path: "/infrastructure/" },
    },
    {
      name: "no-domain-importing-siblings",
      comment:
        "domain/ es la hoja del grafo: no importa ni siquiera su propia application/, " +
        "infrastructure/ o presentation/ (ADR-0002). Complementa la regla de ESLint " +
        "no-restricted-imports, que solo bloquea imports de framework, no de capas hermanas.",
      severity: "error",
      from: { path: "^(src/modules/[^/]+/)domain/" },
      to: {
        path: "^$1(application|infrastructure|presentation)/",
      },
    },
  ],
  options: {
    // Hallazgo de N-01.0b: sin esto, `depcruise src` sigue resolviendo hacia
    // `node_modules` (Next.js, Supabase…) y reporta CIENTOS de "no-circular" que no
    // tienen nada que ver con este repo — el propio código interno de esos paquetes
    // tiene ciclos. La regla `no-circular` de este archivo es sobre `src/**`, no
    // sobre las dependencias de terceros, así que `depcruise` nunca debió atravesarlas.
    // Quedó sin detectar hasta ahora porque `pnpm check:deps` sólo corre `if [ -d src
    // ]`, y `src/` no existía todavía cuando se escribió este archivo (ADR-0002).
    doNotFollow: { path: "node_modules" },
    exclude: { path: "node_modules" },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: "tsconfig.json" },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default", "types"],
    },
  },
};
