# BroWay Adventures — Plan de implementación del backoffice (E3)

> **Qué es.** El orden de ejecución para completar el panel administrativo hasta el alcance v1 de
> [`backoffice-features.md`](backoffice-features.md) §9, con la arquitectura de código que lo
> sostiene. Es el equivalente de [`plan-fase-1.md`](plan-fase-1.md) §4, pero para E3.
>
> **Qué no es.** No redefine el alcance: el qué sigue viviendo en `backoffice-features.md` y en
> [`estructura-funcional-cliente.md`](estructura-funcional-cliente.md). No decide la frontera
> "base de ofertas vs. capa de publicación" (§6 de aquí), que sigue abierta.
>
> Fecha de redacción: **5 de septiembre de 2026**. Última verificación completa contra el código:
> **6 de septiembre de 2026** — Fases 0 a 4 cerradas y verificadas (§1, §4, §7). El estado del día
> vive en [`CURRENT.md`](../../CURRENT.md); si al leer esto §1 ya no coincide con el código,
> actualiza §1 antes de usar §4 como guía.

---

## 1. Estado real, verificado en el código

**Actualizado el 6 de septiembre de 2026.** Las Fases 0 a 4 (§4) están construidas y verificadas
en navegador con datos reales — no solo leyendo el código. Quedan exactamente dos huecos, los dos
documentados y con dueño: el borrado real del objeto de Storage (paso manual pendiente, §5) y
`mayorista` no obligatorio para publicar (decisión de producto ya tomada, §7). Todo lo demás del
alcance v1 de `backoffice-features.md` §9 tiene pantalla en `/admin`.

| Alcance v1 (§9 de `backoffice-features.md`) | Base de datos | Panel `/admin` |
|---|---|---|
| Destinos: 3 categorías, destacado, orden, estado, crear | ✅ | ✅ completo (Fase 2) |
| Ofertas: campos de §25 | ✅ | ✅ completo, incluida la sección avanzada plegable (Fase 4) |
| Los cinco campos de §6 | ✅ | ✅ `mayorista`/`notas_internas` se escriben desde el asistente (Fase 4) — `mayorista` no es obligatorio para publicar, decisión explícita (§7) |
| Colecciones: 3 flags + orden | ✅ | ✅ completo |
| Vigencia: fechas | ✅ | ✅ |
| Vigencia: activar/desactivar manual | ✅ (`estado_oferta`) | ✅ vencer/reactivar desde el panel (Fase 1) |
| Vigencia: vista de vencidas / por vencer | — | ✅ tres grupos en el dashboard: sin terminar, vigentes (con "por vencer" ≤15 días), vencidas |
| Imágenes: subida | ✅ | ✅ |
| Imágenes: optimización automática (§28) | — | ✅ comprimida en el navegador a WebP <500 KB antes de subir (Fase 3) |
| Imágenes: galería reordenable | ✅ (`orden`) | ✅ botones ↑/↓ + "Usar como portada" |
| Imágenes: ALT editable (§29) | ✅ (`imagenes.alt`) | ✅ editable con sugerencia automática, propagado al sitio público (Fase 3) |
| Webhook de revalidación (§5.2) | — | ✅ `revalidarOferta`/`revalidarDestino` en toda mutación que lo necesita, no solo en `publicar` |
| Login | ✅ | ✅ + recuperación de contraseña |

