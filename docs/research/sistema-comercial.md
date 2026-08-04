# Sistema comercial inteligente para captación, cotización y venta de viajes

## Dictamen ejecutivo y evolución de la propuesta

La propuesta recibida constituye un **punto de partida válido**, pero no cubre todavía el sistema comercial integral que necesita tu negocio. El documento se concentra en diseñar un agente conversacional para WhatsApp, calificar prospectos, responder preguntas frecuentes y transferir conversaciones a un asesor, utilizando originalmente Chatwoot como herramienta de supervisión. También plantea un pago único de **$5.000.000 COP**, herramientas adicionales por cuenta del cliente, pago total anticipado y 30 días de soporte. fileciteturn0file0

El alcance que ahora necesitas es significativamente más amplio. Ya no se trata simplemente de “instalar un chatbot”, sino de construir una infraestructura comercial que conecte:

- Publicidad y fuentes de captación.
- CRM y base de datos.
- WhatsApp multiagente.
- Agente inteligente.
- Cotizaciones.
- Seguimiento y remarketing.
- Comparación de ofertas de mayoristas.
- Página web.
- Medición de rentabilidad.
- Protección de datos y trazabilidad comercial.

La recomendación no es rechazar al proveedor, sino solicitar una **reformulación contractual y técnica**. El proyecto debería evolucionar de “asistente IA para WhatsApp” a:

> **Implementación de un sistema comercial inteligente para captación, precalificación, cotización, seguimiento, remarketing y análisis de ofertas turísticas, centralizado en GoHighLevel.**

### Decisión de arquitectura

La arquitectura con mejor equilibrio entre costo, propiedad, escalabilidad y velocidad de implementación es:

| Componente | Herramienta recomendada | Función |
|---|---|---|
| CRM y operación comercial | GoHighLevel Starter | Contactos, oportunidades, embudo, formularios, conversaciones, automatizaciones y reportes |
| WhatsApp | WhatsApp Business Platform integrada con HighLevel | Atención multiagente, mensajes, plantillas y automatizaciones |
| Automatizaciones sencillas | Workflows nativos de HighLevel | Captación, asignación, etiquetas, seguimiento, tareas y cambios de etapa |
| Agente inteligente propio | Servicio externo conectado a HighLevel | Conversación, precalificación, preguntas frecuentes y actualización del CRM |
| Orquestación avanzada | n8n | Integración del agente, procesamiento de ofertas y conexiones especiales |
| Base de ofertas | Base de datos estructurada externa | Mayoristas, destinos, tarifas, vigencias, inclusiones, margen y competitividad |
| Modelo de IA | Un proveedor inicial, por ejemplo OpenAI | Comprensión conversacional, extracción de información e imágenes |
| Página web | Sitio actual conectado con HighLevel | Captación, ofertas “desde”, formularios, atribución y confianza |
| Publicidad | Meta Ads y Google Ads | Captación, remarketing y optimización por calidad de lead |

GoHighLevel Starter cuesta actualmente **US$97 mensuales**, incluye hasta tres subcuentas, contactos y usuarios ilimitados, CRM, pipelines, conversaciones unificadas, workflows, formularios y acceso a API. La integración de WhatsApp aparece como un complemento de **US$10 mensuales por subcuenta**. HighLevel ofrece además AI Employee Growth por US$50 mensuales y AI Employee Unlimited por US$97 mensuales, pero estos complementos no son obligatorios para conectar un agente externo. citeturn14view0

### Lo que sí y lo que no puede centralizar GoHighLevel

GoHighLevel debe ser el **centro de operación y la fuente principal de verdad comercial**, pero no debe forzarse a hacer todo.

Sí puede centralizar:

- Leads de Meta, Google, página web y WhatsApp.
- Contactos, oportunidades, campos personalizados y embudos.
- Conversaciones y asignación a agentes.
- Automatizaciones y seguimientos.
- Segmentos dinámicos.
- Audiencias para Meta.
- Registro de cotizaciones y resultados.
- Eventos de conversión para campañas.
- Dashboards comerciales.

No es la herramienta más apropiada para:

- Construir una base relacional compleja de miles de ofertas.
- Comparar de manera sofisticada planes turísticos heterogéneos.
- Procesar automáticamente grupos de WhatsApp.
- Almacenar imágenes, términos, hoteles, múltiples fechas, proveedores y versiones de una misma tarifa como si fuera un sistema de inventario.
- Ejecutar un motor avanzado de inteligencia de precios.

Por eso, la conclusión es clara: **no existe una sola herramienta que resuelva correctamente todo el proyecto**. GoHighLevel puede cubrir el núcleo comercial; n8n, una base de ofertas y un proveedor de IA completan las funciones especializadas.

## Arquitectura recomendada y límites reales

### GoHighLevel como sistema central

HighLevel debe contener dos tipos de registros diferenciados:

**Contacto:** la persona. Aquí se guarda información relativamente estable:

- Nombre.
- Teléfono.
- Correo.
- Ciudad.
- Canal preferido.
- Fuente original.
- Estado de autorización de datos.
- Fecha, texto y versión de la autorización.
- Historial general.
- Última interacción.
- Estado de no contacto o revocación.

**Oportunidad:** cada intención concreta de viaje. Una misma persona podría cotizar Cartagena en enero y seis meses después solicitar un viaje a Cancún. Esas solicitudes no deberían sobrescribir la información anterior.

En la oportunidad se guardarían:

- Destino o tipo de viaje.
- Ciudad de origen.
- Fechas.
- Flexibilidad.
- Número de viajeros.
- Edades de menores.
- Presupuesto.
- Hotel o categoría deseada.
- Alimentación.
- Estado de cotización.
- Mayoristas consultadas.
- Oferta seleccionada.
- Valor cotizado.
- Margen estimado.
- Fecha de vencimiento de la tarifa.
- Puntaje del lead.
- Próxima acción.
- Motivo de pérdida.

HighLevel diferencia campos de contacto y campos de oportunidad; los segundos están diseñados para información específica de cada negocio, como presupuesto, urgencia y fecha prevista de cierre. Además, los campos pueden utilizarse en filtros, pipelines, automatizaciones y reportes. Una vez creado un campo para un tipo de objeto no puede convertirse directamente al otro, por lo que el modelo de datos debe definirse antes de configurar el CRM. citeturn16search1turn16search6

