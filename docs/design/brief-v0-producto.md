# BroWay Adventures — Brief de producto para generar el MVP

Este brief explica **de qué va la página**: el negocio, a quién le habla, qué tiene que lograr,
cómo suena y qué lleva cada pantalla. Está escrito para dárselo a un agente generador de
interfaces (v0 o equivalente) y obtener la primera versión del sitio.

**Aquí no hay decisiones técnicas a propósito.** Nada de frameworks, versiones, librerías ni
arquitectura. Si necesitas eso, está en el brief técnico ([`brief-v0.md`](brief-v0.md)) y en la
[especificación técnica](../architecture/spec-tecnica.md). Los dos briefs describen el mismo
sitio: este el *qué* y el *por qué*, el otro el *cómo*.

---

## 1. Cómo usar este documento

No lo pegues completo de una sola vez. Un agente generador se degrada cuando le pides ocho
pantallas juntas: inventa piezas duplicadas y pierde la coherencia visual.

El orden que funciona:

1. **Primero el sistema visual** (§7): colores, tipografía, botones, tarjetas, formularios.
   Nada de páginas todavía.
2. **Después el marco común** (§8): encabezado, pie de página y el botón de WhatsApp que
   acompaña al usuario en todo el sitio.
3. **Después las páginas** (§9), de una en una, reutilizando lo anterior.

En cada paso nuevo, vuelve a pegar las secciones §2 a §6 — el agente no recuerda lo que le
dijiste en una conversación anterior.

---

## 2. El negocio en una página

BroWay Adventures es una **agencia de viajes con sede en Medellín, Colombia**. Vende viajes
nacionales (Eje Cafetero, San Andrés, Santa Marta, Cartagena) e internacionales (Cancún,
Punta Cana y similares), armados con mayoristas y acompañados por un asesor humano de
principio a fin.

Nació de una amistad que se volvió hermandad: dos fundadores con la misma pasión por viajar,
descubrir y ayudar a otros a vivir experiencias nuevas. **"Bro" es el vínculo, "Way" es el
camino.** Eso explica el origen del nombre, pero no es un eslogan: no escribas "hermanos de
aventuras" en ningún lado.

**Propósito:** hacer que viajar se sienta más claro, cercano y posible para más personas.
**Misión:** orientar y acompañar a viajeros en Colombia al elegir experiencias nacionales e
internacionales.
**Visión:** ser una marca de viajes reconocida en Colombia por la confianza que genera.

**Valores:** Claridad · Confianza · Cercanía · Responsabilidad · Curiosidad · Consistencia.

### El nombre se escribe así

**BroWay Adventures** — B y W en mayúscula, siempre pegado, siempre como una sola unidad.

Nunca: "Bro Way", "Broway", "Bro-Way", "BRO WAY", "Brodway", "Broadway".

---

## 3. Qué tiene que lograr este sitio

El sitio existe para dos cosas, en este orden:

1. **Dar credibilidad.** Hoy la agencia se ve solo en redes y WhatsApp. Mucha gente en
   Colombia desconfía de las agencias de viajes por el fraude ("montaviajes"), y con razón.
   El sitio es la prueba de que la empresa existe, está registrada y responde.
2. **Convertir visitantes en conversaciones.** El éxito de cada página se mide en una sola
   cosa: que la persona **escriba por WhatsApp** o **deje sus datos en un formulario corto**.

### Lo que este sitio NO es

- **No es una tienda.** No hay carrito, ni checkout, ni pago en línea, ni disponibilidad en
  tiempo real. Nadie compra un viaje solo con clics.
- **No cotiza.** La cotización la arma una persona, después, por WhatsApp. La página muestra
  precios de referencia ("desde $"), no presupuestos cerrados.
- **No es un catálogo exhaustivo.** Es una vitrina curada que provoca una conversación.

### Dónde encaja

La página es **una pieza de un sistema comercial más grande**. Junto a ella hay anuncios,
un canal de WhatsApp atendido por varios asesores, un asistente que responde primero y una
base de datos donde vive cada solicitud. El sitio es una de varias puertas de entrada.

