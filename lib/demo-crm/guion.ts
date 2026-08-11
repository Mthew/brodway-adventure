/**
 * Guion de la demo de GoHighLevel.
 *
 * Los datos viven aquí y no dentro de la página porque el endpoint que guarda las
 * respuestas necesita el mismo conjunto de `id` para validar: sin eso, cualquier
 * cuerpo malformado escribe una clave basura en el archivo de respuestas.
 *
 * Los `id` son el nombre de la columna del archivo JSON. **No se renombran**: al
 * cambiar uno, la respuesta que ya estaba guardada queda huérfana.
 */

export type Pregunta = {
  /** Clave estable en `data/demo-crm-respuestas.json`. */
  id: string;
  /** La pregunta tal como se hace en voz alta. */
  q: string;
  /** Por qué importa — el costo de no preguntarla. */
  porque: string;
  /** Qué respuesta cierra el punto. Ausente cuando depende del negocio, no del proveedor. */
  bien?: string;
};

export type Bloque = {
  titulo: string;
  descripcion: string;
  preguntas: readonly Pregunta[];
};

/** Lo que decide si la reunión sirvió o no. Todo lo demás se puede preguntar por correo. */
export const OBLIGATORIAS = [
  {
    id: "clave-titularidad",
    titulo: "Titularidad",
    detalle:
      "¿A nombre de quién quedan la subcuenta de GoHighLevel, el Business Portfolio de Meta y el número de WhatsApp?",
  },
  {
    id: "clave-contacto-oportunidad",
    titulo: "Contacto vs. Oportunidad",
    detalle:
      "¿Qué campos son de Contacto y cuáles de Oportunidad? Es irreversible: un campo creado para un objeto no se convierte al otro.",
  },
  {
    id: "clave-webhook",
    titulo: "Webhook",
    detalle:
      "URL de entrada, autenticación y si acepta el JSON anidado que ya emite /api/lead o hay que aplanarlo.",
  },
  {
    id: "clave-deduplicacion",
    titulo: "Deduplicación",
    detalle:
      "¿El eventId y el externalId que genera el sitio viajan al CRM y se reutilizan? ¿Quién emite el Lead a Meta: el sitio o GoHighLevel?",
  },
  {
    id: "clave-coexistencia",
    titulo: "Coexistencia",
    detalle:
      "¿El número concreto, en Colombia, soporta app móvil y API a la vez? Que lo validen con el número real, no en abstracto.",
  },
] as const;

