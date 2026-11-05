export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      finder_cards: {
        Row: {
          college: string | null
          created_at: string
          display_name: string
          id: string
          is_saved: boolean
          personal_note: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          college?: string | null
          created_at?: string
          display_name: string
          id?: string
          is_saved?: boolean
          personal_note?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          college?: string | null
          created_at?: string
          display_name?: string
          id?: string
          is_saved?: boolean
          personal_note?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      interest_requests: {
        Row: {
          created_at: string
          direction: string
          finder_card_snapshot: Json | null
          id: string
          listing_id: string | null
          ltj_card_id: string | null
          message: string | null
          recipient_id: string
          sender_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          direction?: string
          finder_card_snapshot?: Json | null
          id?: string
          listing_id?: string | null
          ltj_card_id?: string | null
          message?: string | null
          recipient_id: string
          sender_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          direction?: string
          finder_card_snapshot?: Json | null
          id?: string
          listing_id?: string | null
          ltj_card_id?: string | null
          message?: string | null
          recipient_id?: string
          sender_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interest_requests_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "team_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interest_requests_ltj_card_id_fkey"
            columns: ["ltj_card_id"]
            isOneToOne: false
            referencedRelation: "looking_to_join_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      looking_to_join_cards: {
        Row: {
          availability: string | null
          created_at: string
          finder_card_id: string | null
          id: string
          looking_for: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          availability?: string | null
          created_at?: string
          finder_card_id?: string | null
          id?: string
          looking_for?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          availability?: string | null
          created_at?: string
          finder_card_id?: string | null
          id?: string
          looking_for?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "looking_to_join_cards_finder_card_id_fkey"
            columns: ["finder_card_id"]
            isOneToOne: false
            referencedRelation: "finder_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          college: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          college?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          college?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      skill_evidence: {
        Row: {
          created_at: string
          evidence: string | null
          evidence_url: string | null
          finder_card_id: string
          id: string
          position: number
          skill_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          evidence?: string | null
          evidence_url?: string | null
          finder_card_id: string
          id?: string
          position?: number
          skill_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          evidence?: string | null
          evidence_url?: string | null
          finder_card_id?: string
          id?: string
          position?: number
          skill_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_evidence_finder_card_id_fkey"
            columns: ["finder_card_id"]
            isOneToOne: false
            referencedRelation: "finder_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      team_listings: {
        Row: {
          created_at: string
          deadline: string | null
          description: string | null
          event_name: string
          finder_card_id: string | null
          id: string
          open_spots: number | null
          owner_id: string
          skills_needed: string[]
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          description?: string | null
          event_name: string
          finder_card_id?: string | null
          id?: string
          open_spots?: number | null
          owner_id: string
          skills_needed?: string[]
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deadline?: string | null
          description?: string | null
          event_name?: string
          finder_card_id?: string | null
          id?: string
          open_spots?: number | null
          owner_id?: string
          skills_needed?: string[]
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_listings_finder_card_id_fkey"
            columns: ["finder_card_id"]
            isOneToOne: false
            referencedRelation: "finder_cards"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      owns_finder_card: { Args: { _card_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
