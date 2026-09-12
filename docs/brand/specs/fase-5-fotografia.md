# Spec — Fase 5 · Fotografía

> **Intent:** [`../intent.md`](../intent.md) §Fase 5 · **Fuente de marca:**
> [`../sistema-de-identidad.md`](../sistema-de-identidad.md) §4.9
> **Depende de:** Fase 2 (la placa de protección de la firma sobre foto)
> **Decidido (D-D, 2026-09-11):** la fase se ejecuta **sin esperar** a la fotografía propia
> **Rama:** `fase-1/marca-5-fotografia` · **PR:** a `main`, con `CURRENT.md` en el mismo PR
> **Escrito:** 2026-09-11 · **Estado:** listo para plan

## 0. Objetivo

> **Mostrar cómo se siente viajar, no solamente cómo luce el destino.**

Ese es el principio visual del manual, y es el que hoy no se cumple. Esta fase no produce
fotografía —eso depende del cliente— sino que hace tres cosas que sí están en nuestra mano:
**decir qué foto entra y cuál no**, **corregir lo que se puede corregir sin material nuevo**, y
**llevar la dirección fotográfica al punto donde de verdad se decide**, que no es el repo: es el
panel desde el que el equipo comercial sube las fotos del catálogo todos los días.

## 1. Auditoría

### 1.1 Lo técnico

22 imágenes en `public/destinos/`, **2,9 MB** en total, todas WebP, en cuatro familias de encuadre:

| Uso | Ratio | Dimensiones | Cuántas |
|---|---|---|---|
| Hero de escritorio | 16:9 | 1920×1080 | 6 |
| Hero móvil | 2:3 | 900×1350 | 1 |
| Tarjeta de destino | 4:3 | 1000×750 · 1200×900 | 7 |
| Galería / miniatura | 1:1 | 600×600 | 6 |
| Campaña | 16:9 | 1600×900 | 1 |

El formato y el peso están bien resueltos: nada que arreglar ahí.

### 1.2 Lo que muestran — revisadas 9 de 22

| Imagen | Personas | Luz | Encuadre | Veredicto |
|---|---|---|---|---|
| `home-hero` · montañas con niebla | **no** | natural ✓ | espacio negativo arriba ✓ | «cómo luce», no «cómo se siente» |
| `home-hero-movil` · el mismo paisaje | **no** | natural ✓ | ✓ | ídem |
| `cartagena-hero` · calle colonial | **no** | plana, día nublado | composición llena, sin zona limpia | ídem |
| `cartagena` · calle de colores | **no** | cálida ✓ | llena | reconocible ✓, sin experiencia humana |
| `san-andres` · playa | **no** | natural ✓ | ✓ | postal |
| `punta-cana` · sombrillas y tumbonas **vacías** | **no** | natural ✓ | media imagen es arena sin foco | postal de resort desierto |
| `eje-cafetero-campana` · laderas | **no** | cielo gris y plano | ✓ | apagada |
| `eje-cafetero-3` · ladera verde | **no** | cielo gris y plano | ✓ | apagada |
| `nosotros` · grupo caminando | **sí, de espaldas** | contraluz cálido ✓ | ✓ | stock genérico: sin rostros, sin diversidad reconocible del público colombiano |

**De nueve imágenes revisadas, ocho no tienen personas y la única que las tiene es stock de
espaldas.** El manual pide justo lo contrario, y además prohíbe «fotografías genéricas de bancos de
imágenes con poses artificiales».

### 1.3 Un defecto de accesibilidad, no solo de estética

El hero de la home describe su primera imagen como **«Viajeros mirando un valle de montaña al
amanecer»** (`messages/es.json` → `home.heroImagenAlt`). **En esa foto no hay viajeros**: es un
paisaje vacío. Quien usa lector de pantalla recibe una descripción de algo que no está en la
página. El `alt` se escribió para la foto que se quería, no para la que hay.

El segundo slide dice «Calles amuralladas de Cartagena **al atardecer**» sobre una foto de luz
plana y cielo nublado. Mismo problema, menor gravedad.

## 2. Alcance

| Superficie | Qué entra |
|---|---|
| **Repo** | Las 22 imágenes de `public/destinos/`: veredicto una por una, re-encuadre donde el foco esté mal y corrección de los `alt` que no describen la foto |
| **Reglas** | Los seis criterios del manual traducidos a reglas verificables, y las reglas de encuadre por uso |
| **Backoffice** | La dirección fotográfica **en el punto de carga**: qué se pide, qué se rechaza y por qué, visible donde se sube la foto |
| **Sistema de diseño** | La sección de fotografía en `/design-system`: los criterios, los ratios y los ejemplos de sí/no |