### Flujo de captación propuesto

```text
Meta Lead Ads ───────────────┐
Google Lead Forms ───────────┤
Página web ──────────────────┤
Click-to-WhatsApp Ads ───────┼──> GoHighLevel CRM
WhatsApp orgánico ───────────┤           │
Referidos/importaciones ─────┘           │
                                         ▼
                               Detección de duplicados
                                         │
                                         ▼
                                  Agente inteligente
                                         │
                    ┌────────────────────┴────────────────────┐
                    ▼                                         ▼
            Lead precalificado                       Requiere humano
                    │                                         │
                    ▼                                         ▼
           Oportunidad en pipeline                 Asignación a asesor
                    │                                         │
                    └────────────────────┬────────────────────┘
                                         ▼
                             Cotización y seguimiento
                                         │
                       ┌─────────────────┴────────────────┐
                       ▼                                  ▼
                    Reserva                      Remarketing/nurture
```

HighLevel puede sincronizar directamente formularios de clientes potenciales de Google y Meta con el CRM, mapear campos y activar workflows. También dispone de disparadores específicos para conversaciones provenientes de anuncios Click-to-WhatsApp, permitiendo responder, etiquetar, asignar una etapa del pipeline o llamar un webhook inmediatamente después de que el usuario envía el mensaje. citeturn14view7turn14view8turn15search0

### WhatsApp multiagente

La misma línea de WhatsApp puede ser atendida por varios agentes desde HighLevel porque la plataforma trabaja con conversaciones unificadas y usuarios ilimitados en Starter. La implementación debe incluir:

- Propietario de cada conversación.
- Reglas de asignación.
- Horarios.
- Grupos o equipos comerciales.
- Transferencia de IA a humano.
- Notificaciones.
- Reasignación si un agente no responde.
- Registro de tiempos de atención.
- Restricciones para evitar que dos asesores contesten simultáneamente.
- Roles y permisos.

La cuenta de WhatsApp Business, el número, el Business Portfolio de Meta y las plantillas deben quedar a nombre de tu negocio, no en una cuenta maestra del proveedor.

Si deseas seguir usando el mismo número desde la aplicación móvil de WhatsApp Business, HighLevel dispone de una modalidad de **coexistencia**, que permite mantener el número conectado tanto a la aplicación como a la API. Esta posibilidad debe validarse con el número y país concretos durante la fase de arquitectura. citeturn14view5

### Limitación crítica de los grupos de mayoristas

Aquí existe una restricción que el proveedor debe reconocer desde el inicio:

> **La API oficial de WhatsApp Business no permite utilizar los grupos de WhatsApp como una bandeja programática desde la cual un agente lea automáticamente todos los mensajes e imágenes.**

La colección oficial de Meta para WhatsApp Business Platform documenta destinatarios individuales para la mensajería de Cloud API; los grupos de la aplicación móvil no se convierten en un canal automatizable del CRM. La coexistencia puede permitir conservar los grupos en la aplicación, pero no significa que HighLevel, n8n o el agente inteligente reciban automáticamente sus publicaciones. citeturn14view5turn14view6

Por consiguiente, no debe aceptarse una promesa contractual que diga “el sistema investigará automáticamente todos los grupos de WhatsApp de las mayoristas” sin explicar cómo y bajo qué autorización. El uso de automatizaciones no oficiales, sesiones de WhatsApp Web o técnicas de extracción no autorizadas podría generar inestabilidad, bloqueos y riesgos sobre el número.

La solución viable para la primera versión es un **buzón de ofertas asistido**:

1. Recibes la oferta en el grupo de la mayorista.
2. Reenvías la imagen a un número individual dedicado, un formulario interno o una carpeta autorizada.
3. n8n recibe el archivo.
4. El modelo de IA extrae los datos.
5. El sistema guarda un borrador.
6. Una persona valida precio, fechas, impuestos, inclusiones y vigencia.
7. La oferta aprobada entra a la base.
8. Se calcula competitividad y margen.
9. Se genera una alerta de “posible campaña”.
10. Tú autorizas la publicación o activación publicitaria.

En una etapa posterior se debería solicitar a las mayoristas acceso a:

- API.
- Feed de tarifas.
- Portal exportable.
- Correos estructurados.
- Archivos Excel o CSV.
- Canales oficiales de distribución.
- Integraciones autorizadas.

### Agente inteligente propio

Sí es posible construir un agente externo y conectarlo con GoHighLevel. No estás obligado a contratar AI Growth o AI Unlimited.

HighLevel ofrece API para contactos, conversaciones, oportunidades, calendarios, workflows y webhooks. Los planes Starter y Unlimited tienen acceso básico a API, y las integraciones privadas son adecuadas para herramientas internas o implementaciones de una sola cuenta. HighLevel también ofrece mecanismos MCP para conectar clientes de IA y plataformas como n8n con los recursos del CRM. citeturn14view1turn14view2turn14view3

El flujo técnico sería:

```text
Mensaje entrante
      │
      ▼
GoHighLevel / WhatsApp
      │
      ▼
Webhook o evento
      │
      ▼
Servicio del agente / n8n
      │
      ├── Consulta base de conocimientos
      ├── Consulta datos del contacto
      ├── Identifica oportunidad activa
      ├── Decide siguiente pregunta
      ├── Actualiza campos y scoring
      └── Determina respuesta o transferencia
      │
      ▼
GoHighLevel
      │
      ▼
Respuesta por WhatsApp o asignación humana
```

El agente podría ser de tu propiedad en cuanto a:

- Código.
- Prompts.
- Flujos.
- Base de conocimiento.
- Esquema de datos.
- Reglas de negocio.
- Documentación.
- Integraciones.
- Repositorio.
- Credenciales y cuentas de infraestructura.

No serías propietario del modelo de OpenAI, Anthropic u otro proveedor. Estarías utilizando su API. La propiedad real del sistema dependerá de que el contrato exija que todas las cuentas, claves, repositorios y despliegues estén bajo tu control.

### Qué papel debe cumplir n8n

n8n debe utilizarse solamente donde agregue valor:

