/**
 * GENERADO — no editar a mano.
 *
 * Se regenera con el MCP de Supabase (`generate_typescript_types`) o con
 * `supabase gen types typescript --project-id bocfoysursoihohsoafc`.
 *
 * Existe para que el mapeo fila → tipo de dominio (`lib/offers`, `lib/destinations`)
 * lo verifique el compilador y no la confianza: si alguien renombra una columna en
 * una migración y no regenera esto, el build cae en el mapeo en vez de fallar en
 * producción con un `undefined`.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      destinos: {
        Row: {
          actualizado_el: string;
          creado_el: string;
          destacado_en_home: boolean;
          estado: Database["public"]["Enums"]["estado_publicacion"];
          faq: Json;
          id: string;
          imagen: string | null;
          imagen_hero: string | null;
          introduccion: string[];
          mejor_epoca: string | null;
          nombre: string;
          orden: number;
          que_hacer: Json;
          resumen: string | null;
          slug: string;
          tipo: Database["public"]["Enums"]["destino_categoria"];
        };
        Insert: {
          actualizado_el?: string;
          creado_el?: string;
          destacado_en_home?: boolean;
          estado?: Database["public"]["Enums"]["estado_publicacion"];
          faq?: Json;
          id?: string;
          imagen?: string | null;
          imagen_hero?: string | null;
          introduccion?: string[];
          mejor_epoca?: string | null;
          nombre: string;
          orden?: number;
          que_hacer?: Json;
          resumen?: string | null;
          slug: string;
          tipo: Database["public"]["Enums"]["destino_categoria"];
        };
        Update: {
          actualizado_el?: string;
          creado_el?: string;
          destacado_en_home?: boolean;
          estado?: Database["public"]["Enums"]["estado_publicacion"];
          faq?: Json;
          id?: string;
          imagen?: string | null;
          imagen_hero?: string | null;
          introduccion?: string[];
          mejor_epoca?: string | null;
          nombre?: string;
          orden?: number;
          que_hacer?: Json;
          resumen?: string | null;
          slug?: string;
          tipo?: Database["public"]["Enums"]["destino_categoria"];
        };
        Relationships: [];
      };
      imagenes: {
        Row: {
          alt: string | null;
          creado_el: string;
          destino_id: string | null;
          id: string;
          oferta_id: string | null;
          orden: number;
          url: string;
        };
        Insert: {
          alt?: string | null;
          creado_el?: string;
          destino_id?: string | null;
          id?: string;
          oferta_id?: string | null;
          orden?: number;
          url: string;
        };
        Update: {
          alt?: string | null;
          creado_el?: string;
          destino_id?: string | null;
          id?: string;
          oferta_id?: string | null;
          orden?: number;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "imagenes_destino_id_fkey";
            columns: ["destino_id"];
            isOneToOne: false;
            referencedRelation: "destinos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "imagenes_oferta_id_fkey";
            columns: ["oferta_id"];
            isOneToOne: false;
            referencedRelation: "ofertas";
            referencedColumns: ["id"];
          },
        ];
      };
      ofertas: {
        Row: {
          actualizado_el: string;
          alimentacion: string | null;
          beneficio_corto: string;
          ciudad_origen: string;
          creado_el: string;
          destino_id: string;
          documentacion: string[];
          estado: Database["public"]["Enums"]["estado_oferta"];
          faq: Json;
          fecha_periodo: string | null;
          fechas_salida: Json;
          highlights: string[];
          hotel: string | null;
          id: string;
          incluye: string[];
          informacion_importante: string[];
          itinerario: Json;
          mayorista: string | null;
          moneda: Database["public"]["Enums"]["moneda"];
          mostrar_en_home: boolean;
          mostrar_en_mejores_ofertas: boolean;
          mostrar_en_playas_y_hoteles: boolean;
          no_incluye: string[];
          noches: number;
          notas_internas: string | null;
          ocupacion_base: string;
          offer_id: string;
          orden: number;
          politica_cancelacion: string | null;
          precio_desde: number;
          requisitos: string[];
          slug: string;
          titulo: string;
          validada_el: string;
          vigencia_desde: string;
          vigencia_hasta: string;
        };
        Insert: {
          actualizado_el?: string;
          alimentacion?: string | null;
          beneficio_corto: string;
          ciudad_origen: string;
          creado_el?: string;
          destino_id: string;
          documentacion?: string[];
          estado?: Database["public"]["Enums"]["estado_oferta"];
          faq?: Json;
          fecha_periodo?: string | null;
          fechas_salida?: Json;
          highlights?: string[];
          hotel?: string | null;
          id?: string;
          incluye?: string[];
          informacion_importante?: string[];
          itinerario?: Json;
          mayorista?: string | null;
          moneda?: Database["public"]["Enums"]["moneda"];
          mostrar_en_home?: boolean;
          mostrar_en_mejores_ofertas?: boolean;
          mostrar_en_playas_y_hoteles?: boolean;
          no_incluye?: string[];
          noches: number;
          notas_internas?: string | null;
          ocupacion_base: string;
          offer_id: string;
          orden?: number;
          politica_cancelacion?: string | null;
          precio_desde: number;
          requisitos?: string[];
          slug: string;
          titulo: string;
          validada_el: string;
          vigencia_desde: string;
          vigencia_hasta: string;
        };
        Update: {
          actualizado_el?: string;
          alimentacion?: string | null;
          beneficio_corto?: string;
          ciudad_origen?: string;
          creado_el?: string;
          destino_id?: string;
          documentacion?: string[];
          estado?: Database["public"]["Enums"]["estado_oferta"];
          faq?: Json;
          fecha_periodo?: string | null;
          fechas_salida?: Json;
          highlights?: string[];
          hotel?: string | null;
          id?: string;
          incluye?: string[];
          informacion_importante?: string[];
          itinerario?: Json;
          mayorista?: string | null;
          moneda?: Database["public"]["Enums"]["moneda"];
          mostrar_en_home?: boolean;
          mostrar_en_mejores_ofertas?: boolean;
          mostrar_en_playas_y_hoteles?: boolean;
          no_incluye?: string[];
          noches?: number;
          notas_internas?: string | null;
          ocupacion_base?: string;
          offer_id?: string;
          orden?: number;
          politica_cancelacion?: string | null;
          precio_desde?: number;
          requisitos?: string[];
          slug?: string;
          titulo?: string;
          validada_el?: string;
          vigencia_desde?: string;
          vigencia_hasta?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ofertas_destino_id_fkey";
            columns: ["destino_id"];
            isOneToOne: false;
            referencedRelation: "destinos";
            referencedColumns: ["id"];
          },
        ];
      };
      testimonios: {
        Row: {
          calificacion: number | null;
          creado_el: string;
          destino: string | null;
          estado: Database["public"]["Enums"]["estado_publicacion"];
          foto_autorizada: boolean;
          foto_url: string | null;
          id: string;
          nombre: string;
          orden: number;
          texto: string;
        };
        Insert: {
          calificacion?: number | null;
          creado_el?: string;
          destino?: string | null;
          estado?: Database["public"]["Enums"]["estado_publicacion"];
          foto_autorizada?: boolean;
          foto_url?: string | null;
          id?: string;
          nombre: string;
          orden?: number;
          texto: string;
        };
        Update: {
          calificacion?: number | null;
          creado_el?: string;
          destino?: string | null;
          estado?: Database["public"]["Enums"]["estado_publicacion"];
          foto_autorizada?: boolean;
          foto_url?: string | null;
          id?: string;
          nombre?: string;
          orden?: number;
          texto?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      destino_categoria: "nacional" | "internacional" | "pueblos-de-antioquia";
      estado_oferta: "vigente" | "vencida" | "borrador";
      estado_publicacion: "activo" | "inactivo";
      moneda: "COP" | "USD";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database["public"];

export type Tables<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Row"];

export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Update"];

export type Enums<T extends keyof DefaultSchema["Enums"]> =
  DefaultSchema["Enums"][T];
