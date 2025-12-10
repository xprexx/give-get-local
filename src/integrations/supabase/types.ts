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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          subcategories: string[] | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          subcategories?: string[] | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          subcategories?: string[] | null
        }
        Relationships: []
      }
      category_proposals: {
        Row: {
          category_name: string
          created_at: string
          description: string | null
          id: string
          organization_id: string
          status: string
          subcategory: string | null
        }
        Insert: {
          category_name: string
          created_at?: string
          description?: string | null
          id?: string
          organization_id: string
          status?: string
          subcategory?: string | null
        }
        Update: {
          category_name?: string
          created_at?: string
          description?: string | null
          id?: string
          organization_id?: string
          status?: string
          subcategory?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "category_proposals_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      crowdfunding_campaigns: {
        Row: {
          created_at: string
          current_amount: number
          description: string
          end_date: string
          id: string
          image_url: string | null
          organization_id: string
          start_date: string
          status: string
          target_amount: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_amount?: number
          description: string
          end_date: string
          id?: string
          image_url?: string | null
          organization_id: string
          start_date: string
          status?: string
          target_amount: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_amount?: number
          description?: string
          end_date?: string
          id?: string
          image_url?: string | null
          organization_id?: string
          start_date?: string
          status?: string
          target_amount?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crowdfunding_campaigns_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      crowdfunding_donations: {
        Row: {
          amount: number
          campaign_id: string
          created_at: string
          donor_id: string | null
          donor_name: string | null
          id: string
          is_anonymous: boolean | null
          message: string | null
        }
        Insert: {
          amount: number
          campaign_id: string
          created_at?: string
          donor_id?: string | null
          donor_name?: string | null
          id?: string
          is_anonymous?: boolean | null
          message?: string | null
        }
        Update: {
          amount?: number
          campaign_id?: string
          created_at?: string
          donor_id?: string | null
          donor_name?: string | null
          id?: string
          is_anonymous?: boolean | null
          message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crowdfunding_donations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "crowdfunding_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      donation_listings: {
        Row: {
          category: string
          condition: string
          created_at: string
          description: string
          id: string
          images: string[] | null
          pickup_location: string
          status: string
          subcategory: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          condition: string
          created_at?: string
          description: string
          id?: string
          images?: string[] | null
          pickup_location: string
          status?: string
          subcategory?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          condition?: string
          created_at?: string
          description?: string
          id?: string
          images?: string[] | null
          pickup_location?: string
          status?: string
          subcategory?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      impact_stories: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          status: string
          title: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          status?: string
          title: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      item_requests: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          is_custom_category: boolean | null
          location: string | null
          moderation_note: string | null
          moderation_status: string | null
          status: string
          subcategory: string | null
          title: string
          updated_at: string
          urgency: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          is_custom_category?: boolean | null
          location?: string | null
          moderation_note?: string | null
          moderation_status?: string | null
          status?: string
          subcategory?: string | null
          title: string
          updated_at?: string
          urgency?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          is_custom_category?: boolean | null
          location?: string | null
          moderation_note?: string | null
          moderation_status?: string | null
          status?: string
          subcategory?: string | null
          title?: string
          updated_at?: string
          urgency?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          accepted_categories: string[] | null
          category_preferences: string[] | null
          created_at: string
          description: string | null
          id: string
          name: string
          rejected_categories: string[] | null
          status: string
          updated_at: string
          user_id: string
          verification_document: string | null
          verification_document_name: string | null
        }
        Insert: {
          accepted_categories?: string[] | null
          category_preferences?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          rejected_categories?: string[] | null
          status?: string
          updated_at?: string
          user_id: string
          verification_document?: string | null
          verification_document_name?: string | null
        }
        Update: {
          accepted_categories?: string[] | null
          category_preferences?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          rejected_categories?: string[] | null
          status?: string
          updated_at?: string
          user_id?: string
          verification_document?: string | null
          verification_document_name?: string | null
        }
        Relationships: []
      }
      pickup_request_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          request_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          request_id: string
          sender_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          request_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pickup_request_messages_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "pickup_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      pickup_requests: {
        Row: {
          alternative_date: string | null
          alternative_time: string | null
          created_at: string
          id: string
          listing_id: string
          message: string | null
          preferred_date: string
          preferred_time: string
          requester_id: string
          response_message: string | null
          status: string
          updated_at: string
        }
        Insert: {
          alternative_date?: string | null
          alternative_time?: string | null
          created_at?: string
          id?: string
          listing_id: string
          message?: string | null
          preferred_date: string
          preferred_time: string
          requester_id: string
          response_message?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          alternative_date?: string | null
          alternative_time?: string | null
          created_at?: string
          id?: string
          listing_id?: string
          message?: string | null
          preferred_date?: string
          preferred_time?: string
          requester_id?: string
          response_message?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pickup_requests_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "donation_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          birthdate: string | null
          created_at: string
          declaration_agreed: boolean | null
          email: string
          id: string
          is_banned: boolean | null
          name: string
          nric: string | null
          status: string
          updated_at: string
          verification_document: string | null
          verification_document_name: string | null
        }
        Insert: {
          address?: string | null
          birthdate?: string | null
          created_at?: string
          declaration_agreed?: boolean | null
          email: string
          id: string
          is_banned?: boolean | null
          name: string
          nric?: string | null
          status?: string
          updated_at?: string
          verification_document?: string | null
          verification_document_name?: string | null
        }
        Update: {
          address?: string | null
          birthdate?: string | null
          created_at?: string
          declaration_agreed?: boolean | null
          email?: string
          id?: string
          is_banned?: boolean | null
          name?: string
          nric?: string | null
          status?: string
          updated_at?: string
          verification_document?: string | null
          verification_document_name?: string | null
        }
        Relationships: []
      }
      subcategory_preferences: {
        Row: {
          accepted_subcategories: string[] | null
          category: string
          created_at: string
          id: string
          organization_id: string
          rejected_subcategories: string[] | null
        }
        Insert: {
          accepted_subcategories?: string[] | null
          category: string
          created_at?: string
          id?: string
          organization_id: string
          rejected_subcategories?: string[] | null
        }
        Update: {
          accepted_subcategories?: string[] | null
          category?: string
          created_at?: string
          id?: string
          organization_id?: string
          rejected_subcategories?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "subcategory_preferences_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      volunteer_events: {
        Row: {
          created_at: string
          current_volunteers: number
          description: string
          event_date: string
          event_time: string
          id: string
          image_url: string | null
          location: string
          max_volunteers: number
          organization_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_volunteers?: number
          description: string
          event_date: string
          event_time: string
          id?: string
          image_url?: string | null
          location: string
          max_volunteers: number
          organization_id: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_volunteers?: number
          description?: string
          event_date?: string
          event_time?: string
          id?: string
          image_url?: string | null
          location?: string
          max_volunteers?: number
          organization_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteer_registrations: {
        Row: {
          age: number
          created_at: string
          event_id: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          age: number
          created_at?: string
          event_id: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          age?: number
          created_at?: string
          event_id?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "volunteer_events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "beneficiary" | "organization" | "admin"
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
    Enums: {
      app_role: ["user", "beneficiary", "organization", "admin"],
    },
  },
} as const
