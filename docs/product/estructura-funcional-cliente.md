# Estructura funcional del website — Agencia de Viajes (Fase 1)

> Transcripción fiel de `Estructura Funcional del Website — Agencia de Viajes.pdf`, entregado por
> el cliente el 2026-08-16. Es la fuente de verdad de **alcance funcional y arquitectura de
> información** — ver la regla de precedencia en [`../README.md`](../README.md). No opina sobre
> stack, i18n ni sistema de diseño; en eso sigue mandando `architecture/spec-tecnica.md`.
>
> El contraste completo contra la documentación y el código existentes está en
> [`brecha-estructura-funcional.md`](brecha-estructura-funcional.md). No edites este archivo para
> reflejar decisiones tomadas después del 2026-08-16: es la transcripción del original. Los
> cambios de alcance van en el documento de brecha o directamente en `plan-fase-1.md`.

## 1. Objetivo del website

El website debe funcionar como una **vitrina comercial dinámica de la agencia de viajes**,
orientada a:

- Mostrar ofertas de manera visual y sencilla.
- Facilitar el descubrimiento de destinos.
- Destacar promociones económicas.
- Destacar hoteles y experiencias de mayor categoría.
- Generar confianza.
- Captar leads.
- Enviar los leads y su contexto directamente a GoHighLevel.
- Permitir que la agencia actualice destinos, imágenes, precios, vigencias y ofertas desde un
  perfil administrativo.

La experiencia debe estar diseñada principalmente para dispositivos móviles, ser rápida, visual,
intuitiva y de fácil mantenimiento.

El recorrido principal será:

**Visitante → Destino/Oferta → Ficha comercial → CTA/Formulario/WhatsApp → GoHighLevel**

GoHighLevel continuará posteriormente con la gestión comercial del lead, tal como está definido
en el sistema comercial de la agencia.

## 2. Menú principal

El menú principal debe contener exactamente:

**Inicio | Mejores Ofertas | Mejores Playas y Hoteles | Destinos Internacionales | Destinos
Nacionales | Pueblos de Antioquia | Nosotros | Contacto**

Debe existir adicionalmente un botón visible de:

**WhatsApp / Hablar con un asesor**

En móvil deberá implementarse un menú desplegable sencillo, manteniendo acceso fácil a WhatsApp.

## 3. Inicio

La Home debe funcionar como la principal vitrina comercial de la agencia.

La estructura recomendada es:

1. Hero principal.
2. Mejores Ofertas.
3. Mejores Playas y Hoteles.
4. Destinos Internacionales.
5. Destinos Nacionales.
6. Pueblos de Antioquia.
7. Captación de leads.
8. Elementos de confianza.
9. Testimonios.
10. CTA final.
11. Footer.

## 4. Hero principal

Debe utilizar una fotografía o video turístico de alto impacto visual.

Debe incluir:

- Propuesta de valor corta.
- Mensaje comercial.
- CTA hacia las ofertas.
- CTA hacia asesoría.

Ejemplo conceptual:

**Encuentra tu próximo viaje**

Ofertas nacionales e internacionales seleccionadas para que encuentres una alternativa que se
adapte al viaje que quieres vivir.

**Ver ofertas** · **Hablar con un asesor**

El diseño debe priorizar la imagen y evitar exceso de texto.

## 5. Mejores Ofertas

### Objetivo

Esta sección está dirigida al cliente cuya principal motivación es:

**Encontrar las opciones más económicas disponibles.**

Debe mostrar las promociones que la agencia quiera destacar por tener tarifas especialmente
atractivas.

### En la Home

Mostrar aproximadamente **6 ofertas**.

Cada tarjeta debe mostrar:

- Imagen.
- Destino.
- Fecha o periodo.
- Duración cuando corresponda.
- Ciudad de salida cuando corresponda.
- Hotel cuando sea relevante.
- Precio desde.
- CTA.

Ejemplo:

> **Punta Cana**
> 8 al 12 de junio
> Salida desde Medellín
> **Desde $2.649.000**
> **Ver oferta**