Una oferta publicada se edita, se vence y se reactiva desde el panel (Fase 1): cierra el hueco que
antes vaciaba de sentido el §26 del cliente ("si se modifica su precio, fecha o imagen, el cambio
debe actualizarse en todos los lugares") — corregir un precio ya no exige entrar al dashboard de
Supabase, y `revalidarOferta` propaga el cambio a home, listado, ficha y destino sin redeploy.

---

## 2. Cómo se construye: DRY y separación de responsabilidades

Hoy `app/admin/acciones.ts` tiene ~310 líneas y mezcla cuatro cosas: sesión, recuperación de
contraseña, ofertas e imágenes. Funciona. Pero las fases de abajo le añaden edición de oferta,
vencimiento, CRUD de destinos, ALT y limpieza de Storage: **el mismo archivo terminaría en 800+
líneas**, y con él llegarían cuatro duplicaciones concretas y predecibles.

### 2.1 Las cuatro duplicaciones que hay que impedir antes de escribirlas

| Duplicación inminente | Dónde aparecería | Solución |
|---|---|---|
| El formulario de oferta, campo por campo | `ofertas/nueva/formulario.tsx` y el futuro `ofertas/[id]/editar` | Un solo componente `CamposOferta`, consumido por ambos |
| El parseo de `FormData` (`aLista`, `vacioANulo`, números, fechas) | `crearBorrador` y `actualizarOferta` | `lib/admin/campos.ts`, una definición por campo |
| Las rutas a revalidar tras cambiar una oferta | `publicar`, `actualizar`, `vencer`, y cada acción de imagen | `lib/admin/revalidar.ts`: `revalidarOferta(slug, destinoSlug)` |
| El intercambio de `orden` entre dos filas | imágenes (hecho), destinos y ofertas (pendientes) | `lib/admin/orden.ts`: un helper genérico por tabla |

Ninguna de las cuatro es una abstracción especulativa: las tres primeras las exige la Fase 1 y la
cuarta la Fase 2. Escribirlas ahora cuesta menos que desduplicarlas después.

### 2.2 Estructura objetivo

La regla es la misma que ya rige `lib/offers/` y `lib/destinations/` en el lado de lectura —
**una sola puerta** — aplicada al lado de escritura:

```
lib/admin/                    ← reglas y escritura. Sin JSX, sin "use server".
  campos.ts                   ← parseo + validación de FormData (una definición por campo)
  revalidar.ts                ← qué rutas caduca cada entidad. Una sola verdad
  orden.ts                    ← intercambio de `orden` genérico (imágenes · destinos · ofertas)
  ofertas.ts                  ← crear · actualizar · publicar · vencer
  destinos.ts                 ← crear · actualizar
  imagenes.ts                 ← subir · ordenar · borrar (fila + objeto de Storage)

app/admin/acciones/           ← "use server". Envoltorios finos: sesión + delegar + revalidar
  sesion.ts                   ← entrar · salir · olvideClave · restablecerClave
  ofertas.ts
  destinos.ts
  imagenes.ts

app/admin/piezas.tsx          ← se queda donde está (ya es la capa de presentación compartida)
app/admin/ofertas/campos.tsx  ← los campos del formulario de oferta, compartidos crear/editar
```

Tres reglas que hacen que esto no se degrade:

1. **Una Server Action no contiene reglas de negocio.** Comprueba sesión, parsea con
   `lib/admin/campos.ts`, delega en `lib/admin/*`, revalida y redirige. Si crece más de ~25
   líneas, la regla se fue al archivo equivocado.
2. **`lib/admin/**` no importa nada de `app/`.** Es lo que permite probarlo y moverlo sin tocar
   pantallas — el mismo argumento por el que `lib/offers/index.ts` sobrevivió a la migración de
   `lib/mock/` a Supabase sin que ninguna página cambiara.
3. **La sesión se comprueba en TODA Server Action, sin excepción.** No es estilo: la doc de
   Next.js 16 (`node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md`) lo
   advierte explícitamente — una Server Action es un endpoint POST alcanzable sin pasar por la
   página. El helper `exigirSesion()` ya existe; al repartir el archivo, se mueve a
   `app/admin/acciones/sesion.ts` y se importa, no se copia.

---

## 3. Restricciones técnicas verificadas

Cuatro hechos que cambian el diseño de las fases y que conviene no re-descubrir a mitad de camino.
Los dos primeros se verificaron contra la documentación de Supabase vía Context7; los dos últimos,
contra `node_modules/next/dist/docs/`.

- **Las transformaciones de imagen de Supabase Storage requieren plan Pro.** `getPublicUrl(...,
  { transform: { width, height } })` existe y sirve WebP automáticamente, pero solo en Pro o
  superior. **Consecuencia:** la optimización de §28 no se resuelve pidiéndosela a Supabase. Se
  resuelve **comprimiendo en el navegador antes de subir** (Fase 3), que además es gratis, quita
  carga del bucket y evita el techo de 10 MB por archivo. La entrega ya está resuelta por
  `next/image`, que redimensiona y sirve WebP/AVIF con lazy loading desde el host declarado en
  `next.config.ts`; lo que falta es no guardar un original de 12 MB.
- **`storage.remove()` exige políticas RLS de `delete` Y `select` sobre `storage.objects`.** Hoy
  `eliminarImagen` borra la fila de `imagenes` y deja el archivo huérfano en el bucket. Arreglarlo
  no es solo llamar a `.remove()`: hay que **conceder la política de borrado** en el proyecto
  (Fase 3, paso manual de §5).
- **Este proyecto no usa `cacheComponents`**, así que `revalidatePath` sigue siendo la herramienta
  correcta y no hay que migrar a `use cache` / `cacheTag`. El "webhook de revalidación" que pide
  `backoffice-features.md` §5.2 **no hace falta como webhook**: el panel vive dentro de la misma
  aplicación Next.js, así que la llamada directa a `revalidatePath` desde la Server Action hace el
  mismo trabajo sin red de por medio. Lo que falta no es el mecanismo, es llamarlo en todas las
  mutaciones y no solo en `publicar`.
- **`COLUMNAS_OFERTA` (`lib/supabase/client.ts`) se mantiene a mano.** Toda columna que pase a ser
  pública hay que concedérsela a `anon` en la migración **y** añadirla ahí, o la página entera cae
  con `permission denied`. Afecta a la Fase 4: `requisitos`, `documentacion`,
  `informacion_importante` y `politica_cancelacion` son públicas; `mayorista`, no.

---

## 4. Fases

Seis fases. El orden es por dependencia, no por importancia percibida: la Fase 0 existe para que
las otras cinco no dupliquen código, y la Fase 1 va antes que la 2 porque editar una oferta es lo
que la agencia necesita la primera semana, mientras que crear destinos se puede hacer a mano en
Supabase por unas semanas más.

### Fase 0 — Cimientos (refactor, sin cambio visible) ✅ cerrada

**Cerrada el 6 de septiembre de 2026.** `lib/admin/{campos,revalidar,orden}.ts` existían ya de
sesiones anteriores; `lib/admin/ofertas.ts` y `lib/admin/destinos.ts` (los dos que faltaban, pese
a que esta sección los daba por hechos desde el principio) se crearon en esta sesión, moviendo
toda la lógica de negocio fuera de las Server Actions. `app/admin/acciones/ofertas.ts` bajó de 285
a 111 líneas; `destinos.ts`, de 157 a 93. Verificado en navegador: el recorrido completo del
asistente sigue publicando una oferta, igual que antes del refactor.

Reparte `acciones.ts` según §2.2 y extrae las cuatro piezas compartidas. **No añade ninguna
funcionalidad**: es deliberado, para que el diff sea legible y el resto de fases no arrastre un
refactor dentro de cada PR.

- Crear `lib/admin/{campos,revalidar,orden}.ts` moviendo `vacioANulo`, `aLista`, `aSlug`, el
  bloque de `revalidatePath` que hoy vive dentro de `publicar`, y el intercambio de `orden` que
  hoy vive dentro de `moverImagen`.
- Repartir `app/admin/acciones.ts` en `app/admin/acciones/{sesion,ofertas,destinos,imagenes}.ts`.
- Extraer `CamposOferta` desde `ofertas/nueva/formulario.tsx` (todavía con un solo consumidor: lo
  necesita la Fase 1, y extraerlo aquí evita que el PR de edición mezcle refactor con feature).

**Hecho cuando:** `pnpm build` en `EXIT=0`, el recorrido completo del asistente sigue publicando
una oferta, y ningún archivo de `app/admin/acciones/` pasa de 120 líneas.

### Fase 1 — Editar, vencer y renovar una oferta publicada ✅ cerrada

El hueco más grave. Cierra el flujo #5 de §4 y hace real el §26.

- `app/admin/ofertas/[id]/editar/` reutilizando `CamposOferta` — mismos campos que crear, con los
  valores cargados. `actualizarOferta` en `lib/admin/ofertas.ts`.
- Acciones `vencerOferta` (`vigente` → `vencida`) y `reactivarOferta`, con confirmación explícita:
  vencer saca la oferta de todos los listados del sitio.
- Dashboard: las publicadas pasan a ser enlaces a `/editar`, y se agrupan en **vigentes**,
  **por vencer** (≤ 15 días) y **vencidas**, que es lo que §27 llama "identificada para revisión
  administrativa" y hoy no existe.
- Toda mutación llama a `revalidarOferta()` de la Fase 0. Un precio corregido tiene que verse en
  la home, en `/ofertas`, en la ficha y en la página del destino sin esperar un despliegue.

**Hecho cuando:** se corrige el precio de una oferta publicada desde el panel y el cambio se ve en
las cuatro superficies sin redeploy; y una oferta vencida a mano desaparece de los listados pero
conserva su página con el estado de vencida (`spec-tecnica.md` §8.4), sin 404.

### Fase 2 — Destinos: CRUD y creación al vuelo ✅ cerrada

Hoy el panel no puede tocar la tabla `destinos`, aunque el sitio ya lee `destacado_en_home`,
`orden`, `estado` y las tres categorías.

- `app/admin/destinos/` — listado con estado y orden, `nueva/` y `[id]/editar/`.
- Campos: nombre, categoría (las tres del enum), imagen, resumen, destacado en home, orden,
  estado. Reutiliza `lib/admin/orden.ts` para el orden y el patrón de fotos para la imagen.
- **Crear un destino sin abandonar la carga de la oferta** (§13, flujo #2 de §4): en el Paso 1 del
  asistente, un "crear destino nuevo" que inserta y selecciona sin perder lo transcrito. Si
  obliga a salir y volver a empezar, el flujo se abandona — y ese es literalmente el ejemplo que
  el cliente escribió.
- Decidir aquí, no antes: el contenido editorial del destino (`introduccion`, `mejor_epoca`,
  `que_hacer`, `faq`) entra al panel o se congela en código (`backoffice-features.md` §3.1). La
  recomendación es congelarlo en esta fase y anotarlo, porque son campos largos que multiplican la
  pantalla y hoy nadie los ha pedido.

**Hecho cuando:** se crea un destino en "Pueblos de Antioquia" desde el asistente, se le carga una
oferta y se publica, sin salir del flujo ni tocar Supabase.

### Fase 3 — Imágenes: peso, ALT y limpieza ⚠️ cerrada salvo un paso manual

- **Comprimir en el navegador antes de subir**: redimensionar al lado mayor ~2000px y codificar
  WebP con `canvas.toBlob()` — sin dependencias nuevas, coherente con la regla de cero librerías
  del proyecto. El nombre descriptivo (§30) ya se cumple; lo que falta es el peso.
- **Campo ALT editable** por foto (§29), con sugerencia automática construida desde los datos que
  ya existen: destino + hotel → "Hotel Riu Palace en Punta Cana". La sugerencia se propone; el
  texto se puede corregir. La columna `imagenes.alt` ya existe y hoy no la escribe nadie.
- **Borrar también el objeto de Storage** en `eliminarImagen`. Requiere la política RLS de §3.
- Portada explícita: hoy es "la primera de la lista". Con ALT y reorden ya en pantalla, marcarla
  con un botón "Usar como portada" es más barato que explicar la convención.

**Hecho cuando:** una foto de 12 MB de celular queda guardada por debajo de 500 KB sin pérdida
visible en la ficha (✅ verificado); quitar una foto no deja archivo huérfano en el bucket
(⚠️ **pendiente**: el código ya está listo, pero falta pegar el SQL de §5 en el dashboard de
Supabase — sin él, "Quitar" borra la fila pero no el objeto real).

### Fase 4 — Ficha comercial y trazabilidad ✅ cerrada

Cierra el rojo de `backoffice-features.md` §6 y los campos de §17.

- `mayorista` (interno, nunca público) y `notas_internas` en el paso de transcripción. Sin esto,
  una tarifa publicada no se puede rastrear hasta su origen — que es exactamente el riesgo que
  `sistema-comercial.md` levanta.
- `informacion_importante`, `requisitos`, `documentacion`, `politica_cancelacion`: las cuatro son
  listas o texto largo, y las cuatro ya tienen columna. Van en una sección plegable del formulario
  de edición, no en el asistente de carga: quien transcribe un flyer no las tiene a mano, y
  meterlas en el Paso 1 alarga el flujo que más se usa.
- Al hacerlas públicas: concederlas a `anon` **y** añadirlas a `COLUMNAS_OFERTA` (§3).

**Hecho cuando:** la ficha pública muestra requisitos y documentación cuando existen, y ninguna
consulta pública devuelve `mayorista` ni `notas_internas` (verificado con la clave pública, no
leyendo el código).

### Fase 5 — Diferido explícito (v2 del documento) ⏸ confirmado diferido

No entra en v1, y conviene que esté escrito para que no se cuele por goteo: testimonios (§34,
además bloqueado por no haber testimonios reales), roles y flujo de aprobación, historial de
cambios de precio, y ALT 100% automático. La duplicación de campos por bilingüismo entra aquí
solo si el inglés vuelve al alcance — hoy está diferido a Fase 2 del proyecto.

**Confirmado el 6 de septiembre de 2026**: al pedir "continuar con la Fase 5" el usuario no quería
construir esta lista — quería decir revisar los hallazgos abiertos del backoffice (§3 del handoff
de esa fecha). Se mantiene diferida tal como está escrita aquí.

---

## 5. Pasos manuales fuera del repositorio

No hay `supabase/config.toml` en este proyecto: la configuración vive en el dashboard y nada la
versiona. Estos cambios hay que hacerlos a mano y anotarlos cuando se hagan.

| Cuándo | Qué | Sin esto |
|---|---|---|
| Ya (E3) | Plantilla "Reset Password" → `{{ .SiteURL }}/admin/auth/confirmar?token_hash={{ .TokenHash }}&type=recovery&next=/admin/restablecer` y esa URL en **Redirect URLs** | El enlace del correo no lleva a ningún lado |
| Ya (E3) | Crear las 9 cuentas restantes con **Auto Confirm User** | El usuario queda creado pero no puede entrar, y el error que ve es el genérico de credenciales |
| Fase 4 | `GRANT SELECT (columna)` a `anon` para los campos públicos nuevos | La ficha entera cae con `permission denied` |

**Pendiente (Fase 3): políticas de Storage + `GRANT SELECT (alt)`.** Causa raíz confirmada el 6 de
septiembre de 2026: `getSupabaseAdmin()` (`lib/supabase/admin.ts`), pese al nombre, usa la clave
`anon`/publicable con la cookie de sesión, no `service_role` — sigue sujeto a RLS. Sin la política
de `select` sobre `storage.objects`, `.remove()` "tiene éxito" sin borrar nada. SQL exacto, listo
para pegar en el SQL Editor del dashboard de Supabase (no hay `supabase/config.toml` versionado,
así que esto no se aplica solo):

```sql
-- Bucket "catalogo": permitir a `authenticated` (sesión del panel admin) ver y borrar sus
-- objetos. Sin la de SELECT, `.remove()` "tiene éxito" sin borrar nada (Storage no encuentra
-- candidatos) — causa raíz confirmada de por qué "Quitar" no borra el archivo real.
create policy "catalogo_select_authenticated"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'catalogo');

create policy "catalogo_delete_authenticated"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'catalogo');

-- Columna alt visible para `anon`: la ficha pública la embebe en su SELECT (lib/offers/index.ts).
grant select (alt) on public.imagenes to anon;
```

Verificación tras aplicarlo: subir una foto de prueba, "Quitar"la desde el panel, y hacer
`curl -I` a su URL pública — debe devolver `404`, no `200` (mismo método que detectó el problema).

---

## 6. Decisiones abiertas que condicionan el plan

1. **¿El backoffice *es* la base de ofertas, o publica sobre una externa?**
   (`backoffice-features.md` §7). Hoy el panel se comporta como (a) —se teclea el precio a mano—
   pero sin capturar `mayorista` ni ningún `margen`, que es lo que (a) exige. La Fase 4 lo tapa a
   medias. Si la respuesta es (b) —el Google Sheet de NextGen manda—, entonces E5 sincroniza y
   varios campos del panel pasan a ser de solo lectura. **Decidirlo antes de la Fase 4**, o esa
   fase se escribe dos veces.
2. ~~**Contenido editorial del destino**: al panel o congelado en código (Fase 2).~~ **Resuelto**
   (Fase 2, implícito): `introduccion`, `mejor_epoca`, `que_hacer`, `faq` no están en el panel —
   se congelaron en código, tal como recomendaba este documento. Nadie lo ha pedido todavía.
3. **Roles.** §23 del cliente dice "un perfil administrativo sencillo", en singular, pero el
   estado `borrador` ya implica dos papeles: quien transcribe y quien valida la tarifa. Hoy
   cualquiera de las diez personas puede publicar. Es aceptable para arrancar; conviene decidirlo
   antes de que las diez cuentas estén repartidas.

---

## 7. Criterio de backoffice terminado (v1)

**Estado al 6 de septiembre de 2026: 6 de 8 cumplidos.** Los dos que faltan tienen dueño y motivo
documentado, no son un olvido.

- [x] Una oferta publicada se edita, se vence y se reactiva desde el panel, sin tocar Supabase.
- [x] El cambio de un precio se ve en home, listado, ficha y destino sin redeploy.
- [x] Existe la vista de vencidas y por vencer.
- [x] Un destino se crea, se destaca y se ordena desde el panel — incluido crearlo sin salir del
      asistente de oferta.
- [ ] Ninguna foto se guarda por encima de 500 KB, y ninguna se queda huérfana al quitarla.
      La compresión ya funciona (✅); el borrado real del objeto sigue **pendiente de un paso
      manual** — el SQL de políticas RLS de §5, todavía sin aplicar en el dashboard de Supabase.
- [ ] Toda oferta publicada tiene `mayorista`. **Decisión del 6 de septiembre de 2026**: se
      deja como recomendación, no como bloqueo — `publicar()` no lo exige. Ligado a la decisión
      abierta §6.1: si el backoffice termina siendo la base de ofertas, `mayorista` pasa a ser
      obligatorio de verdad; si el Sheet de NextGen manda, puede dejar de editarse aquí.
- [x] Ninguna consulta con la clave pública devuelve un campo interno.
- [x] Ningún archivo de `app/admin/acciones/` pasa de 120 líneas, y ninguna Server Action contiene
      reglas de negocio. Cerrado el 6 de septiembre de 2026 (Fase 0, ver §4).

---

## 8. Ramas y PRs

Una rama y un PR por fase, según `CLAUDE.md`. Nombre: `fase-1/e3-<n>-<slug>`
(ej. `fase-1/e3-1-editar-oferta`).

**Actualizado el 6 de septiembre de 2026**: `fase-1/e1-arquitectura-informacion` (PR #18) se
mergeó a `main`. La rama `fase-1/e3-backoffice` (PR #19, todo lo de §4) ya no está apilada — al
borrarse la rama de E1, GitHub retargeteó el PR #19 solo a `main` automáticamente. La regla normal
rige de nuevo: las fases nuevas de este documento ramifican desde `main`.