**Fuera de alcance:** producir fotografía · las fotos del catálogo que ya están en Supabase, que las
cambia el equipo comercial desde el panel y no el repo · la composición de marca sobre foto como
pieza gráfica —placa de protección— que entra con la Fase 2 · el `alt` como texto de marca, que lo
audita la Fase 3; aquí solo se corrige el que **describe una foto distinta de la que hay**.

## 3. Los seis criterios, traducidos a reglas

| Criterio del manual | Regla verificable |
|---|---|
| **Personas** | Expresiones naturales, diversidad de edades, relaciones auténticas. **Rostro o gesto visible**: una foto de espaldas no cumple «expresión natural» |
| **Luz** | Natural, tonos limpios, sensación de amplitud. **Se rechaza el cielo gris plano** y la subexposición |
| **Composición** | Espacio negativo **donde va el texto**, no en cualquier parte (§4) |
| **Momentos** | Preparación, llegada, descubrimiento o conexión. Una escena con **una decisión o un encuentro**, no un lugar vacío |
| **Destinos** | Reconocible cuando el destino es el tema. Equilibrio entre playa, ciudad, naturaleza, cultura y experiencia en el conjunto |
| **Edición** | Color natural. Sin filtros extremos, sin sobresaturación, sin cielos irreales |

### 3.1 Cuántas fotos deben tener personas — interpretación declarada

El manual no dice «todas». Exigirlo sería absurdo en una ficha de destino cuyo tema es el lugar.
Este spec declara la proporción, y queda sujeta a ratificación como el resto de interpretaciones:

- **El hero de la home y el de campaña: personas, obligatorio.** Son las dos piezas que declaran de
  qué va la marca, y son donde «cómo se siente viajar» tiene que verse.
- **El conjunto publicado: al menos una de cada tres** imágenes muestra personas o acción humana
  reconocible. Hoy la proporción es **1 de 22**.
- **Las fichas de destino** pueden mostrar el lugar sin personas, si el lugar es reconocible.

## 4. Encuadre y espacio negativo, por uso

El espacio negativo no es «que sobre sitio»: es que sobre **donde va el texto**.

| Uso | Ratio | Dónde vive el texto | Qué exige a la foto |
|---|---|---|---|
| Hero de escritorio | 16:9 | Abajo a la izquierda | Tercio inferior izquierdo sin detalle que compita; el sujeto, a la derecha o al centro |
| Hero móvil | 2:3 | 72 % inferior | Sujeto en el tercio superior; la mitad inferior, limpia |
| Hero de campaña | 16:9 | Izquierda, con CTA | Igual que el hero de escritorio |
| Tarjeta de destino | 4:5 y 4:3 | Fuera de la foto, debajo | Foco centrado; **nada importante en el borde inferior**, que es donde caen badge y precio |
| Galería de oferta | 4:3 · 16:10 · 1:1 | Fuera | Foco centrado; la miniatura cuadrada recorta los lados |

**El recorte es parte de la decisión, no un accidente del CSS.** Una foto que solo funciona
completa no sirve para una tarjeta.

## 5. Qué se hace con las 22 fotos actuales

Cada una recibe **uno de tres veredictos**, y el inventario completo va en el PR:

1. **Se queda.** Cumple los seis criterios en su uso.
2. **Se re-encuadra.** El contenido sirve pero el foco está mal para su ratio —el caso de
   `punta-cana`, con media imagen de arena vacía—. Se recorta; no hace falta material nuevo.
3. **Se reemplaza.** No cumple y no se arregla recortando. Se marca como **provisional**, se publica
   igual —un sitio sin fotos no es una opción— y entra en la lista priorizada que se pide al
   cliente. Esto es lo que decidió **D-D**: la fase entrega sin material nuevo y deja la petición
   hecha, en vez de esperar.

**Prioridad de reemplazo, en este orden:** hero de la home (es la primera imagen y hoy contradice el
principio visual) → `nosotros` (habla de las personas de la marca y muestra stock de espaldas) →
las dos de luz gris y plana → el resto.

**Los `alt` se corrigen ya**, en los dos idiomas, describan lo que describan hoy: el `alt` describe
la foto que está publicada, no la que se querría publicar.

