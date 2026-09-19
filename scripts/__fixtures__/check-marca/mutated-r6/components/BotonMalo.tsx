// Fixture MUTADO: "text-white" convive con "bg-brand-orange" en la misma
// lista de clases (2.36:1, no llega a 3:1). Debe fallar (R-6).
export function BotonMalo() {
  return <button className="bg-brand-orange text-white">Reservar</button>;
}