Lo importante para el diseño: **el sitio entrega el contacto con contexto y ahí termina su
trabajo**. Si alguien escribe desde la página del viaje al Eje Cafetero, el asesor ya tiene
que saber que venía de ahí, sin volver a preguntarlo. Por eso los botones de WhatsApp llevan
un mensaje escrito de antemano y el formulario arrastra de dónde salió.

---

## 4. A quién le habla

Viajeros colombianos, principalmente de 25 a 55 años, que planean un viaje en pareja, en
familia o con amigos. Buscan por celular, comparan, dudan, y sobre todo **quieren que
alguien les diga con claridad cuánto cuesta y qué incluye**.

Tres cosas que hay que tener presentes todo el tiempo:

- **Casi todos llegan desde el celular** (más de 8 de cada 10). La vista de móvil no es una
  adaptación: es la principal. El escritorio es la versión secundaria.
- **Tienen prisa y poca paciencia.** Si la página tarda en abrir, se van antes de verla.
- **Vienen con desconfianza.** No por la marca, por el rubro. El diseño tiene que reducir esa
  desconfianza, no aumentarla con presión comercial.

Y una regla de redacción que sale de ahí: **escribe simple**. Nivel de lectura de quinto a
séptimo de primaria. Frases cortas. Sin tecnicismos, sin jerga de agencia, sin anglicismos
innecesarios. Español de Colombia, hablando de "tú".

---

## 5. Identidad visual

### Colores

| | Código | Para qué |
|---|---|---|
| Azul marino | `#003062` | Color principal: fondos oscuros, títulos, texto sobre blanco |
| Turquesa | `#00AAC3` | Secundario: acentos, íconos, subrayados, bordes activos |
| Naranja | `#FF6A03` | Acento: botón principal, destacados |
| Verde WhatsApp | `#25D366` | **Solo** el botón de WhatsApp, porque la gente reconoce ese verde |

Los neutros son una escala de grises **fríos**, con matiz azulado, en armonía con el azul
marino. No grises puros. Fondo base blanco, y una superficie clara alternativa (cercana a
`#F4F7FA`) para separar secciones sin usar bordes.

### Combinaciones que sí y que no

Esto no es preferencia estética, es legibilidad. Ya está verificado:

- ❌ Naranja con texto **blanco**: no se lee bien. No lo uses nunca.
- ✅ Naranja con texto **azul marino**: así es el botón principal.
- ❌ Verde WhatsApp con texto **blanco**: no se lee. Usa texto azul marino.
- ✅ Azul marino con texto **blanco**: perfecto para botones secundarios y secciones oscuras.
- ✅ Turquesa con texto **azul marino**.
- ⚠️ Ni el turquesa ni el naranja sirven como color de **texto pequeño sobre blanco**. Si
  necesitas texto naranja sobre fondo claro usa `#C24A00`; para turquesa, `#007D91`.

### Tipografía

La marca todavía no tiene tipografías oficiales. Usa una sans-serif geométrica, legible y
amable, y deja anotado que está pendiente de confirmar con quien mantiene la marca.

### Cómo se siente

La marca respira. **Mucho aire, jerarquía clara, pocos elementos compitiendo.** El enemigo
declarado de BroWay es la saturación: nada de páginas llenas de sellos, banderines, ventanas
emergentes y avisos parpadeantes. Si una sección se siente apretada, quítale cosas.

### El logo

Se usa en horizontal en el encabezado, con espacio libre alrededor (más o menos la mitad de
su altura). No lo pegues al borde ni lo encojas hasta que deje de leerse.

---

## 6. Cómo habla la marca

**Arquetipos:** el Cuidador (protege, orienta, reduce la incertidumbre) y el Explorador
(despierta curiosidad). En ese orden.

**Tono:** claro, cercano, sereno, inspirador, honesto, útil.

La regla maestra, tal como la define el manual de marca: hablar como **una persona que
conoce el camino**, no como una marca que necesita demostrar que lo sabe todo.

### Palabras que sí

Claridad · acompañamiento · próxima parada · opciones · camino · descubrir · elegir ·
preparar · experiencia · confianza · tranquilidad · "viajar a tu manera".

### Palabras prohibidas

El manual las veta explícitamente. No las escribas ni en variantes:

