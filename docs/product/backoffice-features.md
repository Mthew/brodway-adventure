# Backoffice — features

> Extracción de las capacidades administrativas que exige
> [`estructura-funcional-cliente.md`](estructura-funcional-cliente.md), la especificación del
> cliente del 2026-08-16. El documento del cliente reparte los requisitos de administración en
> **catorce** secciones (§1, §6, §7, §8, §9, §11, §13, §16, §23-§30, §34), no solo en el bloque
> §23-§30; este documento las junta y las traduce a entidades, campos y flujos.
>
> **Qué es y qué no es.** Es el inventario de features y el modelo de datos que se derivan del
> documento del cliente, más los campos que el sitio ya construido exige y el cliente no listó
> (§6 de aquí). **No** es una elección de herramienta, ni un plan de ejecución, ni un diseño de
> pantallas: la decisión que bloquea todo eso está en §7.
>
> Contexto de por qué esto aparece ahora, en
> [`brecha-estructura-funcional.md`](brecha-estructura-funcional.md) §1.A: el panel administrativo
> pasa de Fase 2 a Fase 1.

## 1. Alcance: qué administra y qué no

El documento del cliente delimita el backoffice a **inventario comercial**. §23 lo enumera:
destinos, ofertas, imágenes, precios, fechas, vigencias, estados, colecciones y orden de
visualización. §34 añade testimonios.

**Fuera del alcance declarado** — y por tanto siguen en código y en `messages/*.json`: hero de la
home (§4), textos de Nosotros (§35), FAQ, páginas legales, footer, y las landings de campaña
`/lp/[campana]`.

Conviene confirmarlo explícitamente con el cliente antes de construir. "Actualizar sin depender
del desarrollador" (§23) tiende a expandirse en la primera semana de uso real, y el costo de
añadir una entidad editorial después es mucho menor que el de construir un CMS de páginas que
nadie pidió. Hoy el documento no lo pide.

## 2. Entidades

| Entidad | Origen | ¿Entidad propia? |
|---|---|---|
| **Destino** | §24 | Sí |
| **Oferta** | §25 | Sí |
| **Imagen / galería** | §28-§30 | Sí — medios reutilizables entre ofertas y destinos |
| **Testimonio** | §34 | Sí |
| **Hotel** | §7, §16, §17, §25 | **No.** El documento lo trata siempre como *campo* de la oferta ("Nombre del hotel cuando corresponda"). Empezar como campo; promoverlo a entidad solo si el retipeo duele. |
| **Colección / sección** | §26 | **No.** Son flags booleanos + `orden` sobre la oferta. Es explícito: "la oferta debe existir una sola vez". |

Que "Mejores Playas y Hoteles" sea una sección de menú no la convierte en entidad: §26 la define
como una vista filtrada por un flag de la oferta. Modelarla como colección con miembros
duplicaría las ofertas, que es justo lo que el documento prohíbe.

## 3. Campos por entidad

### 3.1 Destino (§24)

| Campo | Estado en el repo |
|---|---|
| Nombre | ✅ `nombre` |
| **Categoría**: Internacional / Nacional / **Pueblos de Antioquia** | ⚠️ `lib/types/destination.ts` solo tiene `"nacional" \| "internacional"` |
| Imagen principal | ✅ `imagen` |
| Descripción corta | ✅ `resumen` |
| **Destacado en Home** (Sí/No) | ❌ |
| **Orden de aparición** | ❌ |
| **Estado** (Activo/Inactivo) | ❌ |
| Acción "Crear nuevo destino" | ❌ |

El repo tiene además `imagenHero`, `introduccion[]`, `mejorEpoca`, `queHacer[]` y `faq[]` —
contenido editorial que hoy renderiza `/destinos/[slug]` y que el documento del cliente no
menciona. Decisión pendiente: o el backoffice los administra (y el modelo crece), o se congelan
en código (y el cliente no puede editar la página de destino más allá de su descripción corta).

### 3.2 Oferta (§25, §26, §27)

**Información comercial (§25).** Nombre de la oferta · destino · **hotel** · descripción corta ·
precio publicado · **fecha o periodo** · ciudad de salida · duración · **alimentación** ·
incluye · no incluye · **información importante**.

**Vigencia (§25, §27).** **Fecha inicial** · fecha final · estado.

**Multimedia (§25).** Imagen principal · galería de imágenes.

**Clasificación (§26).** Mostrar en Mejores Ofertas (Sí/No) · Mostrar en Mejores Playas y Hoteles
(Sí/No) · Mostrar en Home (Sí/No) · Orden (número de aparición).

**Actualización (§25).** Fecha de última actualización.

**Ficha comercial (§17)**, campos que la ficha muestra y alguien tiene que capturar: requisitos ·
documentación · condiciones relevantes.