- Conectar el agente externo con HighLevel.
- Procesar imágenes de ofertas.
- Normalizar tarifas.
- Actualizar la base de ofertas.
- Generar alertas.
- Conectar servicios que no tengan integración nativa.
- Sincronizar datos especiales.
- Ejecutar cálculos y validaciones.

No conviene usar n8n para cada etiqueta, mensaje de seguimiento o movimiento sencillo del pipeline. Esas acciones deben permanecer en los workflows nativos de HighLevel.

n8n Cloud Starter se comercializa como una solución hospedada con 2.500 ejecuciones mensuales, mientras que Pro amplía la capacidad. n8n aclara que un chatbot puede consumir ejecuciones en función del número de mensajes o eventos procesados, por lo que enviar cada mensaje individual a un workflow independiente podría agotar rápidamente el plan inicial. citeturn17search1turn17search3

Para evitarlo, la implementación debería:

- Mantener una memoria de sesión.
- Procesar una conversación como sesión y no como múltiples automatizaciones innecesarias.
- Reservar n8n para orquestación.
- Usar webhooks eficientemente.
- Medir ejecuciones desde el entorno de pruebas.
- Definir un límite mensual y alertas de consumo.

## Captación, precalificación y control comercial

### El problema de los “leads preguntones”

No es correcto dividir desde el principio a las personas en “compradores” y “preguntones”. Un lead que no está listo hoy puede reservar después, recomendar a otra persona o responder a una mejor oferta.

El sistema debe diferenciar entre:

- **Exploratorio:** busca ideas y no tiene fechas, presupuesto ni decisión.
- **Interesado:** conoce el destino o periodo, pero aún está comparando.
- **Potencial:** tiene fechas aproximadas, viajeros y presupuesto viable.
- **Calificado:** encaja con el producto y puede avanzar a cotización.
- **Prioritario:** tiene intención, presupuesto, disponibilidad y disposición para reservar.
- **No viable actualmente:** presupuesto fuera de rango, viaje demasiado incierto o información falsa.
- **Nurture:** no está listo, pero puede trabajarse mediante contenido y ofertas futuras.

La calificación no debe basarse solamente en cuánto pregunta. Preguntar mucho puede representar interés, desconfianza, falta de claridad, necesidad de viajar con familia o preocupación por la seguridad de la compra.

### Preguntas mínimas del agente

Para evitar saturación, el agente debe utilizar una conversación progresiva. No debe mostrar un interrogatorio de diez o quince preguntas en el primer mensaje.

La primera etapa puede limitarse a cinco datos:

1. Destino o tipo de viaje.
2. Ciudad de salida.
3. Fecha, mes o nivel de flexibilidad.
4. Número de adultos y menores.
5. Presupuesto aproximado total o por persona.

Después de identificar una posibilidad real, se puede consultar:

- ¿Cuándo esperas tomar una decisión?
- ¿Buscas pago total o alternativa de separación?
- ¿Qué es más importante: precio, hotel, ubicación, alimentación o flexibilidad?
- ¿Tienes pasaporte o documentación necesaria, cuando aplique?

No recomiendo preguntar ingresos, patrimonio, estrato o capacidad crediticia. La variable comercial relevante no es cuánto dinero posee una persona, sino:

- Si su presupuesto es compatible con el viaje.
- Si comprende el rango de precios.
- Si tiene una ventana de viaje definida.
- Si está dispuesto a separar.
- Si responde.
- Si acepta alternativas.
- Si reúne los requisitos del destino.

Además, Meta ha venido restringiendo el uso de audiencias o conversiones que infieran condiciones financieras sensibles. Por prudencia, no deberían transmitirse a Meta segmentos con nombres como “sin dinero”, “rico”, “alto ingreso” o “mala capacidad de pago”. Los segmentos deben describir comportamientos comerciales neutrales, como “cotización enviada”, “viaje en 90 días” o “presupuesto compatible”. citeturn3search0turn6search2

### Modelo inicial de lead scoring

Propongo un puntaje de cien puntos:

| Dimensión | Puntos máximos | Señal |
|---|---:|---|
| Compatibilidad del presupuesto | 25 | El presupuesto encaja con rangos reales |
| Intención de reserva | 20 | Desea decidir o separar en un plazo concreto |
| Cercanía del viaje | 15 | La fecha permite cotizar y cerrar |
| Claridad de necesidad | 15 | Destino, fechas y viajeros definidos |
| Interacción | 10 | Responde y entrega información útil |
| Flexibilidad | 5 | Acepta cambios de fechas, hotel o destino |
| Calidad del dato | 5 | Teléfono y correo válidos |
| Autorización y contactabilidad | 5 | Puede recibir seguimiento permitido |

Clasificación sugerida:

| Puntaje | Categoría | Acción |
|---:|---|---|
| 0–29 | Exploratorio | Contenido, orientación y seguimiento suave |
| 30–59 | Potencial | Nutrición y solicitud de datos faltantes |
| 60–79 | Calificado | Cotización y seguimiento de asesor |
| 80–100 | Prioritario | Atención rápida, cotización y cierre |

Este puntaje no debe considerarse definitivo. Se debe recalibrar después de obtener suficientes datos de:

- Leads generados.
- Leads contactados.
- Leads calificados.
- Cotizaciones.
- Reservas.
- Ventas.
- Margen.
- Motivos de pérdida.

Durante las primeras seis a ocho semanas debe medirse qué características realmente anticipan una venta. El sistema podría descubrir, por ejemplo, que la flexibilidad de fechas predice mejor la conversión que el presupuesto declarado.

### Pipeline comercial recomendado

```text
Nuevo
  ↓
IA atendiendo
  ↓
Datos mínimos completos
  ↓
Por validar / precalificado
  ↓
Por cotizar
  ↓
Cotización enviada
  ↓
Seguimiento activo
  ↓
Negociación o ajuste
  ↓
Reserva / documentos
  ↓
Pago y contrato con mayorista
  ↓
Ganada
```

Rutas adicionales:

```text
No responde → Reactivación → Nurture
No viable → Alternativa económica → Nurture
Tarifa vencida → Recotización
Oferta mejorada → Remarketing dirigido
Perdida → Motivo de pérdida + próxima fecha
```

