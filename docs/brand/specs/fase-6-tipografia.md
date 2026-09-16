# Spec — Fase 6 · Tipografía

> **Intent:** [`../intent.md`](../intent.md) §Fase 6 · **Fuente de marca:**
> [`../sistema-de-identidad.md`](../sistema-de-identidad.md) §4.6 y §4.7
> **Decidido y ratificado el 2026-09-11** (D-A y D-B, [`../aprobaciones.md`](../aprobaciones.md)):
> **Manrope, una sola familia**, y **Caveat sale del sistema**
> **Arquitectura:** [`../intent.md`](../intent.md) §0.bis — esta fase **no abre PR de migración
> propio**: `app/globals.css` y los dos `layout.tsx` son convención de Next.js y se quedan donde
> están hasta el paso atómico final
> **Rama:** `fase-1/marca-6-tipografia` · **PR:** a `main`, con `CURRENT.md` en el mismo PR
> **Escrito:** 2026-09-11 · **Estado:** listo para plan

## 0. Objetivo

Cerrar la única contradicción del sistema de identidad que no se resuelve leyendo los manuales: el
**manual vivo declara una familia, Manrope**, y el **manual v2.0 declara tres**, Montserrat + Lato +
Caveat, con funciones separadas. Las dos son oficiales y las dos son del cliente.

**Decidido: Manrope**, la familia del manual vivo. Con ello logo, color y tipografía pasan a venir
del mismo sistema, y Caveat —que hoy tiene cero usos en componentes— sale. La escala del manual
v2.0 se mantiene intacta: Manrope tiene los cinco pesos que la jerarquía necesita.

El spec conserva la rama descartada en §3.2, porque el registro de por qué **no** se eligió algo
vale tanto como el de lo que se eligió.

## 1. Estado verificado

Auditado el 2026-09-11, con el CSS servido por el servidor de desarrollo, no leyendo el JSX.

### 1.1 Qué se carga hoy

| Dónde | Familias | Pesos | `@font-face` generados |
|---|---|---|---|
| Sitio público (`app/[locale]/layout.tsx`) | Montserrat · Lato · Caveat | 600/700/800 · 400/700 · 700 | **26** |
| Panel (`app/admin/layout.tsx`) | Montserrat · Lato | **todos** (sin `weight`) · 400/700 | **11** |

En el build previo, las fuentes pesan **352 KB en 13 archivos `.woff2`**.

### 1.2 Una sospecha que se verificó y resultó falsa

El panel nombra sus variables de `next/font` **igual que los tokens del sistema**
(`variable: "--font-display"` y `"--font-body"`), que es exactamente la autorreferencia contra la
que advierte el comentario del sitio público: `--font-display: var(--font-montserrat), …` en
`:root` y `--font-display: "Montserrat", …` en el mismo `<html>`. Y en el panel **`--font-montserrat`
ni siquiera existe**.

Medido en el CSS servido, **el panel renderiza en Montserrat correctamente**. Funciona porque
Tailwind v4 emite sus tokens dentro de `@layer theme` y **las declaraciones sin capa ganan a las de
cualquier capa**, así que la de `next/font` se impone entera y el `var(--font-montserrat)`
indefinido nunca llega a evaluarse.

**No es un defecto, pero es una fragilidad**: el panel funciona por una regla de la cascada que
nadie eligió, y su cadena de respaldo real es la de `next/font`, no la del `@theme`. Se corrige
renombrando las variables del panel como en el sitio público — cambio de dos líneas, válido en
cualquiera de las dos ramas.

### 1.3 Lo que ya cumple el manual y no se toca

- **La escala completa** (H1 48/56 → texto pequeño 14/20, botón 16/20) está implementada en
  `app/globals.css` con `clamp()` entre el valor de móvil y el del manual.
- **El mínimo de 14 px y el interlineado 1,45** están respetados.
- **Los pesos por nivel**: H1 ExtraBold, H2/H3 Bold, H4 SemiBold, en `@layer base`.
- **Caveat tiene cero usos** en componentes: se declara en `globals.css`, se carga en el layout y no
  la usa ninguna página.

## 2. Alcance

**En cualquiera de las dos ramas** (no dependen de D-A, se pueden hacer ya):

1. **Restringir los pesos del panel** a los que usa de verdad. Hoy carga el rango variable completo
   de Montserrat para usar tres pesos.
2. **Renombrar las variables de `next/font` del panel** (§1.2), para que la cadena de respaldo sea
   la del sistema y no dependa de una regla de cascada.
3. **Declarar las alternativas de sistema** que pide el manual vivo: `Arial`, `Helvetica`,
   `sans-serif`. Hoy la cadena es `ui-sans-serif, system-ui, sans-serif`, que no es la que la marca
   declara.

**Y el cambio de familia** de §3.1.

**Fuera de alcance:** la escala, los pesos por nivel y las diez restricciones tipográficas del
manual, que valen con cualquier familia y ya están implementados · el `text-hero`, cuyo respaldo
quedó resuelto en el sistema de identidad §4.7 · cualquier cambio de tamaño «de paso».

## 3. El cambio de familia

### 3.1 Lo que se ejecuta — Manrope

**Qué cambia**

- Una sola familia en los dos layouts, con los pesos que la jerarquía necesita: **400 · 500 · 600 ·
  700 · 800**. Manrope los tiene todos, así que la escala del manual v2.0 se mantiene intacta.
- `--font-display` y `--font-body` **siguen existiendo como tokens** y apuntan a la misma familia:
  la distinción deja de ser de familia y pasa a ser de peso. No se borran, porque `@layer base` los
  usa y borrarlos obligaría a tocar cada componente.
