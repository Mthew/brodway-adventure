// Fixture MUTADO: familia tipográfica distinta de Manrope cargada vía
// next/font/google. Debe fallar (R-10).
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

export function usaMontserrat() {
  return montserrat.className;
}