- "la mejor oferta"
- "precio garantizado"
- "viaja sin preocupaciones"
- "cumplimos tus sueños"
- "te resolvemos todo"
- "financiamos" o "crédito" — la agencia **no** presta dinero
- "últimos cupos" como muletilla permanente
- exceso de diminutivos y jerga

### Llamados a la acción aprobados

Usa estos textos. No inventes otros.

**Principales:** "Cotiza tu próxima parada" · "Cotiza por WhatsApp" · "Habla con un asesor" ·
"Planeemos tu viaje"

**Secundarios:** "Descubre las opciones" · "Ver itinerario día a día" · "Consulta
disponibilidad" · "Cuéntanos cómo quieres viajar"

**Frases de apoyo bajo los botones:** "Respuesta en minutos, sin compromiso" · "Te asesora un
experto en viajes, no un bot" · "Precio final claro antes de reservar"

### "Next Stop"

Es la firma narrativa de la marca. **Máximo una vez por página**, como titular de una
sección (por ejemplo: "¿Cuál será tu Next Stop?"). Nunca se traduce, nunca se mezcla con
otras frases, nunca va pegada al logo. No es parte del logotipo.

---

## 7. Reglas innegociables

Estas cinco no se negocian con criterio estético. Rompen la marca o la ley.

### 7.1 Nada de urgencia inventada

Prohibido cualquier contador, temporizador, "oferta que vence en 04:59" o barra de "quedan
pocos" que no corresponda a un dato real. La presión comercial es el enemigo declarado de la
marca, y además destruye la confianza que el sitio existe para construir.

Sí puedes mostrar escasez **real**: "quedan 4 cupos para la salida del 15 de marzo" es un
dato, y se muestra con serenidad, no en rojo parpadeante.

### 7.2 Ningún dato legal inventado

El número de registro turístico (RNT), el NIT, la dirección, el teléfono y las afiliaciones
gremiales **no están confirmados**. Escribe literalmente `RNT XXXXXX` y deja anotado que hay
que verificarlo antes de publicar.

No copies el registro de otra agencia. No inventes "+10.000 viajeros felices". No pongas
reseñas firmadas con nombres de personas reales. Los testimonios van con nombres
evidentemente de relleno ("Nombre Apellido — Viajó a X").

### 7.3 El precio siempre viene explicado

Cada vez que aparezca un "desde $", justo al lado —con el mismo peso visual, **nunca en
letra chica gris**— va el bloque que lo explica:

> **Cancún desde $X por persona**
> Saliendo desde Bogotá · 4 noches · ocupación doble · incluye [lo que incluya].
> Tarifa verificada el [fecha], sujeta a disponibilidad y reconfirmación.
> RNT XXXXXX

Sin la ciudad de salida y la ocupación, el precio no significa nada: el mismo viaje cuesta
distinto saliendo de Medellín o de Bogotá, y en habitación doble o sencilla. Ocultar eso es
justo lo que hacen las agencias en las que la gente no confía.

### 7.4 Las ofertas vencen, y la página lo dice

Cada oferta publicada tiene su propio código, una fecha hasta la que es válida y una fecha
en la que se verificó por última vez.

Cuando una oferta se vence, la página **no desaparece ni miente**. Muestra un mensaje claro:
*"Esta tarifa estuvo vigente hasta el [fecha]. Te preparamos una actualizada"*, con el botón
de WhatsApp para pedir la nueva. Quien llegó a una oferta vencida sigue siendo alguien con
muchas ganas de viajar — no lo pierdas con un error.

Y una oferta que todavía no ha sido revisada por una persona **nunca se publica**.

### 7.5 El permiso para usar los datos

Todo formulario lleva una casilla de autorización que:

- **No viene marcada.** Nunca. La persona la marca o no envía.
- **No deja enviar el formulario hasta que se marca.**
- Explica para qué se usan los datos: atender la solicitud, cotizar, hacer seguimiento,
  enviar información comercial por WhatsApp, llamada y correo, **y publicidad
  personalizada**. Esa última parte no se puede omitir si los datos van a usarse para
  anuncios.
- Menciona el derecho a consultar, actualizar, eliminar los datos y **retirar el permiso**,
  diciendo por dónde hacerlo.