Al finalizar la sección: **Ver todas las ofertas**

## 6. Página Mejores Ofertas

Debe mostrar todas las promociones activas que la agencia haya seleccionado para esta sección.

La navegación puede dividirse simplemente en:

**Todas | Internacionales | Nacionales | Pueblos de Antioquia**

Las ofertas deben conservar una presentación altamente visual basada en tarjetas.

La agencia deberá poder decidir desde administración:

- Qué ofertas aparecen en esta sección.
- En qué orden se muestran.
- Cuándo dejan de aparecer.

## 7. Mejores Playas y Hoteles

### Objetivo

Esta sección está dirigida al cliente que:

**Busca una mejor experiencia de viaje y está interesado en hoteles y alternativas de alta
categoría, sin que el precio más económico sea su principal criterio.**

Debe funcionar como una **selección curada por la agencia**. No se requiere un sistema de
puntuación. La agencia decide directamente cuáles son las alternativas que desea destacar.

### En la Home

Mostrar aproximadamente **4 a 6 opciones**. En estas tarjetas la fotografía debe tener mayor
protagonismo.

Debe mostrarse:

- Fotografía del hotel o experiencia.
- Nombre del hotel.
- Destino.
- Principal característica o diferencial.
- Alimentación cuando sea importante.
- Precio desde.
- CTA.

Ejemplo:

> **Hotel Riu Palace Punta Cana**
> Punta Cana, República Dominicana
> Todo incluido · Frente al mar
> **Desde $X.XXX.XXX**
> **Ver oferta**

Al finalizar: **Ver todas las opciones**

## 8. Página Mejores Playas y Hoteles

Debe mostrar las mejores alternativas de hoteles y playas seleccionadas por la agencia.

La presentación deberá privilegiar:

1. Fotografía.
2. Hotel.
3. Destino.
4. Principales características.
5. Precio.

La selección y orden de aparición serán administrados directamente por la agencia.

## 9. Destinos Internacionales

Esta será una de las tres grandes categorías de destinos del website.

Debe contener inicialmente destinos como:

- Punta Cana.
- República Dominicana.
- Cancún.
- México.
- Panamá.
- Aruba.
- Curazao.
- Jamaica.
- Brasil.
- Perú.

El sistema deberá permitir agregar posteriormente cualquier nuevo destino internacional desde el
panel administrativo.

### Presentación

No todos los destinos deben tener necesariamente el mismo protagonismo. La agencia debe poder
seleccionar cuáles aparecen como:

**Destinos destacados**

Por ejemplo: **Punta Cana | Cancún | Panamá | Aruba | Brasil | Perú**

Al finalizar: **Ver todos los destinos internacionales**

## 10. Página Destinos Internacionales

Debe mostrar visualmente todos los destinos internacionales activos.

Cada destino deberá representarse mediante:

- Fotografía.
- Nombre del destino.
- Texto comercial corto opcional.
- CTA.

Ejemplo:

> **Punta Cana**
> Descubre nuestras ofertas disponibles.
> **Ver ofertas**

## 11. Destinos Nacionales

La categoría debe incluir inicialmente:

- San Andrés.
- Cartagena.
- Santa Marta.
- Coveñas.
- Barú.
- Eje Cafetero.
- Amazonas.
- La Guajira.
- Tatacoa.
- Capurganá.
- Nuquí.
- Sur de Colombia.

La agencia deberá poder agregar nuevos destinos desde administración.

### En la Home

Mostrar únicamente los destinos que se quieran destacar comercialmente.

Ejemplo: **San Andrés | Cartagena | Santa Marta | Amazonas | Eje Cafetero | La Guajira**

Al finalizar: **Ver todos los destinos nacionales**

## 12. Página Destinos Nacionales

Debe mostrar todos los destinos nacionales activos mediante tarjetas visuales.

Cada tarjeta debe contener: Imagen · Nombre · CTA.

Ejemplo: **San Andrés** — **Ver ofertas**

