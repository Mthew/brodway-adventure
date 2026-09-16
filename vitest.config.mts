import { defineConfig } from "vitest/config";

// ADR-0002 hallazgo 4: "pnpm build" (tipos) no verifica que una regla de negocio sea correcta,
// solo que compile. Este runner corre `pnpm test`, y su umbral de cobertura corre aparte con
// `pnpm test:coverage` (ver ADR-0005 §5 — el segundo es el gate exigido en PRs que tocan
// domain/ o application/, no en cada build local: instrumentar cobertura es más caro que correr
// los tests, y no hace falta pagarlo en cada guardado).
//
// `include`/coverage.include apuntan a src/modules/**, que todavía no existe (ADR-0001/0005):
// igual que la regla de ESLint de ADR-0002, no falla por ausencia de archivos — se activa sola
// en cuanto el primer módulo migra y trae su primer test.
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    passWithNoTests: true,
    coverage: {
      provider: "v8",
      include: ["src/modules/*/domain/**", "src/modules/*/domain.ts"],
      // application/ hoy queda fuera del umbral: orquesta infrastructure/ (I/O real), así que
      // su valor se prueba con integración, no con el mismo umbral de unit tests que domain/
      // (reglas puras). Si en el futuro se agregan tests de integración para application/, este
      // umbral es el lugar para sumarlos — no antes, sería exigir cobertura de un tipo de test
      // que todavía no existe en el repo.
      thresholds: {
        lines: 90,
        statements: 90,
        branches: 85,
        functions: 90,
      },
      reporter: ["text", "html"],
    },
  },
});
