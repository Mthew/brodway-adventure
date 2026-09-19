# Registro de aprobaciones de marca

> El manual v2.0 §24 define **qué requiere aprobación** —cambios al logo o al color, nuevas
> tipografías, nuevos eslóganes, cambios de tono o posicionamiento, submarcas y alianzas visibles—
> y **quién puede modificarlo**: el diseñador responsable de identidad, la dirección de marca, o un
> proveedor autorizado con aprobación previa. Lo que el proyecto no tenía era dónde anotar que una
> aprobación ocurrió.
>
> Este archivo es ese sitio. **Una fila por decisión**: qué se decidió, quién, cuándo y qué spec la
> aplica. Una decisión que no está aquí no está tomada, por mucho que alguien la recuerde.

## Cómo se usa

- El PR que **aplica** una decisión actualiza también su fila (columna «Aplicada en»).
- Una decisión se **reabre** añadiendo una fila nueva con fecha posterior, nunca editando la
  anterior: el registro es un historial, no un estado.
- Las **interpretaciones declaradas** —lecturas del manual que un spec tuvo que fijar para poder
  avanzar— van en la segunda tabla. Son decisiones con nombre y fecha, reversibles; lo contrario de
  una interpretación silenciosa, que es exactamente cómo se desvió el color de este proyecto.

## Decisiones

Estado: **ratificadas por dirección de marca el 2026-09-11.**