## 13. Pueblos de Antioquia

Esta debe permanecer como una categoría principal independiente.

No debe existir inicialmente una lista fija de pueblos. Los destinos visibles dependerán de las
ofertas disponibles suministradas por los proveedores.

Por ejemplo, cuando exista una buena promoción para determinado pueblo, la agencia debe poder:

**Crear destino → asociarlo a Pueblos de Antioquia → cargar oferta → publicar.**

Esto permitirá modificar continuamente el inventario sin depender del desarrollador.

## 14. Página Pueblos de Antioquia

Debe mostrar las ofertas activas disponibles en ese momento.

La prioridad estará en las promociones, no en construir previamente un directorio completo de
pueblos.

Cada tarjeta puede contener: Imagen · Pueblo/destino · Nombre del plan · Duración · Precio · CTA.

## 15. Página individual de cada destino

Cada destino debe contar con una página propia.

Ejemplo: **Punta Cana** — Imagen principal. Descripción comercial corta.

Luego, **Ofertas disponibles**: mostrar únicamente las promociones activas asociadas a ese
destino. Cada oferta llevará a su ficha comercial individual.

El flujo debe ser: **Destino → Oferta → Información → Contacto**

## 16. Tarjeta estándar de oferta

Todas las promociones deben utilizar una estructura visual consistente.

Campos recomendados:

- Imagen.
- Destino.
- Nombre del hotel cuando corresponda.
- Fecha o periodo.
- Duración.
- Ciudad de salida.
- Tipo de alimentación cuando sea relevante.
- Precio desde.
- CTA.

CTA principal: **Ver oferta**

La información debe ser texto real del website y no depender exclusivamente de información
escrita dentro de un flyer.

## 17. Ficha comercial individual de oferta

Cada oferta debe disponer de una URL propia.

Debe mostrar:

### Información principal
Destino · Nombre de la oferta · Hotel · Fechas · Duración · Ciudad de salida · Precio desde.

### Incluye
Listado de servicios incluidos. Ejemplo: Tiquetes aéreos · Traslados · Alojamiento ·
Alimentación · Asistencia médica · Otros beneficios.

### Información adicional
Elementos no incluidos · Requisitos · Documentación · Condiciones relevantes · Vigencia.

### Galería
Fotografías del: destino · hotel · habitaciones · playa · instalaciones · experiencia.

### Conversión
CTA: **Consultar esta oferta** y **Hablar con un asesor**

## 18. Captación de leads

El website debe estar conectado directamente con **GoHighLevel**.

Los formularios deben crear o actualizar el contacto dentro de GHL y permitir que el lead
continúe inmediatamente dentro del sistema comercial.

La integración comercial del website con GHL forma parte de la implementación de la Fase 1
definida con NextGen.

## 19. Formulario general

Debe ser deliberadamente corto para reducir fricción.

Campos recomendados:

- Nombre
- WhatsApp
- ¿Qué tipo de viaje buscas? (Internacional · Nacional · Pueblos de Antioquia · Todavía no lo sé)

CTA: **Quiero asesoría**

La información comercial adicional será recopilada posteriormente mediante el proceso
establecido en GoHighLevel.

## 20. Formulario dentro de cada oferta

Cuando el visitante esté dentro de una oferta concreta, el sistema ya conoce el producto
consultado.

Por lo tanto, el formulario debe ser sencillo:

- Nombre.
- WhatsApp.
- Número de viajeros, si se considera necesario.

CTA: **Consultar disponibilidad**

El resto del contexto debe enviarse automáticamente a GoHighLevel.

## 21. Información automática enviada a GoHighLevel

El usuario no debe tener que escribir información que el website ya conoce.

El sistema deberá enviar, siempre que sea técnicamente posible:

- Fuente: Website.
- Página donde convirtió.
- ID de oferta.
- Nombre de oferta.
- Destino.
- Categoría.
- Sección desde donde llegó: Mejores Ofertas · Mejores Playas y Hoteles · Internacionales ·
  Nacionales · Pueblos de Antioquia.