## 6. La dirección fotográfica donde se decide: el panel

El catálogo vivo no se alimenta desde el repo. Se alimenta desde `app/admin/**`, donde hoy la carga
de fotos comprime a ~2000 px y acepta JPEG, PNG, WebP y AVIF, **sin decir nada sobre qué foto subir**.
Mientras eso siga así, la dirección fotográfica del manual no llegará al 90 % de las imágenes que
ve un visitante.

Lo que esta fase añade en el punto de carga:

- **Qué se pide**, en una línea por criterio, junto al campo: personas y momento reconocible · luz
  natural · espacio libre donde va el texto · destino reconocible · sin filtros.
- **Qué se rechaza**, explícito: fotos con marca de agua del mayorista, collages, texto incrustado,
  capturas de flyer y fotos con logo de otra agencia.
- **Qué ratio se va a usar** y qué parte se recorta, para que quien sube sepa dónde no poner el
  sujeto.

Es copy y ayuda contextual, no validación automática: el sistema no puede juzgar una foto, pero sí
puede decir qué se espera. Su tono sigue la voz (Fase 3): explica, no regaña.

## 7. Criterios de aceptación

| # | Criterio | Cómo se verifica |
|---|---|---|
| **F-1** | Las 22 imágenes tienen veredicto escrito: se queda · se re-encuadra · se reemplaza | Inventario en el PR |
| **F-2** | Ningún `alt` describe algo que no está en la foto, en ninguno de los dos idiomas | Revisión foto por foto contra su `alt` |
| **F-3** | Las fotos con veredicto «re-encuadra» están recortadas y su foco cumple §4 | Vista en los tres ratios |
| **F-4** | Las que se reemplazan están marcadas como provisionales y la lista priorizada está pedida al cliente | `public/destinos/README` + el registro de D-D |
| **F-5** | El panel muestra qué se pide y qué se rechaza en el punto de carga | Recorrido de las dos pantallas de carga |
| **F-6** | `/design-system` publica los criterios, los ratios y ejemplos de sí/no | Abrir la guía |
| **F-7** | El peso total no sube y el LCP móvil no empeora | Lighthouse antes/después en el PR |
| **F-8** | Ninguna foto publicada lleva marca de agua, texto incrustado o logo ajeno | Revisión visual del catálogo |
| **F-9** | `pnpm build` pasa | CI local |

## 8. Verificación

1. **Vista, imagen por imagen**, contra los seis criterios y contra su uso real —no en el
   explorador de archivos, sino en la página donde se publica y en los tres ratios.
2. **Con el texto encima.** Una foto de hero se juzga con el titular puesto: es la única manera de
   ver si el espacio negativo está donde hace falta.
3. **En móvil primero.** El 83 % del tráfico es móvil y el recorte vertical es el más agresivo.
4. **Medida** de peso y LCP antes y después.

## 9. Riesgos

| Riesgo | Señal | Respuesta |
|---|---|---|
| La fase se bloquea esperando fotografía propia | No se entrega nada | El alcance está diseñado para no depender de ella: veredictos, recortes, `alt` y panel se hacen igual |
| Se sustituye stock por más stock | Fotos nuevas igual de genéricas | El criterio no es «que sea nueva»: es que tenga persona, momento y luz. Un stock que los cumpla es mejor que uno propio que no |
| Se publica la imagen del manual vivo como fotografía real | Aparece en una página | Está prohibido: es generada y su propio pie la declara de uso referencial. Chocaría con «imágenes que aparenten servicios no ofrecidos» |
| Los recortes rompen el arte de alguna foto | Sujeto cortado | El recorte se decide por uso; si una foto solo funciona completa, su veredicto es «se reemplaza», no «se recorta» |
| El aviso del panel se lee como una regla burocrática | El equipo lo ignora | Va como ayuda junto al campo, en la voz de la marca, y dice el porqué en una línea |

## 10. Entregables del PR

1. El inventario de las 22 imágenes con su veredicto.
2. Los recortes aplicados y los `alt` corregidos en los dos idiomas.
3. `public/destinos/README` con lo provisional y la lista priorizada de reemplazo.
4. La ayuda de carga en las dos pantallas del panel.
5. La sección de fotografía en `/design-system`.
6. Lighthouse antes/después y la tabla de pesos en el cuerpo del PR.
7. `CURRENT.md` actualizado en el mismo PR.