| # | Decisión | Qué se decidió | Fecha | Aplicada en |
|---|---|---|---|---|
| **D-A** | Familia tipográfica | **Manrope**, una sola familia, pesos 400 · 500 · 600 · 700 · 800. Sustituye a Montserrat + Lato + Caveat del manual v2.0. La escala, los pesos por nivel, el mínimo de 14 px y el interlineado 1,45 **no cambian**: valen con cualquier familia | 2026-09-11 | PR [#38](https://github.com/Mthew/brodway-adventure/pull/38) — `app/[locale]/layout.tsx` y `app/admin/layout.tsx` cargan solo Manrope (400-800) |
| **D-B** | «Next Stop» en cursiva | **No.** La firma narrativa deja de escribirse en cursiva, y **Caveat sale del sistema**. Coste nulo: hoy tiene cero usos en componentes. «Next Stop» conserva todas sus reglas: una vez por pieza, sin traducir, sin combinarse con otras frases manuscritas | 2026-09-11 | PR [#38](https://github.com/Mthew/brodway-adventure/pull/38) — mismo PR: retira la carga de Caveat (`--font-accent`) de los dos layouts; `app/[locale]/layout.tsx` comenta explícitamente «(D-B)» junto al cambio |
| **D-C** | Archivos maestros | **Se ejecuta con provisionales marcados**, sin esperar al SVG: favicon e iconos desde el símbolo PNG 1254×1254, firma horizontal recortada del PNG del manual para superficies claras, y previsualización social. El pie y el panel esperan a la monocromática blanca, que no existe. El paquete maestro se pide en paralelo. **Actualización 2026-09-15:** llegó `Kit_Marca_BroWay_Adventures/` (firma oficial, favicons, perfiles sociales y `logo.png` con canal alfa) — deja de ser un provisional derivado, aunque sigue sin SVG, vertical ni monocromática. El pie y el panel siguen bloqueados por esta última | 2026-09-11 | PR [#34](https://github.com/Mthew/brodway-adventure/pull/34) (N-02.1, firma/favicon/icon desde el Kit oficial) + PR [#41](https://github.com/Mthew/brodway-adventure/pull/41) (N-02.3, corrige `apple-icon.png` a 180×180). **Parcial:** la previsualización social (N-02.4/N-02.5, `metadataBase`/`openGraph`) no tiene PR mergeado a la fecha de este registro; el pie y el panel sobre fondo oscuro siguen bloqueados por la monocromática blanca, como ya decía la fila |
| **D-D** | Fotografía propia | **La Fase 5 se ejecuta sin material nuevo**: veredicto imagen por imagen, recortes, `alt` corregidos y guía de carga en el panel. Lo que haya que reemplazar se marca como provisional y se pide al cliente en lista priorizada, empezando por el hero de la home | 2026-09-11 | PR [#36](https://github.com/Mthew/brodway-adventure/pull/36) (N-05.1, veredicto/recortes/`alt` de las 22 fotos) + PR [#39](https://github.com/Mthew/brodway-adventure/pull/39) (N-05.2, cita D-D explícitamente: README de provisionales y lista priorizada) + PR [#46](https://github.com/Mthew/brodway-adventure/pull/46) (N-05.3, guía de carga en el panel) |
| **D-E** | El verde de WhatsApp | **Es color de canal, no de marca.** `#25D366` se mantiene y se documenta en un grupo aparte de la paleta. Identifica al canal, no a BroWay, y no se cambia el CTA dominante del negocio sin analítica que lo respalde. Navy encima mide 5,77:1 | 2026-09-11 | PR [#48](https://github.com/Mthew/brodway-adventure/pull/48) (N-01.1) — `app/globals.css` documenta el grupo «color de canal» y `/design-system` lo declara con el texto «Color de canal» |
| **D-F** | Zona de seguridad en la navegación | **La zona de seguridad protege la firma de otros elementos, no del borde del contenedor.** Firma a 180 px de ancho, ≥31 px libres hasta el siguiente elemento, y el aire vertical que deje la barra de 80 px. La navegación conserva su techo de altura y muestra el wordmark completo | 2026-09-11 | PR [#50](https://github.com/Mthew/brodway-adventure/pull/50) (N-02.2) — dimensiona la firma por ancho en `src/shared/layout/navbar.tsx` y en la landing de campaña |
| **D-G** | El superlativo «Mejores» | **Se mantiene el nombre de sección que fijó el cliente** —«Mejores Ofertas», «Mejores Playas y Hoteles»— y **los dos listados abren con la aclaración** de que es una selección propia y no un ranking; hoy solo la tiene uno. Respeta la especificación funcional del cliente y cubre la evidencia que el manual exige | 2026-09-11 | PR [#30](https://github.com/Mthew/brodway-adventure/pull/30) (N-03.1) — `messages/es.json`/`messages/en.json`: `ofertas.introListado` y `playasYHoteles.intro` abren ambos con la aclaración de selección propia |

## Interpretaciones declaradas

Lecturas del manual que un spec fijó para poder avanzar. Tienen el mismo estatus que una decisión:
se pueden revocar, y mientras no se revoquen, mandan.

| # | Interpretación | Qué dice | Declarada en | Estado |
|---|---|---|---|---|
| **I-1** | Cuántas fotos llevan personas | El manual no dice «todas». **Obligatorio en el hero de la home y en el de campaña**; **una de cada tres** en el conjunto publicado; las fichas de destino pueden mostrar el lugar si es reconocible. Hoy la proporción es 1 de 22 | [Fase 5](specs/fase-5-fotografia.md) §3.1 | Vigente |
| **I-2** | Variante de inglés | **Británica.** Es el statu quo y es consistente: 15 marcadores (`travellers`, `authorise`, `personalised`) y cero americanos. Se declara para que la próxima cadena no llegue en la otra variante | [Fase 3](specs/fase-3-identidad-verbal.md) §3.4 | Vigente |
| **I-3** | Los cinco CTAs aprobados | Rigen el **CTA de conversión**. Se admite una variante que **nombre el canal** («Cotiza por WhatsApp»), porque decir qué pasa al pulsar es información que reduce incertidumbre. Las etiquetas de navegación —«Ver itinerario día a día»— no son CTAs de marca | [Fase 3](specs/fase-3-identidad-verbal.md) §3.1 | Vigente |
| **I-4** | El marco asimétrico del manual vivo | **No se adopta.** Es un recurso de esa pieza de comunicación; trasladarlo a las tarjetas del sitio sería un rediseño, no una aplicación del manual. «Marco abierto» se interpreta como regla de composición: el encuadre no encierra | [Fase 4](specs/fase-4-sistema-grafico.md) §5 | Vigente |

## Lo que sigue pendiente y no es una decisión

No se cierran aquí porque no dependen de un criterio sino de que alguien entregue material:

- **El paquete de archivos maestros**: recibido parcialmente el 2026-09-15
  (`docs/brand/Kit_Marca_BroWay_Adventures/`: firma horizontal, símbolo aislado, favicons, perfiles
  sociales, `logo.png` con transparencia). **Sigue faltando** el SVG, la versión vertical y las
  monocromáticas en negro y blanco — esta última es la que de verdad bloquea la firma sobre fondo
  oscuro (pie y panel), porque la transparencia por sí sola no alcanza si la tinta sigue siendo navy.
- **Fotografía propia**, con la lista priorizada que produce la Fase 5.
- **RNT verificado, testimonios reales, horario, medios de pago y afiliaciones**, que son datos del
  negocio y no de la identidad.