En negrita, lo que no existe en `lib/types/offer.ts`.

### 3.3 Testimonio (§34)

Nombre · fotografía (solo cuando exista autorización) · destino · testimonio · calificación
(cuando corresponda). Hoy son cadenas fijas en `messages/es.json`.

El campo de fotografía necesita un booleano de autorización asociado, no solo el archivo: §34
condiciona la publicación de la foto a que exista permiso, y eso es un dato que hay que guardar,
no una nota en un manual de uso.

## 4. Flujos de trabajo

El documento no describe pantallas, describe operaciones. Estas son las que hay que soportar, y
son mejor guía de diseño que la lista de campos.

1. **Publicar una oferta desde el flyer del mayorista** (§13, §16) — es *el* flujo del negocio.
   §16 exige que la información sea "texto real del website y no depender exclusivamente de
   información escrita dentro de un flyer": alguien transcribe el flyer a campos estructurados.
   Encaja con el estado `borrador` que ya existe en `lib/types/offer.ts` (oferta extraída por IA,
   sin validar por una persona, nunca visible) y con el riesgo "agente que inventa tarifas" de
   [`../research/sistema-comercial.md`](../research/sistema-comercial.md).
2. **Crear un destino sobre la marcha** (§13) — "Crear destino → asociarlo a Pueblos de Antioquia
   → cargar oferta → publicar". Tiene que poder hacerse **sin abandonar la carga de la oferta**.
   Si obliga a salir, crear el destino y volver a empezar, el flujo se abandona.
3. **Curar la home** (§5, §7, §9, §11, §26) — elegir las ~6 ofertas destacadas, las 4-6 de playas
   y hoteles, y los destinos destacados, con su orden.
4. **Curar las páginas de colección** (§6, §8) — qué aparece en cada sección, en qué orden, y
   cuándo deja de aparecer.
5. **Vencer y renovar tarifas** (§27) — activar/desactivar manualmente cualquier oferta, y
   revisar las vencidas. §27 pide que una oferta vencida "sea identificada para revisión
   administrativa": eso es una **vista de vencidas y por vencer**, no un filtro escondido en un
   listado.
6. **Gestionar la galería** (§28) — subir, reemplazar, eliminar y **reordenar**.
7. **Publicar un testimonio** (§34).

## 5. Requisitos transversales

### 5.1 Imágenes (§28, §29, §30)

Es la parte técnicamente más pesada, y por eso es **criterio de selección de herramienta**, no
detalle de implementación:

- **Al subir**, automáticamente: redimensionar, comprimir, generar WebP y/o AVIF, producir varios
  tamaños según dispositivo, y servir con lazy loading (§28).
- **ALT generado automáticamente** a partir de los datos disponibles — el ejemplo del documento es
  destino "Punta Cana" + hotel "Riu Palace" → "Hotel Riu Palace en Punta Cana, República
  Dominicana" — en un campo **Texto ALT** que se pueda editar a mano (§29).
- **Nombres de archivo descriptivos**: `riu-palace-punta-cana.webp`, no `IMG_593784.jpg` (§30).

### 5.2 Propagación de cambios (§26) — el requisito que el cliente no sabe que está pidiendo

§26: *"Si se modifica su precio, fecha o imagen, el cambio debe actualizarse automáticamente en
todos los lugares donde aparezca."*

El sitio es SSG/ISR (`spec-tecnica.md` §2.2). Una edición en el backoffice **no llega sola** a una
página ya generada. Esto obliga a un **webhook de revalidación** desde el backoffice hacia Next.js
(`revalidateTag`/`revalidatePath`), disparado en cada publicación.

Sin eso, la agencia corrige un precio, ve el cambio en el panel, y el sitio sigue mostrando el
viejo hasta el próximo despliegue — que es exactamente el problema que el backoffice viene a
resolver. Es de Fase 1, no de pulido posterior.

### 5.3 Estados y publicación

El documento contempla activo/inactivo (§24, §25, §27). El repo necesita un estado más:
`lib/types/offer.ts` define `"vigente" | "vencida" | "borrador"`, y `lib/offers/index.ts` excluye
los borradores de `listOfferSlugs()`, `getOfferById()` y `getOffer()`. El backoffice tiene que
poder dejar una oferta en borrador sin publicarla.

## 6. 🔴 Campos que el sitio ya exige y el documento del cliente no lista

Si el backoffice se construye solo con los campos de §25, **se rompe lo que ya está construido**.
Estos cinco no son opinión de diseño: hay código en el repo que los lee.