HighLevel permite utilizar Smart Lists que se actualizan dinámicamente cuando los contactos cumplen o dejan de cumplir condiciones, y combinar campos, etiquetas, actividad, estados del pipeline y preferencias de comunicación. Esto permite construir segmentos automáticos sin exportar manualmente la base. citeturn16search0turn16search14

### Campos y etiquetas

No se debe usar una etiqueta para cada dato. Las etiquetas sirven para acontecimientos o agrupaciones; los campos sirven para información estructurada.

**Campos sugeridos:**

| Tipo | Ejemplos |
|---|---|
| Contacto | Fuente original, ciudad, consentimiento, fecha de autorización, versión de política |
| Oportunidad | Destino, salida, fechas, viajeros, presupuesto, score, valor cotizado |
| Cotización | Mayorista seleccionada, código de oferta, vigencia, margen, estado |
| Seguimiento | Próxima acción, fecha, asesor, motivo de pérdida |

**Etiquetas sugeridas:**

- `fuente_meta`
- `fuente_google`
- `fuente_web`
- `fuente_whatsapp`
- `requiere_cotizacion`
- `cotizacion_enviada`
- `oferta_mejorada`
- `requiere_humano`
- `no_responde`
- `cliente_recurrente`
- `revoco_comunicaciones`

La trazabilidad debe permitir responder:

- Qué campaña generó el lead.
- Qué anuncio vio.
- Qué destino solicitó.
- Qué mayoristas se consultaron.
- Qué tarifa se envió.
- Cuánto duró vigente.
- Qué seguimiento recibió.
- Qué asesor intervino.
- Por qué compró o no compró.
- Cuál fue el margen final.

## Página web, cotización y motor de ofertas

### Función de la página web

La página web no debe ser un elemento separado del CRM. Debe funcionar como:

- Activo de confianza.
- Catálogo de destinos y ofertas.
- Fuente de captación.
- Herramienta de precalificación.
- Punto de autorización de datos.
- Fuente de audiencias para remarketing.
- Registro de comportamiento.
- Puente hacia WhatsApp.
- Evidencia de respaldo, formalidad y condiciones.

La estructura recomendada es:

- Página principal.
- Destinos.
- Ofertas destacadas.
- Página individual de cada oferta.
- Formulario de cotización personalizada.
- Preguntas frecuentes.
- Quiénes somos y respaldo.
- Política de tratamiento de datos.
- Términos de servicio.
- Información de contacto.
- Página de confirmación.
- Botón de WhatsApp con contexto de la oferta.

HighLevel puede capturar formularios alojados en páginas externas mediante su script de seguimiento, incluyendo campos, URL, UTM y contexto de sesión. También permite insertar widgets de WhatsApp o chat y llevar las conversaciones al módulo unificado. Los formularios embebidos mediante ciertos iframes pueden requerir un método diferente, por lo que la integración debe probarse con la tecnología concreta de tu sitio. citeturn14view9turn12search8turn12search11

### Cómo manejar las tarifas “desde”

Puedes publicar valores “desde”, pero no deberían ser simples números escritos manualmente sin trazabilidad.

Cada oferta publicada debe guardar:

- Identificador único.
- Destino.
- Ciudad de salida.
- Mayorista fuente.
- Fecha de salida o periodo.
- Número de noches.
- Hotel y categoría.
- Tipo de habitación.
- Ocupación utilizada para calcular el precio.
- Régimen de alimentación.
- Vuelos y equipaje.
- Traslados.
- Asistencia.
- Impuestos incluidos.
- Costos no incluidos.
- Precio por persona o total.
- Moneda y tasa de cambio utilizada.
- Vigencia.
- Fecha de última validación.
- Disponibilidad.
- Evidencia fuente.
- Persona que aprobó la publicación.

Para operar formalmente como prestador de servicios turísticos en Colombia debe validarse la obligación de inscripción y renovación del Registro Nacional de Turismo. MinCIT señala que el RNT es requisito previo y obligatorio para los prestadores, se renueva entre enero y marzo y su número debe incluirse en toda publicidad del prestador. También exige ajustar la publicidad a las condiciones reales, especialmente en precios, calidad y cobertura. citeturn16search3

Por eso, una presentación recomendable sería:

> **Cancún desde $X por persona**  
> Saliendo desde Bogotá, alojamiento de cuatro noches, ocupación doble, fechas seleccionadas. Incluye [componentes]. Tarifa verificada el [fecha], sujeta a disponibilidad y reconfirmación. Consulta condiciones, impuestos y servicios incluidos. RNT [número].

“Desde” no debe utilizarse para ocultar costos obligatorios, publicar un valor que ya no está disponible o atraer al usuario hacia una tarifa sustancialmente diferente. El sistema debe retirar, marcar como vencida o pedir reconfirmación automática cuando una oferta pierda vigencia.

### Base de datos de ofertas

No recomiendo guardar toda la inteligencia de mayoristas en campos de HighLevel. La base externa debería tener, como mínimo, estas entidades:

| Entidad | Información |
|---|---|
| Mayorista | Nombre, contacto, destinos fuertes, confiabilidad, condiciones |
| Oferta | Identificador, destino, origen, precio, moneda, fechas y vigencia |
| Alojamiento | Hotel, categoría, ubicación, habitación y alimentación |
| Transporte | Aerolínea, horarios, escalas y equipaje |
| Inclusiones | Traslados, tours, asistencia, seguros |
| Condiciones | Cancelación, cambios, pagos, documentación |
| Evidencia | Imagen, archivo, grupo o canal de origen |
| Validación | Estado, fecha, persona, confianza de extracción |
| Rentabilidad | Neto, precio público, comisión, costos y margen |
| Desempeño | Leads, cotizaciones, ventas y margen generado |

### Procesamiento de las imágenes

El flujo de inteligencia de ofertas debe incorporar una validación humana:

```text
Imagen reenviada
      ↓
Extracción con IA
      ↓
Campos estructurados
      ↓
Nivel de confianza
      ↓
Validación humana
      ↓
Oferta aprobada
      ↓
Comparación con ofertas equivalentes
      ↓
Alerta comercial
      ↓
Publicación o campaña autorizada
```

La IA puede equivocarse en:

- Separadores de miles.
- Monedas.
- Fechas.
- Valor por persona frente a valor por pareja.
- Edad de menores.
- Impuestos.
- “No incluye”.
- Hotel.
- Número de noches.
- Vigencia.
- Texto pequeño.
- Condiciones de pago.

