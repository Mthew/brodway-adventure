# Spec — Fase 3 · Identidad verbal

> **Intent:** [`../intent.md`](../intent.md) §Fase 3 · **Fuente de marca:**
> [`../sistema-de-identidad.md`](../sistema-de-identidad.md) §3 (voz, tono, léxico, mensaje, CTAs,
> «Next Stop») y §2.2 (reglas del nombre)
> **No depende de ninguna otra fase.** Puede ir en paralelo a la Fase 1 y a la Fase 2
> **Rama:** `fase-1/marca-3-verbal` · **PR:** a `main`, con `CURRENT.md` en el mismo PR
> **Escrito:** 2026-09-11 · **Estado:** listo para plan

## 0. Objetivo

El sitio ya **evita** lo que el manual prohíbe. Esta fase busca lo contrario: que **suene** como el
manual dice que suena la marca — voz de seis atributos, mensajes con estructura, llamados a la
acción de la lista aprobada — y que esa voz llegue también a las dos superficies donde hoy nadie la
ha revisado: **el panel** y **el inglés**.

Es la fase con menos riesgo técnico y más riesgo de criterio: cambiar copy no rompe nada, y
precisamente por eso hay que decir antes qué se cambia y con qué regla.

## 1. Punto de partida, verificado

Auditado el 2026-09-11 sobre `messages/es.json` y `messages/en.json` (**303 claves por idioma**, las
mismas en los dos) y sobre `app/admin/`.

**Lo que ya cumple** —y por tanto no se toca sin motivo—:

| Señal | Resultado |
|---|---|
| Léxico prohibido (las ocho promesas del manual) | **0 apariciones** |
| Grafías incorrectas del nombre | **0** |
| «Next Stop» | **1 sola aparición** por página, sin traducir en ninguno de los dos idiomas |
| Em-dash en copy renderizado | **0** |
| Trato de usted (la voz pide tuteo) | **0** |
| Superlativos en el cuerpo del copy | **0** |
| Urgencia artificial | **0** (los dos «ahora mismo» que aparecen son estados vacíos: «Ahora mismo no tenemos un plan publicado para este destino») |
| Signos de exclamación | **0** |
| Los cinco CTAs aprobados | **los cinco existen** en `messages.cta` |
| Inglés | **no es traducción literal**: usa giros propios («we've got your request», «point you in the right direction») |
| Copy hardcodeado en el sitio público | **5 literales**; en `components/`, **0** |

La home ya resuelve bien lo difícil: «Elige tu viaje con claridad», «Las ofertas que más nos piden»
—en vez de «las mejores»—, «Selección nuestra, no un ranking: son los sitios que le mandaríamos a
un amigo». Ese es el tono objetivo; el trabajo es llevarlo a donde todavía no llegó.

## 2. Alcance

| Superficie | Qué entra |
|---|---|
| **Copy del sitio** | Las 303 claves × 2 idiomas: títulos, cuerpos, microcopy, estados vacíos, errores, `alt` de imagen y los `title`/`description` de metadatos |
| **Backoffice** | El copy del panel —etiquetas, ayudas, errores, confirmaciones y estados vacíos—, que hoy vive en el JSX y nunca se ha revisado contra la voz |
| **CTAs** | Los ocho de `messages.cta` y sus 12 usos en páginas |
| **Inglés** | Su variante, hoy consistente pero nunca declarada |
| **Verificación** | Adelanto de la Fase 7: la parte de `check:marca` que comprueba léxico y nombre |

**Fuera de alcance:** el texto legal de `/legal` y de la política de datos —sigue bloqueado por
abogado, y su exactitud manda sobre su tono— · el contenido editorial que vive en Supabase
(destinos, ofertas, secciones), que lo escribe el equipo comercial desde el panel y no es código ·
la internacionalización del panel, que es interno y en español por decisión de producto.

## 3. Lo que hay que arreglar

### 3.1 Tres CTAs fuera de la lista aprobada, con 12 usos

| CTA | Usos | Veredicto |
|---|---|---|
| `cotizaWhatsapp` — «Cotiza por WhatsApp» | 5 | **Se queda, como variante declarada.** Nombra el canal, y eso es información que reduce incertidumbre —lo que el manual pide en el paso 3 de la estructura del mensaje—, no una promesa. Se documenta como extensión, no como sustitución |
| `hablaConAsesor` — «Habla con un asesor» | 6 | **Se sustituye** por uno de los cinco. Es una invitación genérica que no dice qué pasa después; «Cuéntanos cómo quieres viajar» y «Planeemos tu viaje» dicen lo mismo y están aprobados |
| `verItinerario` — «Ver itinerario día a día» | 1 | **Se queda.** No es un llamado de marca: es una etiqueta de navegación interna, del mismo tipo que «Ver todos los destinos» |

**Regla que queda escrita:** el CTA que pide una conversión sale de los cinco aprobados, más la
variante que nombra el canal. Las etiquetas de navegación no son CTAs de marca y no entran en esa
lista.

### 3.2 «Mejores» en cuatro claves — tensión entre dos documentos del cliente

`nav.mejoresOfertas`, `nav.playasYHoteles`, `ofertas.tituloListado` y `playasYHoteles.titulo`
publican **«Mejores Ofertas»** y **«Mejores Playas y Hoteles»**. El manual pone «"la mejor oferta"
sin evidencia» en su lista de promesas prohibidas; la **especificación funcional del cliente**
(§8) fija esos nombres de sección y manda sobre navegación y arquitectura.

El equipo ya vio la tensión y la resolvió a medias, con buen criterio: **en la home** los mismos
bloques se llaman «Las ofertas que más nos piden» y «Hoteles y playas que recomendamos», y los
listados se defienden con su intro —«Una selección nuestra, hecha a mano. No es un ranking ni un
puntaje»—. Queda incoherente que el menú diga «Mejores» y la home no.

**Decidido y ratificado el 2026-09-11 (D-G, [`aprobaciones.md`](../aprobaciones.md)): se mantiene
el nombre de sección que fijó el cliente y se refuerza la evidencia.** En concreto:

- `nav.mejoresOfertas`, `nav.playasYHoteles`, `ofertas.tituloListado` y `playasYHoteles.titulo` **no
  cambian**: son la navegación que el cliente acordó.
- **Los dos listados abren con la aclaración** de que es una selección propia y no un ranking. Hoy
  solo la tiene `playasYHoteles`; `ofertas` la necesita, con su propia redacción y no copiada.
- La home **conserva su fórmula sin superlativo** («Las ofertas que más nos piden»): no se alinea
  hacia arriba. Que el menú nombre la sección y la home la describa no es incoherencia, son dos
  funciones distintas.

Si algún día se revoca, la salida es renombrar los cuatro títulos a la fórmula de la home: 8
cadenas.

### 3.3 El panel no tiene voz declarada

El copy del backoffice está en el JSX, en español, y nunca se ha contrastado con la voz. La muestra
dice que **parte con buen tono** —«Ese enlace ya no es válido. Pide uno nuevo.», «Inactivo
desaparece del sitio sin borrarse.»— pero hay que revisarlo entero, porque es donde el equipo
comercial lee a la marca todos los días y donde un mensaje seco o culpabilizador se cuela sin que
nadie lo note.

Lo que se revisa, en este orden de importancia: **errores y validaciones** (que expliquen qué
hacer, no qué se hizo mal) · **estados vacíos** (que ofrezcan el siguiente paso) · **confirmaciones
destructivas** (serenas y explícitas sobre lo que se pierde) · **etiquetas y ayudas de campo**.

No se internacionaliza ni se mueve a `messages/`: eso es otro trabajo y no es de marca.

### 3.4 La variante de inglés nunca se declaró

El inglés es **británico y consistente**: 15 marcadores (`travellers`, `authorise`, `personalised`,
`organise`) y **cero** americanos. Como nadie lo escribió, la próxima cadena puede llegar en
americano y nadie lo notará.

**Se declara británico** —es el statu quo y es coherente— en el spec y en `/design-system`. Si
dirección de marca prefiere americano, son 15 cadenas: se anota como decisión menor, no como
bloqueo.

### 3.5 La estructura del mensaje, bloque por bloque

El manual fija cuatro pasos: **necesidad reconocible → beneficio concreto → información que reduce
incertidumbre → invitación clara**. La auditoría es por bloque, no por clave: un bloque cumple
cuando sus piezas, leídas en el orden en que se ven, recorren los cuatro pasos.

Se auditan los bloques de conversión —hero de la home, hero de campaña, ficha de oferta, ficha de
destino, formulario, página de gracias— y se corrige el que empiece por la invitación o se salte el
paso 3, que es el que sostiene la confianza.

### 3.6 Los `alt` de imagen también son voz

`heroImagenAlt`, `heroImagenAlt2`… describen fotos y hoy lo hacen bien («Viajeros mirando un valle
de montaña al amanecer»). Entran en la auditoría porque los lee quien usa lector de pantalla: son
la versión hablada de la marca, no metadatos técnicos.

## 4. Reglas que el copy debe cumplir

**V-1 · Los seis atributos de la voz** (clara · cercana · serena · inspiradora · honesta · útil) se
aplican a cada cadena, no al conjunto. Una sola cadena presionando rompe la voz de la página.

**V-2 · Se habla de tú**, nunca de usted, en los dos idiomas y también en el panel.

**V-3 · Nada de urgencia artificial.** Sin cuentas atrás, sin «últimos cupos» permanentes, sin
escasez que no se pueda demostrar.

**V-4 · Se diferencia el hecho de la recomendación y de la posibilidad.** «Incluye» es un hecho;
«recomendamos» es criterio; «según disponibilidad» es una posibilidad. No se mezclan en la misma
frase.

**V-5 · Cada mensaje ayuda a comprender, decidir o avanzar.** Si una cadena no hace ninguna de las
tres, sobra.

**V-6 · «Next Stop» se firma una vez por pieza**, sin traducir y sin combinarse con otra frase
manuscrita.

**V-7 · El nombre se escribe BroWay Adventures**, siempre como una unidad verbal.

## 5. Criterios de aceptación

| # | Criterio | Cómo se verifica |
|---|---|---|
| **C-1** | Todo CTA de conversión sale de los cinco aprobados o de la variante de canal declarada; `hablaConAsesor` ya no existe | `grep` de `tc(` en las páginas |
| **C-2** | D-G aplicada: los cuatro títulos se mantienen y **los dos listados** abren con su aclaración de que es una selección, no un ranking | Lectura de menú y listados en los dos idiomas |
| **C-3** | Los seis bloques de conversión recorren los cuatro pasos del mensaje | Auditoría escrita, bloque por bloque, en el PR |
| **C-4** | El copy del panel pasa los seis atributos de la voz: errores que dicen qué hacer, vacíos que ofrecen salida, confirmaciones serenas | Recorrido de las 13 rutas del panel |
| **C-5** | La variante de inglés está declarada y no hay mezcla | `grep` de marcadores `-ize`/`-ise` |
| **C-6** | Las señales automáticas siguen en cero: léxico prohibido, grafías del nombre, em-dash, usted, urgencia | `pnpm check:marca` |
| **C-7** | Ninguna cadena nueva del panel queda hardcodeada en el sitio **público** | `grep` de literales en `app/[locale]` y `components/` |
| **C-8** | `pnpm build` pasa | CI local |

## 6. Verificación

1. **Mecánica.** Esta fase **completa el `check:marca`** que la Fase 1 dejó a medias: a la
   comprobación de hex se le añaden las tres reglas de texto —léxico prohibido, grafías del nombre y
   «Next Stop» repetido en la misma página—, sobre `messages/`, `app/` y `components/`. Con la
   Fase 7 queda solo el Pre-Flight y el registro de aprobaciones.
2. **Lectura en voz alta.** Es el método que detecta lo que ninguna regla ve: si una frase no se
   puede decir en voz alta sin sonar a folleto, no cumple V-1. Se hace sobre los seis bloques de
   conversión y sobre los errores del panel.
3. **Los dos idiomas en paralelo.** Cada cambio se revisa en español e inglés a la vez; si el
   inglés necesita otra construcción para sonar natural, se cambia la construcción y no se calca.

## 7. Riesgos

| Riesgo | Señal | Respuesta |
|---|---|---|
| La auditoría se convierte en reescritura del sitio | Se tocan cadenas que ya cumplen | Solo se cambia lo que incumple una regla de §4 o un criterio de §5. «Me gusta más así» no es motivo |
| Cambiar CTAs mueve la conversión | Menos clics tras el cambio | Los cinco aprobados son del cliente y son más específicos que «Habla con un asesor»; aun así, el cambio se anota como hipótesis medible para cuando haya analítica |
| Al «reforzar la evidencia» se escriben dos intros calcadas | La misma frase en los dos listados | Cada listado explica su propio criterio de selección; una aclaración repetida palabra por palabra se lee como texto legal, no como voz de marca |
| El inglés se «arregla» a americano por costumbre | Mezcla de variantes | C-5 y el `grep` de marcadores |
| El copy del panel se reescribe con tono de marketing | Un panel interno que vende | El panel informa y ayuda a operar: la voz es la misma, el registro es operativo |

## 8. Entregables del PR

1. `messages/es.json` y `messages/en.json` con los cambios de CTA, la decisión D-G aplicada y las
   correcciones de estructura.
2. El copy del panel revisado, con foco en errores, vacíos y confirmaciones.
3. `scripts/check-marca.mjs` ampliado con las tres reglas de texto.
4. La **auditoría escrita de los seis bloques de conversión** —los cuatro pasos, bloque por
   bloque— en el cuerpo del PR. Sin ella no se cumple C-3.
5. La variante de inglés declarada en `/design-system`.
6. `CURRENT.md` actualizado en el mismo PR.