- URL de la página.
- UTM Source.
- UTM Medium.
- UTM Campaign.
- UTM Content.
- UTM Term, cuando exista.

Esta información permitirá conservar la trazabilidad publicitaria definida en el sistema
comercial:

**Campaña → Anuncio → Lead → Cotización → Reserva → Venta → Margen.**

## 22. WhatsApp

Debe existir un botón de WhatsApp visible durante toda la navegación.

Debe dirigir al canal conectado con GoHighLevel.

Cuando el usuario haga clic desde una oferta específica, el mensaje deberá llevar contexto.

Ejemplo: *"Hola, estoy interesado en la oferta de Punta Cana del 8 al 12 de junio que vi en la
página web."*

Esto permite que el lead llegue al sistema comercial con una intención identificable desde el
inicio.

## 23. Panel administrativo

La agencia debe contar con un perfil administrativo sencillo para actualizar el contenido
comercial sin depender permanentemente del desarrollador.

Debe permitir gestionar como mínimo:

- Destinos.
- Ofertas.
- Imágenes.
- Precios.
- Fechas.
- Vigencias.
- Estados.
- Colecciones.
- Orden de visualización.

## 24. Administración de destinos

Cada destino deberá contener:

- **Nombre** — ej. Punta Cana.
- **Categoría** — Internacional · Nacional · Pueblos de Antioquia.
- **Imagen principal**
- **Descripción corta**
- **Destacado en Home** — Sí / No.
- **Orden de aparición**
- **Estado** — Activo / Inactivo.

Debe existir: **Crear nuevo destino**. Esto permitirá incorporar nuevos productos sin
intervención del desarrollador.

## 25. Administración de ofertas

Cada oferta debe tener como mínimo:

### Información comercial
Nombre de la oferta · Destino · Hotel · Descripción corta · Precio publicado · Fecha o periodo ·
Ciudad de salida · Duración · Alimentación · Incluye · No incluye · Información importante.

### Vigencia
Fecha inicial · Fecha final · Estado.

### Multimedia
Imagen principal · Galería de imágenes.

### Actualización
Fecha de última actualización.

## 26. Clasificación de las ofertas

Una misma oferta debe poder aparecer en diferentes secciones sin tener que duplicarla.

En administración deberán existir opciones como:

- **Mostrar en Mejores Ofertas** — Sí / No.
- **Mostrar en Mejores Playas y Hoteles** — Sí / No.
- **Mostrar en Home** — Sí / No.
- **Orden** — Número de aparición.

Ejemplo: una oferta de Punta Cana puede aparecer simultáneamente en **Destinos Internacionales →
Punta Cana** y también en **Mejores Ofertas** o **Mejores Playas y Hoteles**. La oferta debe
existir una sola vez. Si se modifica su precio, fecha o imagen, el cambio debe actualizarse
automáticamente en todos los lugares donde aparezca.

## 27. Gestión de vigencia

Cada promoción debe poder tener: Fecha inicial · Fecha final · Estado activo/inactivo.

El sistema debe facilitar que una oferta vencida deje de mostrarse públicamente o sea
identificada para revisión administrativa.

La agencia debe poder activar o desactivar manualmente cualquier oferta.

## 28. Gestión de imágenes

La imagen debe tener un papel protagonista en el sitio.

Desde administración debe ser posible: subir imagen principal · reemplazarla · crear galería ·
eliminar imágenes · reordenar galería.

Al cargar imágenes, el website debe optimizarlas automáticamente para navegación web. Esto debe
incluir cuando sea técnicamente viable: redimensionamiento · compresión · generación de WebP y/o
AVIF · diferentes tamaños según dispositivo · lazy loading.

## 29. ALT automático y SEO de imágenes

Cada imagen relevante debe tener texto alternativo.

El sistema debe generar automáticamente un ALT utilizando la información disponible.

Ejemplo: Destino: Punta Cana / Hotel: Riu Palace → **"Hotel Riu Palace en Punta Cana, República
Dominicana"**