Por esa razón, ninguna tarifa debería llegar directamente desde una imagen a la página web o a una campaña sin aprobación.

### Comparación de mayoristas

Para cotizar varias mayoristas al mismo tiempo, primero se debe asegurar que se comparan planes equivalentes.

La matriz debería normalizar:

| Variable | Pregunta de comparación |
|---|---|
| Origen | ¿Salen desde la misma ciudad? |
| Fechas | ¿Son exactamente las mismas o comparables? |
| Duración | ¿Incluyen el mismo número de días y noches? |
| Ocupación | ¿Es sencilla, doble, triple o familiar? |
| Menores | ¿Se calcularon con las mismas edades? |
| Hotel | ¿Es la misma propiedad o nivel equivalente? |
| Habitación | ¿Es la misma categoría? |
| Alimentación | ¿Desayuno, media pensión o todo incluido? |
| Vuelo | ¿Mismo equipaje, escalas y horarios? |
| Traslados | ¿Están incluidos? |
| Asistencia | ¿Tiene cobertura comparable? |
| Impuestos | ¿Están incluidos todos los obligatorios? |
| Cambios | ¿Qué penalidades aplican? |
| Pago | ¿Cuánto se debe separar y cuándo? |
| Disponibilidad | ¿Es inmediata, bajo solicitud o cupo confirmado? |
| Margen | ¿Cuánto queda realmente para tu negocio? |
| Servicio | ¿Cómo responde la mayorista ante cambios y emergencias? |

La tarifa más barata no siempre es la mejor. La selección debe considerar:

```text
Valor comercial =
competitividad de precio
+ margen
+ confiabilidad
+ inclusiones
+ condiciones
+ facilidad de cierre
+ soporte posventa
```

Puede crearse un puntaje interno:

| Factor | Peso inicial |
|---|---:|
| Competitividad frente a planes comparables | 40% |
| Margen para el negocio | 20% |
| Vigencia y disponibilidad | 15% |
| Calidad e inclusiones | 10% |
| Confiabilidad de la mayorista | 10% |
| Material y facilidad de campaña | 5% |

El resultado no debería activar automáticamente publicidad al principio. El sistema debe generar una notificación:

> “Oferta candidata a campaña: Cancún, salida Bogotá, 18% por debajo de la mediana de ofertas comparables, margen estimado X, vigente hasta Y. Requiere validación de cupos y aprobación.”

### Relación entre oferta, lead y página

Cada oferta publicada debe tener un `offer_id`.

Cuando alguien llegue desde la página:

1. Se registra la URL y el `offer_id`.
2. Se crea o actualiza el contacto.
3. Se crea una oportunidad.
4. El agente recibe el contexto.
5. No vuelve a preguntar qué oferta vio.
6. Confirma origen, fechas, viajeros y disponibilidad.
7. Verifica si la oferta sigue vigente.
8. Si venció, ofrece recotización o alternativa.
9. Se registra la oferta realmente cotizada.
10. Se mide si terminó en reserva.

Así se podrá determinar:

- Qué ofertas atraen más leads.
- Qué ofertas generan más cotizaciones.
- Qué ofertas venden.
- Qué mayoristas convierten mejor.
- Qué destinos dejan mayor margen.
- Qué tarifas atraen curiosos pero no compradores.

## Remarketing, datos personales y cumplimiento

### Corrección necesaria sobre la autorización

Tu intención de no saturar al lead es correcta. Sin embargo, esta condición:

> “En ningún caso darle el poder o preguntarle si desea ser contactado comercialmente a futuro”

no puede implementarse literalmente.

La persona tiene derechos sobre sus datos y debe poder conocer las finalidades, autorizar cuando corresponda y posteriormente revocar o solicitar la supresión. La SIC ha reiterado que, salvo excepciones legales, la recolección y uso de datos requiere autorización previa, expresa e informada, debe limitarse a información pertinente y necesita medidas de seguridad. En 2025 confirmó una sanción de $670 millones a una compañía por contactos reiterados mediante SMS, WhatsApp y llamadas sin autorización previa, expresa e informada. citeturn15search8turn15search10turn15search6

La solución es **reducir fricción, no eliminar la decisión del usuario**.

En el formulario puede utilizarse una casilla no premarcada con un texto similar a:

> Autorizo a [nombre o razón social] a tratar mis datos para gestionar mi solicitud, elaborar cotizaciones de servicios turísticos, hacer seguimiento y enviarme información comercial relacionada mediante WhatsApp, llamada, correo y publicidad personalizada, conforme a la Política de Tratamiento de Datos. Podré ejercer mis derechos y revocar la autorización por los canales informados.

La versión definitiva debe ser revisada por un profesional colombiano competente. El CRM debe registrar:

- Texto aceptado.
- Versión.
- Fecha y hora.
- Página o formulario.
- Dirección o identificador técnico disponible.
- Canal autorizado.
- Fuente del lead.
- Estado de revocación.
- Evidencia de la acción afirmativa.

En WhatsApp puede utilizarse un mensaje inicial breve con un botón como **“Continuar y autorizar”**, siempre que se almacene evidencia clara. No basta con asumir que escribir al negocio equivale automáticamente a autorizar campañas futuras por todos los canales.

### Registro de Números Excluidos

Desde abril de 2024, el Registro de Números Excluidos permite a los colombianos excluir mensajes comerciales o publicitarios por aplicaciones de mensajería, web, correo electrónico y llamadas. Los productores y proveedores deben contemplar esa restricción en sus campañas. citeturn15search1turn15search2turn15search7

El sistema debería contar con una lista de supresión que combine:

- Revocaciones directas.
- Solicitudes “no me contacten”.
- Estado Do Not Disturb.
- Números excluidos cuando aplique la consulta.
- Rebotes.
- Contactos inválidos.
- Restricciones por canal.
- Plantillas rechazadas.
- Frecuencia máxima.

### Remarketing por WhatsApp

WhatsApp distingue entre la ventana de servicio iniciada por el usuario y los mensajes iniciados por la empresa. Cuando la ventana está cerrada, el negocio debe usar plantillas aprobadas según la categoría correspondiente. En Click-to-WhatsApp puede abrirse una ventana gratuita de 72 horas si la empresa responde dentro de las primeras 24 horas. citeturn15search0turn15search11turn15search14