export const BLOQUES: readonly Bloque[] = [
  {
    titulo: "1 · Titularidad",
    descripcion:
      "Va primero porque condiciona todo lo demás. Una cuenta ajena no se migra después.",
    preguntas: [
      {
        id: "titularidad-subcuenta",
        q: "¿La subcuenta queda a nombre de BroWay o dentro de la agencia del proveedor?",
        porque:
          "Si vive en la agencia, cambiar de proveedor significa exportar un CSV y empezar de cero: se pierden workflows, conversaciones y pipeline.",
        bien: "Subcuenta propia, con acceso administrador para el cliente desde el día 1.",
      },
      {
        id: "titularidad-meta-whatsapp",
        q: "¿Quién crea el WhatsApp Business Account y el Business Portfolio de Meta?",
        porque:
          "El número, las plantillas aprobadas y el histórico quedan atados a quien sea titular. Recuperarlos después es un trámite con Meta, no un botón.",
        bien: "Ambos a nombre del negocio; el proveedor entra como administrador invitado.",
      },
      {
        id: "titularidad-subcuentas-pruebas",
        q: "Starter incluye tres subcuentas: ¿cuál es producción y cuál es pruebas?",
        porque:
          "Sin entorno de pruebas, el primer test del webhook ensucia la base real de contactos.",
      },
    ],
  },
  {
    titulo: "2 · Modelo de datos — el punto irreversible",
    descripcion:
      "GoHighLevel fija el tipo de objeto al crear el campo. Esta conversación pasa antes de escribir una línea más de /api/lead.",
    preguntas: [
      {
        id: "datos-oferta-es-oportunidad",
        q: "¿Confirmas que offerId, destino y fechaAproximada van como campos de Oportunidad?",
        porque:
          "La misma persona puede cotizar Cartagena hoy y Cancún en seis meses. Si son campos de Contacto, la segunda solicitud borra la primera.",
        bien: "Todo lo que cambia por una conversación es Oportunidad. Lo estable es Contacto.",
      },
      {
        id: "datos-clave-deduplicacion",
        q: "¿La deduplicación de contactos es por teléfono, por correo o por ambos?",
        porque:
          "Nuestro formulario tiene el correo como opcional. Si la clave es el correo, cada lead sin correo entra como contacto nuevo.",
        bien: "Teléfono en E.164 como clave primaria — es lo que el sitio ya normaliza.",
      },
      {
        id: "datos-atribucion",
        q: "La atribución (UTM, página de origen): ¿Contacto u Oportunidad?",
        porque:
          "Si es de Contacto, la segunda campaña que traiga a la misma persona pisa la atribución de la primera y la medición de pauta deja de ser confiable.",
      },
      {
        id: "datos-limite-campos",
        q: "¿Cuántos campos personalizados soporta Starter y se pueden renombrar sin perder el histórico?",
        porque:
          "Determina si el contrato del payload cabe completo o hay que priorizar campos.",
      },
    ],
  },
  {
    titulo: "3 · Integración del sitio con el CRM",
    descripcion:
      "Hoy /api/lead valida, arma el payload y responde 200, pero CRM_WEBHOOK_URL está vacío: el lead no sale a ningún lado.",
    preguntas: [
      {
        id: "integracion-formato-payload",
        q: "¿El webhook acepta JSON anidado o exige un objeto plano?",
        porque:
          "El sitio emite { contacto, oportunidad, atribucion, consentimiento }. Si hace falta aplanarlo, necesito la lista literal de nombres de campo antes de tocar lib/crm.",
      },
      {
        id: "integracion-autenticacion",
        q: "¿Cómo se autentica el webhook?",
        porque:
          "Hoy sería un POST sin firma. Una URL pública sin verificar acepta leads falsos de cualquiera que la descubra.",
        bien: "Header secreto o firma HMAC. Que la URL sea difícil de adivinar no es autenticación.",
      },
      {
        id: "integracion-reintentos",
        q: "Si el CRM está caído, ¿hay reintentos de su lado o los implemento yo?",
        porque:
          "Hoy devolvemos 502 y el lead se pierde. Un lead perdido en horario de pauta es dinero quemado.",
      },
      {
        id: "integracion-idempotencia",
        q: "¿El mismo eventId enviado dos veces crea dos oportunidades?",
        porque:
          "Doble clic del usuario o reintento nuestro duplican el registro y ensucian el pipeline.",
        bien: "Que acepten eventId como clave de idempotencia.",
      },
      {
        id: "integracion-contexto-whatsapp",
        q: "Cuando el visitante se va por WhatsApp en vez de llenar el formulario, ¿cómo llegan la UTM y el offerId al CRM?",
        porque:
          "WhatsApp es el CTA dominante del sitio y ese lead no pasa por /api/lead. Si el contexto no viaja, el asesor vuelve a preguntar qué oferta vio.",
        bien: "Que parseen el texto pre-llenado del enlace wa.me y lo mapeen a campos.",
      },
      {
        id: "integracion-script-ghl",
        q: "¿Exigen instalar el script de tracking de GoHighLevel en el sitio?",
        porque:
          "Carga cookies de terceros que chocan con nuestro banner de consentimiento y pesa sobre el LCP móvil. El formulario es propio precisamente para no ceder el control del consentimiento.",
        bien: "Que expliquen qué se pierde sin él. Un iframe de formularios de GHL no es opción.",
      },
    ],
  },
  {
    titulo: "4 · Consentimiento y cumplimiento",
    descripcion:
      "El sitio ya genera el registro de evidencia por lead. La pregunta es dónde aterriza cada campo.",
    preguntas: [
      {
        id: "consentimiento-texto-aceptado",
        q: "¿Dónde se guarda el texto completo que la persona aceptó?",
        porque:
          "El checkbox no basta: sin el texto íntegro y su versión, la autorización no se acredita ante la SIC. Hay antecedente de sanción de $670 millones por contactar sin autorización previa, expresa e informada.",
        bien: "Campo de texto largo, sin truncar, más un campo aparte para la versión de la política.",
      },
      {
        id: "consentimiento-revocacion",
        q: "¿Cómo se marca una revocación y qué automatizaciones detiene?",
        porque:
          "La revocación es un derecho, no una preferencia. Si el workflow sigue corriendo, el incumplimiento es continuo.",
        bien: "Que el Do Not Disturb distinga canal por canal: WhatsApp, correo, SMS y llamada.",
      },
      {
        id: "consentimiento-rne",
        q: "¿Cómo se cruza el Registro de Números Excluidos?",
        porque:
          "Vigente desde abril de 2024. Si no está contemplado, hay que decirlo ahora y no cuando llegue la queja.",
      },
    ],
  },
  {
    titulo: "5 · WhatsApp multiagente",
    descripcion:
      "Misma línea, varios asesores. Aquí es donde suelen prometerse cosas que la API oficial no permite.",
    preguntas: [
      {
        id: "whatsapp-grupos-mayoristas",
        q: "¿El sistema puede leer automáticamente los grupos de WhatsApp de las mayoristas?",
        porque:
          "Pregunta trampa, hazla igual. La API oficial NO expone los grupos como bandeja programática. Si dicen que sí, están proponiendo automatización sobre WhatsApp Web, que arriesga el bloqueo del número.",
        bien: "Un no, seguido de la alternativa: reenvío a un número dedicado, extracción con IA y validación humana antes de publicar.",
      },
      {
        id: "whatsapp-migracion-numero",
        q: "¿Migrar el número a la API borra el historial? ¿Cuánto tiempo queda fuera de servicio?",
        porque:
          "Es el número que el negocio ya usa. Un fin de semana sin línea es un fin de semana sin leads.",
      },
      {
        id: "whatsapp-colision-asesores",
        q: "¿Qué impide que dos asesores contesten el mismo chat a la vez?",
        porque:
          "Es el fallo típico de la bandeja compartida y el cliente lo nota de inmediato.",
        bien: "Bloqueo real por propietario de conversación, no solo un indicador de quién está escribiendo.",
      },
      {
        id: "whatsapp-transferencia-humana",
        q: "¿Cómo se pausa el bot al transferir a un humano, y se reactiva solo?",
        porque:
          "Un bot que sigue respondiendo encima del asesor es peor que no tener bot.",
        bien: "Pausa por contacto, con resumen de la conversación entregado al asesor.",
      },
      {
        id: "whatsapp-plantillas",
        q: "¿Quién redacta las plantillas y qué pasa si Meta rechaza una a mitad de campaña?",
        porque:
          "Fuera de la ventana de 24 horas solo se puede escribir con plantilla aprobada. Sin plantillas no hay remarketing por WhatsApp.",
      },
    ],
  },
  {
    titulo: "6 · Tracking y atribución",
    descripcion:
      "El sitio solo emite ViewContent y Lead. Todo el embudo posterior ocurre en el CRM y lo emite el CRM.",
    preguntas: [
      {
        id: "tracking-external-id",
        q: "¿Pueden recibir nuestro externalId y reutilizarlo tal cual?",
        porque:
          "El sitio lo entrega ya hasheado en SHA-256 sobre el teléfono en E.164. Si el CRM lo vuelve a hashear, la deduplicación se rompe y la misma conversión se cuenta dos veces.",
      },
      {
        id: "tracking-quien-emite-lead",
        q: "¿Quién emite el Lead a Meta CAPI: el sitio o GoHighLevel?",
        porque:
          "Uno de los dos, nunca ambos. Hoy en el código es un TODO de Fase 2 justamente porque falta esta decisión.",
      },
      {
        id: "tracking-eventos-embudo",
        q: "¿Los eventos posteriores salen por cambio de etapa del pipeline?",
        porque:
          "QualifiedLead, QuoteRequested, QuoteSent, BookingStarted, DepositPaid y Sale son la señal de calidad que optimiza la pauta. Sin ellos se optimiza por formularios llenados, no por ventas.",
      },
    ],
  },
];

