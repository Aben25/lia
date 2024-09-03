export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      "Donations Table": {
        Row: {
          amount: number | null
          created_at: string
          donation_date: string | null
          id: number
          type: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          donation_date?: string | null
          id?: number
          type?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          donation_date?: string | null
          id?: number
          type?: string | null
        }
        Relationships: []
      }
      Sponsees: {
        Row: {
          aspiration: string | null
          bio: string | null
          bod: string | null
          created_at: string
          document: string | null
          "First Name": string | null
          gender: string | null
          grade: string | null
          id: string
          "Last Name": string | null
          location: string | null
          parent_info: string | null
          profile: string | null
          sponsor_id: string | null
        }
        Insert: {
          aspiration?: string | null
          bio?: string | null
          bod?: string | null
          created_at?: string
          document?: string | null
          "First Name"?: string | null
          gender?: string | null
          grade?: string | null
          id?: string
          "Last Name"?: string | null
          location?: string | null
          parent_info?: string | null
          profile?: string | null
          sponsor_id?: string | null
        }
        Update: {
          aspiration?: string | null
          bio?: string | null
          bod?: string | null
          created_at?: string
          document?: string | null
          "First Name"?: string | null
          gender?: string | null
          grade?: string | null
          id?: string
          "Last Name"?: string | null
          location?: string | null
          parent_info?: string | null
          profile?: string | null
          sponsor_id?: string | null
        }
        Relationships: []
      }
      Sponsors: {
        Row: {
          Address: string | null
          Amount: number | null
          City: string | null
          Country: string | null
          Email: string | null
          "First name": string | null
          "First payment date (America/New_York)": string | null
          id: string
          Language: string | null
          "Last name": string | null
          "Last payment date (America/New_York)": string | null
          Phone: string | null
          "Postal code": string | null
          Region: string | null
          Sponsee_id: string | null
        }
        Insert: {
          Address?: string | null
          Amount?: number | null
          City?: string | null
          Country?: string | null
          Email?: string | null
          "First name"?: string | null
          "First payment date (America/New_York)"?: string | null
          id?: string
          Language?: string | null
          "Last name"?: string | null
          "Last payment date (America/New_York)"?: string | null
          Phone?: string | null
          "Postal code"?: string | null
          Region?: string | null
          Sponsee_id?: string | null
        }
        Update: {
          Address?: string | null
          Amount?: number | null
          City?: string | null
          Country?: string | null
          Email?: string | null
          "First name"?: string | null
          "First payment date (America/New_York)"?: string | null
          id?: string
          Language?: string | null
          "Last name"?: string | null
          "Last payment date (America/New_York)"?: string | null
          Phone?: string | null
          "Postal code"?: string | null
          Region?: string | null
          Sponsee_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Sponsors_Sponsee_id_fkey"
            columns: ["Sponsee_id"]
            isOneToOne: false
            referencedRelation: "Sponsees"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
