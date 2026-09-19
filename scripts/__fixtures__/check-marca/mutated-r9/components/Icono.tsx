// Fixture MUTADO: icono de un paquete ajeno y weight distinto de "regular".
// Debe fallar (R-9) por las dos razones a la vez.
//
// `lucide-react` no está instalado en el repo (a propósito: no debería
// estarlo nunca, ver CLAUDE.md e instrucciones del nodo) — el
// `@ts-expect-error` sólo silencia el error de tipos del fixture para que
// `pnpm build` compile; check-marca.mjs detecta el import por texto, no por
// resolución de módulos, así que la regla se prueba igual.
// @ts-expect-error — paquete de iconos ajeno, instalado a propósito nunca.
import { Star } from "lucide-react";
import { Check } from "@phosphor-icons/react/dist/ssr";

export function Icono() {
  return (
    <>
      <Star />
      <Check weight="bold" />
    </>
  );
}