- **Caveat se retira** (D-B: «Next Stop» deja de firmarse en cursiva). Con cero usos en componentes,
  retirarla es borrar su carga, su token `--font-accent` y su fallback. «Next Stop» conserva todas
  sus reglas: una vez por pieza, sin traducir, sin combinarse con otras frases manuscritas.
- La cadena de respaldo pasa a `Manrope, Arial, Helvetica, sans-serif`.

**Qué gana:** logo, color y tipografía vienen por fin del mismo sistema, y se cargan menos familias.

**Qué hay que vigilar:** Manrope y Montserrat tienen métricas distintas —Manrope es más estrecha y
de altura de x mayor—, así que **el mismo `font-size` no ocupa lo mismo**. Los sitios donde eso
puede romper algo están medidos y son conocidos: el titular del hero a 2 líneas máximo (Pre-Flight
§11.B), la navegación en una línea, y los botones con texto largo en móvil.

### 3.2 La alternativa que se descartó — mantener Montserrat + Lato + Caveat

No se eligió, y conviene que conste por qué: era la opción de **cero cambios de código**, pero
dejaba el sitio con una tipografía que el sistema visual vigente ya no declara. En cuanto una pieza
de marca y el sitio aparezcan juntos, la diferencia se ve.

Tenía además una limitación conocida: el manual pide SemiBold para cuerpo y **Lato no lo tiene**
—su salto es 400 → 700—, algo que hoy se disimula porque los elementos que piden SemiBold usan la
familia de títulos. Manrope sí tiene 500 y 600, así que la jerarquía del manual se puede cumplir
por primera vez tal como está escrita.

## 4. Criterios de aceptación

| # | Criterio | Cómo se verifica |
|---|---|---|
| **T-1** | El sitio y el panel cargan exactamente las familias que la marca declara, y ninguna familia se carga sin usarse | Inspección del CSS servido, no del JSX |
| **T-2** | El panel no descarga pesos que no usa | Conteo de `@font-face` antes/después |
| **T-3** | Las variables de `next/font` del panel no colisionan con los tokens del sistema | `grep` de `variable:` en los dos layouts |
| **T-4** | La cadena de respaldo es la que declara el manual vivo (`Arial`, `Helvetica`, `sans-serif`) | CSS servido |
| **T-5** | La escala, los pesos por nivel, el mínimo de 14 px y el interlineado 1,45 siguen intactos | Diff de `globals.css`: no debe tocar la escala |
| **T-6** | El titular del hero sigue en 2 líneas máximo a 375 px, la navegación en una línea y ningún botón desborda | Medición en navegador, móvil y escritorio |
| **T-7** | Caveat retirada por completo: carga, token `--font-accent` y fallback | `grep` de `caveat` y `font-accent` → cero |
| **T-8** | El peso de fuentes no sube respecto a los 352 KB actuales | Comparación del build |
| **T-9** | El LCP móvil no empeora | Lighthouse antes/después en el PR |
| **T-10** | `pnpm build` pasa, `check:marca` y `check:tokens` incluidos | CI local |

## 5. Verificación

1. **En el CSS servido, no en el código.** Toda esta fase se verifica mirando qué `@font-face` se
   emiten y qué valor acaba teniendo `--font-display`. Es la lección de §1.2: el JSX no dice la
   verdad sobre la cascada.
2. **Con el texto real y en móvil.** Un cambio de familia se juzga con el copy definitivo a 375 px:
   los titulares largos y los botones son donde primero se rompe.
3. **Medida de peso y LCP** antes y después, en el PR.

## 6. Riesgos

| Riesgo | Señal | Respuesta |
|---|---|---|
| El cliente sigue produciendo piezas en Montserrat | Una pieza nueva del diseñador en la familia antigua | La decisión está registrada y es del cliente. Si aparecen piezas en Montserrat, el problema no es el sitio: es que el manual vivo no llegó a quien diseña, y eso se resuelve enviándoselo |
| Se hace «a medias»: títulos en Manrope y cuerpo en Lato | Dos sistemas conviviendo | Prohibido explícitamente en el intent: un cambio a medias es peor que cualquiera de las dos opciones |
| Las métricas de Manrope rompen el hero o la navegación | Titular a 3 líneas, botón desbordado | T-6. Si algo no entra, se ajusta el `clamp` de ese nivel, nunca el mínimo de 14 px ni el interlineado |
| Se aprovecha para «afinar» tamaños | La escala cambia sin motivo | T-5: el diff no debe tocar la escala. La escala es del manual, no de esta fase |
| Se revoca D-B y «Next Stop» vuelve a la cursiva | Hay que reintroducir una familia | Reversible y acotado: una familia de un peso y un token. El registro de aprobaciones deja la fecha y el motivo de la decisión original |

## 7. Entregables del PR

1. Las tres correcciones de §2, que no dependen de la decisión.
2. El cambio a Manrope de §3.1, aplicado en los **dos** layouts —sitio y panel— a la vez.
3. `sistema-de-identidad.md` §5.2 y §5.3 actualizados: la contradicción deja de estar abierta.
   (Los dos ya registran la decisión; el PR confirma que el código la cumple.)
4. `/design-system` mostrando la familia real, sus pesos y la cadena de respaldo.
5. Las mediciones de peso de fuentes y LCP, antes y después, en el cuerpo del PR.
6. `CURRENT.md` actualizado en el mismo PR: la línea que avisa de que el código sigue en
   Montserrat/Lato/Caveat desaparece cuando deje de ser cierta.
