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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      demo_comments: {
        Row: {
          author_id: string
          body: string
          created_at: string | null
          id: string
          likes: number | null
          post_id: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string | null
          id?: string
          likes?: number | null
          post_id: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string | null
          id?: string
          likes?: number | null
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "demo_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "demo_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "demo_users_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "demo_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_commitments: {
        Row: {
          amount: number
          committed_at: string | null
          id: string
          status: string | null
          unlocks_at: string | null
          user_id: string
          years: number
        }
        Insert: {
          amount: number
          committed_at?: string | null
          id?: string
          status?: string | null
          unlocks_at?: string | null
          user_id: string
          years?: number
        }
        Update: {
          amount?: number
          committed_at?: string | null
          id?: string
          status?: string | null
          unlocks_at?: string | null
          user_id?: string
          years?: number
        }
        Relationships: [
          {
            foreignKeyName: "demo_commitments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "demo_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_commitments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "demo_users_public"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_conversation_participants: {
        Row: {
          conversation_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          conversation_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          conversation_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "demo_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_conversation_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "demo_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_conversation_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "demo_users_public"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_conversations: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "demo_conversations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "demo_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_conversations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "demo_users_public"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_keys: {
        Row: {
          created_at: string | null
          display_id: string
          id: string
          key_type: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          display_id: string
          id?: string
          key_type: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          display_id?: string
          id?: string
          key_type?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "demo_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "demo_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "demo_users_public"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_messages: {
        Row: {
          body: string | null
          conversation_id: string | null
          created_at: string | null
          id: string
          sender_id: string | null
          transfer_id: string | null
        }
        Insert: {
          body?: string | null
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          sender_id?: string | null
          transfer_id?: string | null
        }
        Update: {
          body?: string | null
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          sender_id?: string | null
          transfer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "demo_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "demo_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "demo_users_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_messages_transfer_id_fkey"
            columns: ["transfer_id"]
            isOneToOne: false
            referencedRelation: "demo_transfers"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_posts: {
        Row: {
          author_id: string | null
          body: string
          comments: number | null
          created_at: string | null
          id: string
          image_url: string | null
          likes: number | null
          mission_tag: string | null
          post_type: string | null
          seedbase_tag: string | null
        }
        Insert: {
          author_id?: string | null
          body: string
          comments?: number | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          likes?: number | null
          mission_tag?: string | null
          post_type?: string | null
          seedbase_tag?: string | null
        }
        Update: {
          author_id?: string | null
          body?: string
          comments?: number | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          likes?: number | null
          mission_tag?: string | null
          post_type?: string | null
          seedbase_tag?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "demo_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "demo_users_public"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_reactions: {
        Row: {
          created_at: string | null
          emoji: string
          id: string
          transfer_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          emoji: string
          id?: string
          transfer_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          emoji?: string
          id?: string
          transfer_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "demo_reactions_transfer_id_fkey"
            columns: ["transfer_id"]
            isOneToOne: false
            referencedRelation: "demo_transfers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "demo_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "demo_users_public"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_transfers: {
        Row: {
          amount: number
          created_at: string | null
          from_user_id: string | null
          id: string
          purpose: string | null
          responded_at: string | null
          status: string | null
          to_user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          from_user_id?: string | null
          id?: string
          purpose?: string | null
          responded_at?: string | null
          status?: string | null
          to_user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          from_user_id?: string | null
          id?: string
          purpose?: string | null
          responded_at?: string | null
          status?: string | null
          to_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_transfers_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "demo_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_transfers_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "demo_users_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_transfers_to_user_id_fkey"
            columns: ["to_user_id"]
            isOneToOne: false
            referencedRelation: "demo_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_transfers_to_user_id_fkey"
            columns: ["to_user_id"]
            isOneToOne: false
            referencedRelation: "demo_users_public"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_users: {
        Row: {
          active_role: string | null
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          id: string
          last_login_at: string | null
          onboarding_complete: boolean | null
          phone: string
          username: string
        }
        Insert: {
          active_role?: string | null
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          last_login_at?: string | null
          onboarding_complete?: boolean | null
          phone: string
          username: string
        }
        Update: {
          active_role?: string | null
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          last_login_at?: string | null
          onboarding_complete?: boolean | null
          phone?: string
          username?: string
        }
        Relationships: []
      }
      demo_wallets: {
        Row: {
          balance: number
          created_at: string | null
          display_id: string
          id: string
          user_id: string
          wallet_type: string | null
        }
        Insert: {
          balance?: number
          created_at?: string | null
          display_id: string
          id?: string
          user_id: string
          wallet_type?: string | null
        }
        Update: {
          balance?: number
          created_at?: string | null
          display_id?: string
          id?: string
          user_id?: string
          wallet_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "demo_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "demo_users_public"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      demo_users_public: {
        Row: {
          active_role: string | null
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          id: string | null
          last_login_at: string | null
          onboarding_complete: boolean | null
          username: string | null
        }
        Insert: {
          active_role?: string | null
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          last_login_at?: string | null
          onboarding_complete?: boolean | null
          username?: string | null
        }
        Update: {
          active_role?: string | null
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          last_login_at?: string | null
          onboarding_complete?: boolean | null
          username?: string | null
        }
        Relationships: []
      }
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