- Enlaza a la página legal.

El texto definitivo lo tiene que revisar un abogado colombiano: deja el que escribas marcado
como pendiente de validación.

---

## 8. El marco común de todas las páginas

### Encabezado

Logo a la izquierda. Enlaces: Destinos · Paquetes · Cómo pagar · Nosotros · Contacto. A la
derecha, un selector de idioma español/inglés discreto (**texto, no banderas** — una bandera
no representa un idioma) y un botón de WhatsApp compacto.

En celular, menú hamburguesa que abre a pantalla completa, con el botón de WhatsApp fijo
abajo. Se cierra con la tecla Escape.

El encabezado acompaña el scroll; sobre la imagen principal puede ir transparente.

### Botón flotante de WhatsApp

Abajo a la derecha, presente en **todas** las páginas. Lleva un mensaje ya escrito que
cambia según dónde esté el usuario ("Hola, quiero cotizar el paquete Eje Cafetero").

No lo conviertas en una ventanita de chat falsa, ni lo hagas saltar solo a los tres
segundos. Eso es presión comercial.

### Pie de página

Fondo azul marino, texto blanco. Cuatro bloques: marca y propósito · destinos y paquetes ·
empresa (nosotros, cómo pagar, contacto, blog marcado como "próximamente") · legal y
contacto.

Y una franja inferior obligatoria con:

- El sello **RNT XXXXXX** visible.
- El **aviso contra la explotación sexual de niños, niñas y adolescentes**, exigido por ley
  a los prestadores turísticos colombianos.
- Un **mensaje anti-fraude sereno**: invita a verificar el registro de cualquier agencia
  antes de pagar. Sin alarmismo — informa, no asusta.
- El aviso de copyright.

### Idioma

El sitio será bilingüe: español por defecto, inglés como segundo idioma. Al cambiar de
idioma, la persona se queda **en la misma página**, no rebota al inicio.

Deja todos los textos visibles agrupados en un solo lugar por página, no sueltos entre el
diseño, para que traducirlos después sea mecánico.

---

## 9. Las páginas

### 9.1 Inicio

Objetivo: dar credibilidad y llevar a WhatsApp. En este orden:

1. **Portada.** Titular con la propuesta de valor en menos de 12 palabras, en tono de
   Cuidador (dirección de ejemplo, mejórala: "Elige tu próximo viaje con claridad y
   compañía"). Subtítulo de una línea. Botón principal "Cotiza por WhatsApp" y secundario
   "Descubre las opciones". Debajo, "Respuesta en minutos, sin compromiso". Imagen de fondo
   con suficiente oscurecimiento para que el texto se lea de verdad.
   **Prueba de confianza visible sin bajar**: una franja discreta con los sellos y una línea
   tipo "Agencia registrada en Medellín".
2. **Destinos destacados.** Seis tarjetas: imagen, nombre, etiqueta Nacional/Internacional,
   "desde $" y un enlace "Ver opciones". En celular, deslizables en horizontal.
3. **Cómo funciona, en tres pasos.** (1) Cuéntanos cómo quieres viajar · (2) Te damos
   opciones claras · (3) Viajas acompañado. Íconos de línea en turquesa, sin saturar.
4. **Por qué BroWay.** Cuatro bloques con los valores — Claridad, Cercanía, Confianza,
   Responsabilidad — redactados como beneficio para quien viaja, no como palabras sueltas.
5. **Franja "Next Stop".** Ancho completo, fondo turquesa, texto azul marino: "¿Cuál será tu
   Next Stop?" con el botón "Planeemos tu viaje". Esta es la única aparición de "Next Stop"
   en toda la página.
6. **Testimonios.** Tres, claramente marcados como relleno.
7. **Bloque de confianza.** Explica con calma cómo verificar que una agencia es legal en
   Colombia. Enlaza a Nosotros y a Legal.
8. **Cierre.** Sección azul marino con el botón a WhatsApp y el formulario corto como
   alternativa.

### 9.2 Ficha de paquete — la página que más convierte

Es la más importante del sitio. Sigue la estructura al pie de la letra.

**Lo primero que se ve** (tiene que caber en una pantalla de celular):

- Ruta de navegación: Inicio > Paquetes > [nombre].
- Titular: destino + tipo de experiencia + beneficio, en menos de 12 palabras. Por ejemplo:
  "Eje Cafetero 4 días: café y naturaleza con guía local".
- Galería: una imagen grande y miniaturas. En celular, deslizable en horizontal.
- **Precio con su bloque explicativo** (§7.3). El "desde" y el "por persona" tienen que ser
  evidentes.
- Duración y próxima fecha de salida.
- Botón principal "Cotiza por WhatsApp" — con el nombre del paquete ya escrito en el mensaje
  — y secundario "Ver itinerario día a día".

**Barra fija en celular.** Al bajar, aparece abajo una barra con el precio "desde" a la
izquierda y el botón de WhatsApp a la derecha. Cuando esa barra está visible, el botón
flotante se esconde: no apiles dos botones iguales.

**Después, en orden:**

- **Lo mejor del viaje**: 4 a 6 puntos escaneables, con íconos turquesa.
- **Itinerario día a día**: desplegable, un panel por día, el primero abierto. Máximo dos o
  tres experiencias por día — no lo llenes.
- **Qué incluye / qué no incluye**: dos columnas. Palomita turquesa contra equis en gris
  (**no rojo**: lo que no está incluido no es un error, es información). Esta sección se
  redacta con honestidad: es un valor de marca, no un trámite.
- **Fechas de salida y cupos**: lista de fechas con los cupos reales. Si quedan pocos, se
  dice como dato. Sin contadores.
- **Formas de pago**: "Sepáralo con el 30% y paga el saldo en cuotas". No escribas
  "financiamos" ni "crédito". Aclara que el pago se coordina con un asesor por WhatsApp.
- **Política de cancelación y preguntas frecuentes**, en desplegables.
- **Formulario corto** (§9.9).
- **Sellos de confianza y paquetes relacionados.**

### 9.3 Destinos: listado y detalle

**Listado.** Titular corto, filtro simple (Todos / Nacionales / Internacionales) y una
cuadrícula de tarjetas. Botón de WhatsApp al final.

**Detalle de cada destino.** Aquí pesa el contenido, porque es lo que la gente busca cuando
escribe "viaje a Eje Cafetero 4 días":

- Imagen grande y el nombre del destino como titular.
- Dos o tres párrafos de introducción: qué es, por qué ir, para quién es. Tono Explorador:
  inspira sin exagerar.
- **Mejor época para viajar**: bloque informativo útil, no comercial.
- Paquetes disponibles en ese destino.
- **Qué hacer**: 4 a 6 experiencias destacadas.
- Preguntas frecuentes del destino.
- Botón de WhatsApp con el destino ya escrito en el mensaje.

No dejes una página vacía con solo tarjetas: si no hay contenido real, no cumple su función.

### 9.4 Página de campaña

Es la página a la que llega quien hace clic en un anuncio. La regla de oro es que **debe
leerse como la continuación exacta del anuncio**: mismo titular, misma oferta, misma imagen.
Si no coincide, entre 4 y 6 de cada 10 personas se van de inmediato.

Diferencias con el resto del sitio:

- **Sin menú de navegación.** Solo el logo y el botón de WhatsApp. Cero enlaces que saquen a
  la persona del camino.
- **Pie de página mínimo**: registro turístico, aviso legal y nada más.
- **Una sola idea y un solo llamado**, repetido tres o cuatro veces a lo largo del scroll.

Estructura: portada con el mensaje del anuncio → prueba de confianza → qué incluye (4-6
puntos) → llamado intermedio a WhatsApp → itinerario resumido (no el día a día completo) →
formulario corto → preguntas frecuentes breves (las 4 que resuelven la objeción principal) →
llamado final.

Estas páginas **no deben aparecer en buscadores**: compiten con las páginas de destino.

Y todo su contenido tiene que poder cambiarse sin rehacer la página: cada campaña nueva
reutiliza la misma estructura con otro texto y otra imagen.

### 9.5 Nosotros

Es la página que sostiene la credibilidad, el objetivo declarado del MVP.

- La historia real de la marca (§2), contada con calma.
- Propósito, misión y visión, redactados como texto de sitio, no como diapositivas.
- Los seis valores.
- **Un bloque de legalidad destacado**: registro turístico, afiliaciones, dirección en
  Medellín. Este bloque es la razón de ser de la página, no un detalle del pie.
- Botón de WhatsApp.

### 9.6 Contacto

Dos caminos claros y equilibrados: WhatsApp (destacado) y el formulario corto, para quien
prefiere no chatear.

Incluye horario de atención, dirección y un mapa que cargue después del resto de la página,
nunca antes.

El formulario tiene sus cuatro estados visibles: en reposo, enviando, enviado con éxito y
con error — todos redactados en el tono sereno de la marca.

### 9.7 Cómo pagar

Explica con total transparencia el abono del 30% para separar el viaje y el saldo en cuotas.
Medios de pago aceptados. Qué pasa después de pagar el abono.

Prohibido decir "financiamos", "crédito" o "sin intereses garantizados" si no está
confirmado. Marca como pendiente cualquier condición comercial no verificada.

### 9.8 Gracias

Es corta pero importante: es donde la persona confirma que su solicitud llegó, y donde se
evita que se enfríe entre el envío y la primera respuesta.

- Confirmación serena, sin euforia: "Listo, recibimos tu solicitud".
- **Una expectativa concreta de respuesta**: "Te escribimos por WhatsApp en menos de X
  minutos, en horario de atención". Deja el tiempo pendiente de confirmar con la operación,
  y **nunca prometas atención 24/7**.
- Qué pasa ahora, en dos o tres pasos.
- Botón para adelantar la conversación por WhatsApp, conservando el contexto de la página
  desde la que se envió.
- Enlaces suaves a Destinos y a Preguntas frecuentes.
- **No pidas más datos aquí.** Ni un segundo formulario, ni una encuesta.

Esta página no debe aparecer en buscadores.

### 9.9 El formulario corto (va en varias páginas)

**Máximo cuatro campos visibles, y son estos:**

1. Nombre
2. WhatsApp / teléfono
3. **Ciudad de salida**
4. Fecha aproximada del viaje y número de viajeros

No es una lista negociable: son exactamente los datos que el asesor necesita para poder
cotizar sin volver a preguntar. La ciudad de salida es la que más se olvida y la que más
falta hace.

El destino y la oferta que la persona estaba viendo **se envían solos**, tomados de la
página. El asesor no debe preguntar "¿cuál viaje viste?".

**No pidas presupuesto en el formulario** — genera fricción y el asesor lo obtiene mejor
conversando. **No pidas nunca** ingresos, estrato ni capacidad de pago: no sirven y son
datos sensibles.

Más la casilla de autorización de §7.5. Botón: "Cuéntanos cómo quieres viajar". Al enviar
con éxito, lleva a la página de Gracias.

### 9.10 Legal

Un índice de secciones (lateral en escritorio, desplegable en celular) con:

1. Política de tratamiento de datos personales: para qué se usan, quién es responsable,
   derechos de la persona (consultar, actualizar, eliminar, **retirar el permiso**), por
   dónde ejercerlos, y aviso de que los datos pueden manejarse fuera de Colombia.
2. Términos y condiciones.
3. Política de cancelación y cambios.
4. Aviso contra la explotación sexual de niños, niñas y adolescentes.
5. Registro Nacional de Turismo.
6. **Registro de Números Excluidos**: explica que cualquier persona puede pedir no recibir
   mensajes comerciales, y cómo hacerlo.

Muestra de forma visible la **versión y la fecha** de la política ("Versión 1 — vigente
desde [fecha]"): es lo que permite saber después qué aceptó cada persona.

Nota visible: la versión en **español es la que tiene validez legal**; la traducción al
inglés es informativa y no la sustituye.

Todo el contenido legal va como estructura de relleno, marcado como pendiente de redacción
por un abogado. **No escribas cláusulas legales definitivas.**

### 9.11 Preguntas frecuentes

Las preguntas generales, no las de un viaje concreto (esas viven en su ficha): cómo se
reserva, cómo funciona el 30%, qué pasa si hay que cambiar fechas, cómo verificar que la
agencia es legal, qué documentos se necesitan, y cómo se tratan los datos personales.
Desplegables, y botón de WhatsApp al final.

---

## 10. Qué NO construir todavía

Pedir esto genera trabajo que hay que borrar:

| No pedir | Por qué |
|---|---|
| Carrito, checkout o pago en línea | El sitio no vende: genera conversaciones |
| Reserva con disponibilidad en tiempo real | No existe ese inventario |
| Motor de comparación de ofertas | Es trabajo interno de la agencia, no público |
| Cuenta de usuario o portal del cliente | Fuera del alcance |
| Blog con artículos | Deja el enlace marcado como "próximamente" |
| Cuestionario "encuentra tu viaje ideal" | Fase posterior |
| Chat propio o ventana de chat simulada | El canal es WhatsApp, y de verdad |
| Textos legales definitivos | Riesgo legal real: los redacta un abogado |
| Cualquier contador o urgencia inventada | Prohibido por marca (§7.1) |
| Animaciones llamativas y efectos pesados | La marca respira; y hacen la página lenta |

Tampoco menciones nunca, ni en el sitio ni en la publicidad, que la agencia **compara
mayoristas** para armar los viajes. Es el proceso interno. Hacia afuera la propuesta es
acompañamiento, respaldo, curaduría de opciones, tarifas competitivas y claridad de
condiciones.

---

## 11. Revisión antes de aceptar el resultado

**Marca y contenido**

- [ ] "BroWay Adventures" bien escrito en todas partes.
- [ ] "Next Stop" aparece como máximo una vez por página.
- [ ] Ninguna palabra de la lista prohibida (§6).
- [ ] Los llamados a la acción son los aprobados, no inventados.
- [ ] Ningún contador, temporizador ni urgencia falsa.
- [ ] Ningún registro turístico, NIT o teléfono inventado — todos como `XXXXXX` y marcados
      como pendientes.
- [ ] Ninguna cifra inventada de viajeros ni reseña con nombre real.
- [ ] Las páginas respiran: no hay ninguna saturada de sellos, avisos y banderines.

**Precio y ofertas**

- [ ] Ningún "desde $" suelto: todos con su bloque explicativo (ciudad de salida, ocupación,
      noches, fecha de verificación, registro turístico).
- [ ] Existe el estado de oferta vencida, y no es un error ni una página rota.

**Conversión**

- [ ] El botón de WhatsApp está en todas las páginas y lleva un mensaje ya escrito, distinto
      según dónde esté.
- [ ] En la ficha de paquete, la barra fija de celular y el botón flotante no se apilan.
- [ ] El formulario tiene exactamente los cuatro campos de §9.9, incluida la ciudad de
      salida.
- [ ] El formulario no pide presupuesto, ingresos ni estrato.
- [ ] Al enviar con éxito lleva a la página de Gracias.

**Legal y accesibilidad**

- [ ] La casilla de autorización no viene marcada en ningún formulario.
- [ ] No se puede enviar el formulario sin marcarla.
- [ ] El texto de la autorización menciona la publicidad personalizada.
- [ ] El pie de página lleva registro turístico, aviso de protección a menores y mensaje
      anti-fraude.
- [ ] Ningún botón naranja con texto blanco, ningún botón de WhatsApp con texto blanco.
- [ ] Se puede navegar con el teclado y se ve claramente dónde está el foco.
- [ ] En una pantalla de celular no hay que desplazarse en horizontal para leer.

---

## 12. Pendientes que bloquean la versión final

No impiden generar el MVP, pero sí cerrarlo. Hay que resolverlos con quien mantiene la marca
y con la agencia:

1. **Tipografías oficiales** — hoy se usa una sustituta.
2. **Códigos de color oficiales** — los de §5 se extrajeron del logo, no de una guía formal.
3. **Lineamientos de fotografía** — qué estilo de imagen sí y cuál no.
4. **Familia de íconos oficial.**
5. **Archivos del logo en sus cuatro versiones** (horizontal, vertical, símbolo y el ícono
   pequeño para la pestaña del navegador). Hoy solo hay una imagen.
6. **Los datos legales reales**: registro turístico, NIT, dirección, teléfono, afiliaciones.
7. **El tiempo real de respuesta** que se promete en la página de Gracias.
