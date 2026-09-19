// Fixture: componente limpio, usa tokens de Tailwind, ningún hex hardcodeado.
// bg-brand-navy + text-white (no bg-brand-orange/turquoise): cumple R-6.
export function Button() {
  return <button className="bg-brand-navy text-white">Reservar</button>;
}