Los segmentos más útiles serían:

| Segmento | Condiciones | Mensaje |
|---|---|---|
| Tarifa mejorada | Cotizado, no vendido, mismo destino, nueva tarifa inferior | “Encontramos una nueva alternativa para tu viaje…” |
| Cotización próxima a vencer | Cotización activa y vigencia cercana | Recordatorio de vigencia |
| No respondió | Datos completos, sin respuesta durante plazo definido | Pregunta breve de continuidad |
| Exploratorio | Viaje futuro y baja intención | Contenido e inspiración |
| Fecha flexible | Aceptó alternativas | Ofertas en semanas de menor precio |
| Cliente anterior | Viaje terminado | Nueva propuesta o recomendación |
| Perdido por precio | Presupuesto registrado y nueva oferta compatible | Alternativa ajustada |
| Abandono web | Visitó oferta y no completó el proceso | Anuncio de remarketing, no WhatsApp sin autorización |

No recomiendo enviar campañas masivas frecuentes a toda la base. Debe establecerse:

- Máximo de contactos comerciales por periodo.
- Priorización por afinidad.
- Exclusión de reservas activas cuando el mensaje no corresponda.
- Hora permitida.
- Opción clara de dejar de recibir mensajes.
- Registro de resultados.
- Control de costo por plantilla y por reserva recuperada.

### Remarketing en Meta

HighLevel permite construir audiencias de clientes a partir de listas o Smart Lists y mantener segmentos dinámicos. Meta exige que el anunciante tenga los derechos, permisos y base correspondiente para usar y cargar esos datos, aunque la información se transmita de manera protegida o cifrada. citeturn14view11turn3search0

Ejemplos:

```text
Audiencia: Cancún cotizado no comprado
Destino = Cancún
Estado = Cotización enviada
Venta = No
Fecha de viaje > hoy
Autorización publicitaria = Sí
No contacto = No
```

```text
Audiencia: Oferta mejorada Cartagena
Destino = Cartagena
Motivo de pérdida = Precio
Nueva oferta compatible = Sí
Autorización publicitaria = Sí
```

```text
Audiencia: Cliente anterior
Estado = Ganada
Fecha de regreso > 60 días
No contacto = No
```

Debe evitarse revelar en la publicidad que se comparan mayoristas. La propuesta pública puede centrarse en:

- Acompañamiento personalizado.
- Respaldo.
- Curaduría de alternativas.
- Tarifas competitivas.
- Claridad de condiciones.
- Gestión antes, durante y después del viaje.

No es necesario exponer tu proceso interno de abastecimiento. Sin embargo, antes de cerrar la venta el cliente debe recibir información clara sobre quién presta o contrata el servicio, el precio total, las inclusiones, restricciones y condiciones.

### Optimización de campañas por calidad

La pauta no debería optimizarse únicamente por formularios enviados. Debe devolver señales de calidad a Meta y Google.

Eventos recomendados:

```text
Lead
QualifiedLead
QuoteRequested
QuoteSent
BookingStarted
DepositPaid
Sale
```

HighLevel permite activar eventos de la API de conversiones de Meta mediante workflows y asociarlos a acciones como formularios o cambios de etapa. También dispone de mecanismos para conversiones offline de Google Ads, mientras que el seguimiento web debe complementarse con Google Tag Manager, Google Analytics y las etiquetas correspondientes. citeturn14view10turn6search10

Esto permite que las plataformas aprendan no solamente quién llena formularios, sino qué perfiles llegan a:

- Entregar datos completos.
- Ser calificados.
- Solicitar cotización.
- Reservar.
- Pagar.

El indicador principal no debe ser únicamente el costo por lead. Debe construirse la secuencia:

```text
Costo por lead
→ costo por lead contactado
→ costo por lead calificado
→ costo por cotización
→ costo por reserva
→ costo de adquisición
→ ingreso
→ margen
→ retorno sobre pauta
```

## Implementación por fases, pruebas y pagos

### Alcance contractual reformulado

El proveedor debería presentar un anexo con los siguientes entregables:

| Frente | Entregable |
|---|---|
| Arquitectura | Diagrama técnico, mapa de herramientas, propiedad y flujos |
| CRM | Pipeline, campos, etiquetas, Smart Lists y dashboards |
| Captación | Meta, Google, web y WhatsApp |
| WhatsApp | Número, API, multiagente, plantillas y asignación |
| IA | Agente, base de conocimiento, scoring y transferencia |
| Cotización | Flujo de solicitudes, versiones y seguimiento |
| Ofertas | Base estructurada, ingreso de imágenes y validación |
| Remarketing | Segmentos de WhatsApp y Meta |
| Medición | UTM, CAPI, conversiones y rentabilidad |
| Cumplimiento | Autorizaciones, evidencias, supresión y roles |
| Seguridad | Usuarios, permisos, claves, respaldos y registros |
| Documentación | Manual técnico y operativo |
| Formación | Capacitación a administradores y asesores |
| Soporte | Treinta días posteriores a la aceptación final |
| Pauta | Un mes definido por campañas, entregables y KPIs |

El mes de estrategia y pauta digital debe quedar escrito. Como no aparece en el PDF original, el anexo debería precisar:

- Plataformas incluidas.
- Número de campañas.
- Número de conjuntos y anuncios.
- Creación de copys.
- Diseño o adaptación de piezas.
- Presupuesto de pauta y quién lo paga.
- Frecuencia de optimización.
- Reportes.
- KPIs.
- Eventos de conversión.
- Fecha de inicio.
- Propiedad de las cuentas.
- Qué significa exactamente “un mes”.

El mes de pauta no debería comenzar antes de que funcionen:

- Captación.
- Respuesta inicial.
- Pipeline.
- Atribución.
- Scoring.
- Transferencia humana.
- Medición de conversiones.

De lo contrario, se pagaría por tráfico hacia un sistema todavía incompleto.

### Plan de ejecución