| Campo | Quién lo exige | Qué pasa si falta |
|---|---|---|
| `ocupacionBase` | `components/ui/price-disclosure.tsx:51` | El bloque de precio pierde la ocupación con la que se calculó el "desde". Sin ella, un precio "desde" no significa nada — el mismo viaje cuesta distinto en doble que en sencilla. |
| `validadaEl` | `price-disclosure.tsx:31,56` — "Tarifa verificada el [fecha]" | Se cae la frase de verificación exigida por `spec-tecnica.md` §8.4. **No es la "fecha de última actualización" de §25**: corregir una falta de ortografía en la descripción no es re-verificar la tarifa con el mayorista. Son dos campos distintos. |
| `offerId` estable | §21 del propio documento + `lib/offers/index.ts:41` | Las campañas referencian la oferta por identificador, no por URL: el slug cambia al reescribir un título, el `offerId` no. El backoffice tiene que generarlo y **no** dejar que se edite. |
| `estado: "borrador"` | `lib/offers/index.ts:30,43,64` | Una tarifa sin validación humana puede llegar a producción. |
| `mayorista` | `lib/types/offer.ts:91` (interno, nunca visible en el sitio) | No se puede rastrear de dónde salió una tarifa publicada. |

**Conclusión operativa:** el modelo de datos del backoffice es el de §25 **más estos cinco**, de
los cuales tres (`validadaEl`, `estado`, `mayorista`) son internos y no se muestran al visitante.

## 7. 🔴 La decisión que bloquea la elección de herramienta

[`../research/sistema-comercial.md`](../research/sistema-comercial.md) define una **base de ofertas
externa** como fuente de verdad de las tarifas, con mayorista, ocupación, vigencia, validación
humana y **margen**, y dice explícitamente que el CRM no sirve para eso. El §25 del cliente pide
que el backoffice administre ofertas con precio y vigencia.

Dos lecturas incompatibles:

- **(a) El backoffice *es* la base de ofertas.** Entonces necesita además margen y mayorista, y es
  una herramienta interna de negocio — más cerca de un admin a medida que de un CMS.
- **(b) El backoffice es la capa de publicación** sobre una base que vive fuera. Entonces §25
  describe solo los campos publicables, y falta definir la sincronización (API, export
  programado, push).

**Hasta que esto se decida no se puede elegir CMS**, porque (a) y (b) llevan a herramientas
distintas. Es la misma pregunta que `mvp-features.md` §Riesgos dejó abierta como "quién es dueño
de la tarifa", ahora con consecuencia inmediata.

Punto a favor de resolverla rápido: `lib/offers/index.ts` es la **única puerta** a las ofertas y
`lib/destinations/index.ts` la única a los destinos. Cualquiera de las dos respuestas se
implementa cambiando el interior de esos módulos, sin tocar ninguna página.

## 8. Decisiones abiertas

- **Autenticación y roles.** §23 dice "un perfil administrativo sencillo", en singular; no pide
  roles ni aprobaciones. Pero el estado `borrador` implica al menos una separación entre quien
  carga y quien valida la tarifa. Mínimo: login. Recomendable: dos roles.
- **Bilingüismo.** Si el inglés sigue en alcance, **cada campo editorial se duplica** en el
  backoffice: nombre, descripción corta, incluye, no incluye, información importante, requisitos.
  Es el mayor multiplicador de costo de la herramienta, y sigue sin decidirse
  (`brecha-estructura-funcional.md` §4).
- **Vista previa antes de publicar.** No la pide el documento. Con estado borrador sale casi
  gratis; sin ella se publica a ciegas.
- **Historial de cambios de precio.** No lo pide. Dejarlo anotado como deuda, no construirlo ahora.
- **Contenido editorial del destino** (`introduccion`, `mejorEpoca`, `queHacer`, `faq`): ¿entra al
  backoffice o se congela en código? Ver §3.1.

## 9. Alcance propuesto

No está acordado con el cliente; es la recomendación de este documento.

**v1 — lo que habilita las páginas dinámicas:**

- Destinos: 3 categorías, destacado en home, orden, estado, crear desde cero.
- Ofertas: campos de §25 + los cinco de §6.
- Colecciones: los tres flags de §26 + orden.
- Vigencia: fechas, activar/desactivar manual, y vista de vencidas / por vencer (§27).
- Imágenes: subida con optimización automática, galería reordenable (§28).
- Webhook de revalidación (§5.2).
- Login.

**v2 — lo que puede esperar sin bloquear el lanzamiento:**

- Testimonios (§34).
- ALT automático (§29) — empezar con campo manual y sugerencia.
- Roles y flujo de aprobación.
- Historial de precios.

Testimonios va a v2 a propósito: es contenido de confianza, no inventario, y hoy no hay
testimonios reales del cliente — sigue como bloqueo externo en `CURRENT.md`. Construir la pantalla
antes de tener el contenido no adelanta el lanzamiento.