Debe existir un campo **Texto ALT** con posibilidad de editar manualmente el resultado cuando sea
necesario.

## 30. Nombre de archivos

Las imágenes deberán almacenarse con nombres descriptivos siempre que sea posible.

Ejemplo: `riu-palace-punta-cana.webp` en lugar de `IMG_593784.jpg`.

## 31. Responsive / Mobile First

La página debe diseñarse principalmente pensando en usuarios provenientes de: Instagram ·
Facebook · Meta Ads · WhatsApp · búsquedas móviles.

Por ello debe priorizarse: navegación táctil · textos legibles · botones grandes · tarjetas
adaptadas a pantallas pequeñas · imágenes responsive · formularios cortos · carga rápida · CTA
fácilmente identificables · WhatsApp accesible.

La información importante nunca deberá depender exclusivamente de pasar el cursor sobre un
elemento.

## 32. Rendimiento

Las páginas deben cargar rápidamente incluso cuando contienen varias fotografías.

Debe optimizarse especialmente: tamaño de imágenes · carga de galerías · scripts · fuentes ·
video · componentes externos.

La experiencia visual no debe comprometer la velocidad del website.

## 33. Elementos de confianza

La página debe ayudar a disminuir la percepción de riesgo antes de que el usuario contacte a un
asesor.

Debe mostrar elementos como: identidad de la agencia · RNT · canales oficiales · datos de
contacto · redes sociales · medios de pago cuando corresponda · testimonios reales · fotografías
o videos de viajeros cuando estén disponibles · información sobre acompañamiento antes, durante
y después del viaje.

## 34. Testimonios

Debe existir una sección para mostrar experiencias reales de viajeros.

Puede incluir: Nombre · Fotografía cuando exista autorización · Destino · Testimonio ·
Calificación cuando corresponda.

La sección debe ser administrable.

## 35. Sección Nosotros

Debe tener como objetivo principal generar confianza.

Contenido: Quiénes somos · Qué hacemos · Tipo de viajes que manejamos · Propuesta de valor ·
Acompañamiento · Información legal de la agencia · CTA hacia asesoría.

## 36. Contacto

Debe existir una página con: WhatsApp · Formulario conectado a GoHighLevel · Redes sociales ·
Datos de contacto · Horarios de atención · Información legal correspondiente.

## 37. Footer

Debe estar presente en todas las páginas.

Debe contener: Logo · RNT · Contacto · WhatsApp · Redes sociales · Enlaces principales ·
Políticas · Tratamiento de datos · Términos y condiciones cuando correspondan.

## 38. Flujo funcional general

```
TRÁFICO
Meta Ads / Instagram / Facebook / Google / Directo
              ↓
           WEBSITE
              ↓
     ┌────────────────────┐
     │    DESCUBRIMIENTO   │
     │                     │
     │ Mejores Ofertas     │
     │ Mejores Playas y Hoteles │
     │ Destinos Internacionales │
     │ Destinos Nacionales │
     │ Pueblos de Antioquia│
     └──────────┬──────────┘
                ↓
             DESTINO
                ↓
             OFERTA
                ↓
         FICHA COMERCIAL
                ↓
     ┌──────────┴──────────┐
     ↓                     ↓
Formulario GHL          WhatsApp
     └──────────┬──────────┘
                ↓
           GOHIGHLEVEL
                ↓
         SISTEMA COMERCIAL
```

## 39. Principio funcional del website

El desarrollo debe conservar una separación clara entre las funciones del website y GoHighLevel.

**WEBSITE.** Debe encargarse de: **Mostrar → organizar → inspirar → informar → generar confianza
→ captar.**

**GOHIGHLEVEL.** Recibirá el lead junto con su contexto para continuar el proceso comercial
definido por la agencia.

El resultado final debe ser una página **visual, sencilla, rápida, administrable y orientada a
conversión**, donde las ofertas sean protagonistas y la transición hacia el sistema comercial de
GoHighLevel sea transparente para el visitante.