| Fase | Duración estimada | Resultado |
|---|---:|---|
| Descubrimiento y arquitectura | 1–2 semanas | Procesos, datos, herramientas, riesgos y criterios de aceptación |
| Fundación de GoHighLevel | 1–2 semanas | Cuenta, usuarios, campos, pipeline, etiquetas y permisos |
| Captación y atribución | 1–2 semanas | Meta, Google, web, UTM y pruebas de duplicados |
| WhatsApp multiagente | 1–2 semanas | Número, plantillas, bandeja, asignación y workflows |
| Agente inteligente | 2–4 semanas | Base de conocimiento, precalificación, scoring y transferencia |
| Página web y ofertas | 2–3 semanas | Formularios, offer ID, tracking y páginas conectadas |
| Inteligencia de mayoristas | 3–5 semanas | Ingreso de imágenes, extracción, validación y comparación |
| Remarketing y conversiones | 1–2 semanas | Smart Lists, audiencias, CAPI y conversiones offline |
| Pruebas y formación | 1–2 semanas | UAT, correcciones, manuales y capacitación |
| Salida a producción | 1 semana | Activación controlada y monitoreo |
| Soporte | 30 días | Corrección de fallos y estabilización |

Algunas fases pueden ejecutarse en paralelo. Un MVP comercial puede estar listo antes que el motor completo de mayoristas, pero no debería declararse terminado solamente porque el bot ya contesta mensajes.

### Pago por hitos

La estructura 30%–40%–30% es razonable si cada pago depende de entregables verificables.

#### Anticipo de arquitectura

**Pago: 30%**

Se entrega y aprueba:

- Documento de arquitectura.
- Mapa del Customer Journey.
- Diagrama de integraciones.
- Modelo de datos.
- Pipeline.
- Campos y etiquetas.
- Flujos conversacionales.
- Matriz de herramientas y costos.
- Matriz de riesgos.
- Plan de seguridad.
- Criterios de aceptación.
- Cronograma.
- Inventario de cuentas.
- Alcance de propiedad intelectual.
- Backlog por fases.

No debería pagarse este hito solamente por una reunión o una presentación comercial.

#### Entorno funcional de pruebas

**Pago: 40%**

Debe funcionar en sandbox o entorno de pruebas:

- Captura desde Meta.
- Captura desde Google.
- Formulario web.
- WhatsApp entrante.
- Creación o actualización de contacto.
- Creación de oportunidad.
- Registro de fuente.
- Agente inteligente.
- Precalificación.
- Puntaje.
- Transferencia humana.
- Asignación a asesor.
- Seguimiento.
- Ingreso de una oferta de mayorista.
- Extracción estructurada.
- Validación.
- Generación de una alerta.
- Registro de autorización.

#### Aceptación y producción

**Pago: 30%**

Solo después de:

- Pruebas de aceptación aprobadas.
- Despliegue en producción.
- Corrección de defectos críticos.
- Manuales.
- Capacitación.
- Entrega de repositorios.
- Entrega de credenciales.
- Exportación de workflows.
- Copia de prompts.
- Esquema de base de datos.
- Copias de seguridad.
- Dashboard funcional.
- Inicio formal del soporte.
- Acta de aceptación.

### Pruebas de aceptación

El contrato debe contener casos verificables:

| Caso | Resultado esperado |
|---|---|
| Lead de Meta | Aparece en CRM con campaña, anuncio y formulario |
| Lead de Google | Aparece en CRM y activa el flujo correcto |
| Lead web | Registra página, UTM y oferta consultada |
| Click-to-WhatsApp | Respuesta inmediata y contexto del anuncio |
| Contacto duplicado | Actualiza o vincula sin crear registros innecesarios |
| IA | Recopila máximo cinco datos iniciales |
| Scoring | Calcula el puntaje con reglas documentadas |
| Pipeline | Crea y mueve la oportunidad correctamente |
| Transferencia | Detiene IA, asigna asesor y entrega resumen |
| Cotización | Registra valor, mayorista, versión y vigencia |
| Oferta mejorada | Identifica segmento elegible |
| Revocación | Detiene automatizaciones comerciales |
| Imagen | Extrae datos y exige validación |
| Tarifa vencida | Impide publicación o advierte reconfirmación |
| Conversión | Envía evento a Meta o Google |
| Fallo técnico | Registra error y genera alerta |

Para desempeño se pueden definir indicadores como:

- Porcentaje de leads ingresados correctamente.
- Tiempo de primera respuesta.
- Porcentaje de conversaciones con contexto.
- Precisión de campos obligatorios.
- Tasa de transferencia correcta.
- Porcentaje de ofertas con validación.
- Tasa de errores críticos.
- Disponibilidad del sistema.

No debe prometerse atención “24/7” sin incluir monitoreo, alertas, gestión de fallos y responsable de incidentes. Un bot encendido no equivale por sí solo a una operación confiable.

### Propiedad y salida del proveedor

El contrato debe establecer que tú eres propietario o titular operativo de:

- GoHighLevel.
- Business Portfolio de Meta.
- WhatsApp Business Account.
- Número.
- Página de Facebook.
- Instagram.
- Cuentas publicitarias.
- Pixel y datasets.
- Google Ads.
- Google Analytics.
- Google Tag Manager.
- Dominio.
- n8n.
- Base de datos.
- Cuenta del proveedor de IA.
- Claves API.
- Repositorio de código.
- Prompts.
- Documentación.
- Copias de seguridad.

No aceptes una arquitectura en la que todo quede:

- En el servidor personal del desarrollador.
- En su cuenta de OpenAI.
- En su agencia de HighLevel.
- En su Business Manager.
- En una base de datos sin acceso.
- Sin repositorio.
- Sin exportaciones.
- Sin documentación.

El proveedor puede tener acceso como administrador durante la implementación, pero las cuentas principales deben ser tuyas.

## Costos, riesgos y decisión recomendada

### Presupuesto mensual inicial

La base tecnológica mínima sería:

| Concepto | Referencia mensual | Necesidad inicial |
|---|---:|---|
| GoHighLevel Starter | US$97 | Sí |
| WhatsApp para HighLevel | US$10 | Sí |
| n8n Cloud Starter | Desde aproximadamente €20 bajo facturación anual | Sí, si habrá agente externo y motor de ofertas |
| Proveedor de IA | Variable por uso | Sí, uno |
| Base de datos | Plan básico o gestionado | Sí |
| Almacenamiento de imágenes | Bajo y variable | Sí |
| Mensajes de WhatsApp | Variable según tipo y país | Sí |
| Pauta publicitaria | Presupuesto independiente | Sí |
| AI Growth de HighLevel | US$50 | No inicialmente |
| AI Unlimited de HighLevel | US$97 | No inicialmente |
| Anthropic adicional | Variable | No inicialmente |
| VPS | Variable | No inicialmente |

