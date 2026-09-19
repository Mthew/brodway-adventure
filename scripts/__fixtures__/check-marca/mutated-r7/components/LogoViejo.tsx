// Fixture MUTADO: referencia a la firma anterior, ya retirada. Debe fallar (R-7).
//
// También dispara R-4: "logo-broway.png" contiene "broway" en minúsculas con
// límite de palabra a ambos lados (el guion antes, el punto de la extensión
// después), así que el propio nombre de archivo de la firma anterior es, a
// la vez, una grafía incorrecta del nombre bajo la Regla 4 tal como ya
// existía (N-03.5) — no es un defecto de esta regla, es una coincidencia real
// entre dos reglas mecánicas sobre el mismo texto. Ver N-07.1.json.
export function LogoViejo() {
  return <img src="/logo-broway.png" alt="BroWay Adventures" />;
}