/** El contrato que ya emite `/api/lead`. Se lleva a la reunión y se mapea en pantalla. */
export const CONTRATO = [
  {
    objeto: "Contacto",
    campos: "nombre · telefono (E.164) · email (opcional) · ciudadOrigen",
    nota: "Datos estables de la persona.",
  },
  {
    objeto: "Oportunidad",
    campos:
      "offerId · destino · fechaAproximada · viajeros.adultos · viajeros.menores",
    nota: "Una intención de viaje concreta. No se sobrescriben entre solicitudes.",
  },
  {
    objeto: "Atribución",
    campos:
      "fuente · paginaOrigen · locale · utm.{source, medium, campaign, content}",
    nota: "Muere en el salto a WhatsApp si no viaja en el payload.",
  },
  {
    objeto: "Consentimiento",
    campos:
      "otorgado · textoAceptado · versionPolitica · fechaHora · formularioOrigen · identificadorTecnico · canalesAutorizados · revocado",
    nota: "Evidencia, no preferencia. Sin esto la autorización no se acredita.",
  },
  {
    objeto: "Deduplicación",
    campos: "eventId · externalId",
    nota: "Compartidos con el CRM. Sin ellos las conversiones se cuentan doble.",
  },
] as const;

export const BANDERAS = [
  {
    escuchas: "“El bot lee los grupos de las mayoristas.”",
    significa: "Automatización no oficial. Riesgo de bloqueo del número.",
  },
  {
    escuchas: "“La cuenta queda en nuestra agencia, es más fácil.”",
    significa: "Pérdida de propiedad. No aceptar.",
  },
  {
    escuchas: "“Los campos los vamos definiendo sobre la marcha.”",
    significa: "En GoHighLevel eso es irreversible.",
  },
  {
    escuchas: "“Con enviar el formulario ya autorizó.”",
    significa: "Incumple la Ley 1581 de 2012.",
  },
  {
    escuchas: "“Arrancamos la pauta apenas quede el sitio.”",
    significa:
      "La pauta va después de que CRM, atribución y atención estén probados.",
  },
  {
    escuchas: "“GoHighLevel hace todo, no necesitas base de ofertas.”",
    significa: "No es un motor de inventario ni de tarifas.",
  },
] as const;

/** Se pide que muestren al menos cuatro. En pantalla, no en diapositiva. */
export const PRUEBAS = [
  "Lead del formulario web: aparece contacto Y oportunidad, con UTM y offerId visibles.",
  "Contacto duplicado: actualiza el existente, no crea uno nuevo.",
  "WhatsApp entrante: se asigna a un asesor y queda registrado.",
  "Transferencia IA a humano: el bot se detiene y el asesor recibe el resumen.",
  "Revocación: se detienen las automatizaciones comerciales.",
  "Cambio de etapa: dispara el evento de conversión a Meta.",
] as const;

/**
 * Todos los `id` que aceptan respuesta.
 *
 * Es la lista blanca del endpoint: un `id` que no esté aquí se rechaza en vez de
 * crear una clave nueva en el archivo.
 */
export const IDS_VALIDOS: ReadonlySet<string> = new Set([
  ...OBLIGATORIAS.map((item) => item.id),
  ...BLOQUES.flatMap((bloque) => bloque.preguntas.map((p) => p.id)),
]);