Los valores de HighLevel están publicados actualmente en su página oficial; n8n anuncia Starter desde €20 mensuales bajo facturación anual y 2.500 ejecuciones. Las tarifas pueden cambiar y deben validarse al contratar. citeturn14view0turn17search3

### ¿OpenAI es necesario?

Para un agente propio necesitas **algún modelo de lenguaje**, pero no tiene que ser obligatoriamente OpenAI.

OpenAI puede utilizarse para:

- Entender mensajes.
- Responder preguntas.
- Extraer campos.
- Clasificar intención.
- Resumir conversaciones.
- Procesar imágenes.
- Consultar una base de conocimiento.

La API permite trabajar con archivos y almacenes vectoriales con metadatos, lo que facilita construir una base de conocimiento consultable. citeturn17search5

Mi recomendación inicial es utilizar **un solo proveedor principal** y diseñar una capa que permita cambiarlo después.

### ¿Anthropic es necesario?

No. Contratar OpenAI y Anthropic desde el primer día aumentaría:

- Costos.
- Pruebas.
- Complejidad.
- Manejo de claves.
- Posibles diferencias de respuesta.
- Mantenimiento.

Anthropic puede evaluarse posteriormente como:

- Alternativa.
- Respaldo.
- Modelo para tareas específicas.
- Comparación de calidad.

No recomiendo pagar simultáneamente:

- AI Unlimited de HighLevel.
- OpenAI.
- Anthropic.

Primero se debería implementar y medir una solución.

### ¿VPS es necesario?

No para el MVP.

Puedes comenzar con:

- GoHighLevel hospedado.
- n8n Cloud.
- Base gestionada.
- API del modelo.
- Almacenamiento gestionado.

El VPS se justificaría cuando:

- El volumen de n8n haga costoso el plan cloud.
- Necesites mayor control.
- Tengas una persona responsable de infraestructura.
- Requieras despliegues propios.
- Puedas administrar actualizaciones, seguridad, respaldos y monitoreo.

n8n mantiene una Community Edition utilizable para operaciones internas y permite autoalojamiento, pero el costo del software no elimina el trabajo de administrar el servidor. citeturn17search8turn17search12

Para un negocio dependiente de sus propios ingresos, comenzar con VPS podría representar un falso ahorro. Una caída, una base sin respaldo o una actualización fallida puede costar más que la mensualidad de una solución gestionada.

### Principales riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Intentar automatizar grupos de WhatsApp | Bloqueos o incumplimiento técnico | Ingreso asistido y fuentes autorizadas |
| Agente que inventa tarifas | Pérdida de confianza y riesgo comercial | Nunca cotizar sin datos validados |
| Falta de consentimiento | Sanciones y restricciones | Evidencia, finalidad, revocación y supresión |
| Datos desordenados | Remarketing incorrecto | Modelo Contacto–Oportunidad definido antes de construir |
| Pagar 100% anticipado | Pérdida de control | Hitos y aceptación |
| Cuentas del proveedor | Dependencia | Cuentas del cliente y acceso administrativo |
| Automatizar todo en n8n | Costos y fragilidad | Workflows nativos para procesos simples |
| Comprar varias IA | Sobreprecio | Un proveedor inicial |
| Publicar tarifas vencidas | Reclamos y baja conversión | Vigencia, validación y retiro automático |
| Elegir solo por precio | Bajo margen o mala experiencia | Score de valor y confiabilidad |
| Lanzar pauta antes del CRM | Desperdicio de presupuesto | Activar cuando tracking y atención estén probados |
| Bot sin transferencia humana | Conversaciones frustradas | Reglas claras de escalamiento |

### Decisión final

La decisión técnicamente más sólida es evolucionar la cotización hacia un proyecto híbrido:

> **GoHighLevel Starter + integración oficial de WhatsApp + workflows nativos + agente inteligente externo propio + n8n para integraciones avanzadas + base estructurada de ofertas.**

No recomiendo contratar inicialmente AI Growth o AI Unlimited de HighLevel. Primero debe comprobarse en el entorno de pruebas que el agente externo puede:

- Recibir el evento.
- Consultar el contacto y la oportunidad.
- Responder.
- Actualizar campos.
- Calificar.
- Transferir.
- Respetar la ventana de WhatsApp.
- Registrar la conversación.

El plan Starter tiene acceso básico a API, pero los endpoints y permisos concretos que requiere el desarrollo deben probarse durante el primer hito. Si una función crítica exige acceso no disponible, la decisión de actualizar el plan debe tomarse con evidencia, no por recomendación comercial anticipada. HighLevel aclara además que su soporte no desarrolla ni depura integraciones personalizadas, por lo que el proveedor debe asumir esa responsabilidad técnica. citeturn14view1

La oferta de $5.000.000 COP puede conservarse como referencia económica, pero su alcance debe ser reformulado. Para proteger tu inversión, el contrato debería exigir, antes de iniciar:

- Exclusión definitiva de Chatwoot y B2Chat.
- GoHighLevel como centro de operación.
- Arquitectura aprobada.
- Agente externo propiedad del cliente.
- Integración Meta, Google, web y WhatsApp.
- CRM y modelo de oportunidades.
- Scoring.
- Cotización y seguimiento.
- Remarketing.
- Prototipo de inteligencia de ofertas.
- Pruebas de aceptación.
- Propiedad de cuentas y código.
- Pago 30%–40%–30%.
- Treinta días de soporte desde la aceptación.
- Mes de estrategia y pauta formalmente documentado.

El objetivo no debe ser tener “un chatbot que responde”, sino construir un activo comercial medible:

```text
Captación controlada
+ respuesta inmediata
+ datos organizados
+ precalificación
+ cotización trazable
+ seguimiento
+ remarketing
+ comparación de ofertas
+ medición de margen
= sistema comercial escalable
```