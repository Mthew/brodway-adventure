---
version: 1
slug: "app-locale-admin"
primary_target: "app/[locale]/admin"
related_targets: []
---

# Panel de administración (`/admin`)

**Alcance.** El backoffice de la agencia. No es parte del sitio público: vive fuera de los dos
cromos existentes, con `noindex` y sin navbar ni pie públicos.

**Modo: Operate.** Quien entra viene a completar una tarea. La expresión nunca puede tapar la
tarea, el estado ni una afordancia conocida; la marca vive en la precisión de los detalles.

## A quién sirve

**Diez personas del equipo comercial, a diario, sobre todo desde el móvil.** No es un panel para
una persona que se lo aprende de memoria ni para alguien que entra cada tres semanas: es un turno
de trabajo compartido. Eso obliga a dos cosas que un admin de escritorio no necesita: saber quién
publicó qué, y que dos personas no se pisen editando la misma oferta.

## La tarea

**Convertir un flyer de mayorista en ficha publicada.** Es lo que más se repite. El resto
—curar la home, renovar vigencias, reordenar galerías— es real pero secundario.

## Dirección elegida: asistente de publicación

Publicar una oferta es una **secuencia, no un formulario**: transcribir → fotos → secciones →
publicar. Una pantalla por paso, tres o cuatro campos como mucho, y el botón de avanzar fijo abajo
al alcance del pulgar. En el primer paso el flyer se ve arriba mientras se transcribe debajo.

Descartadas, y por qué vale la pena recordarlo:

- **"Lo que le falta a cada oferta"** (la que lideraba el dado): el panel como lista de huecos en
  vez de lista de registros. Sigue siendo la mejor respuesta al problema de *repartir carga entre
  diez personas*, y es de donde debería salir la pantalla de entrada si el asistente resulta
  insuficiente.
- **Lista y hoja de edición**: la convención. Es la referencia contra la que medir.
- **Tablero de salidas** (challenger competitivo): gana en identificación —es el lenguaje visual
  del sector— y pierde en claridad, porque ordena por vencimiento y la tarea principal es publicar.

## Momento memorable

El paso 1 con el flyer arriba y los campos debajo: el panel se parece a lo que la persona está
haciendo de verdad, que es copiar de una imagen a unos campos.

## Riesgo asumido

Corregir algo pequeño meses después no puede obligar a recorrer los cuatro pasos. **El asistente
necesita una vía de edición directa desde el primer día**, o se convierte en un peaje y el equipo
lo esquiva.

## Restricciones heredadas

- Identidad fija: navy `#003062`, turquesa `#00aac3`, naranja `#ff6a03`, Montserrat/Lato, mínimo
  14px y 44px de área táctil.
- El sitio público lee con `persistSession: false` a propósito. **El panel necesita un cliente
  distinto**, con `@supabase/ssr` y cookies, acotado a `/admin`.
- El panel administra presentación (imágenes, colecciones, orden, destacados, contenido editorial).
  Las tarifas vienen del Google Sheet; hasta que exista ese sync (E5), el formulario tiene que
  aceptar también los campos comerciales.

## Decisiones sin resolver

- **Método de autenticación** para diez personas (correo y contraseña, enlace mágico, o Google).
- **Roles**: uno solo para empezar, o separar quien carga de quien valida la tarifa. El estado
  `borrador` ya existe en el modelo y presupone esa separación.
- **Transformaciones de imagen de Supabase Storage**: hay que verificarlo en la cuenta real, no en
  la documentación.
