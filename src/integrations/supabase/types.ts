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
          description: string
          id: string
          organization_id: string
          status: Database["public"]["Enums"]["moderation_status"]
          subcategory: string | null
        }
        Insert: {
          category_name: string
          created_at?: string
          description: string
          id?: string
          organization_id: string
          status?: Database["public"]["Enums"]["moderation_status"]
          subcategory?: string | null
        }
        Update: {
          category_name?: string
          created_at?: string
          description?: string
          id?: string
          organization_id?: string
          status?: Database["public"]["Enums"]["moderation_status"]
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
          status: Database["public"]["Enums"]["campaign_status"]
          supporters: number
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
          start_date?: string
          status?: Database["public"]["Enums"]["campaign_status"]
          supporters?: number
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
          status?: Database["public"]["Enums"]["campaign_status"]
          supporters?: number
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
          donor_name: string | null
          id: string
          is_anonymous: boolean
          message: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          campaign_id: string
          created_at?: string
          donor_name?: string | null
          id?: string
          is_anonymous?: boolean
          message?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          campaign_id?: string
          created_at?: string
          donor_name?: string | null
          id?: string
          is_anonymous?: boolean
          message?: string | null
          user_id?: string | null
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
          condition: Database["public"]["Enums"]["item_condition"]
          created_at: string
          description: string
          id: string
          images: string[] | null
          pickup_location: string
          status: Database["public"]["Enums"]["listing_status"]
          subcategory: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          condition: Database["public"]["Enums"]["item_condition"]
          created_at?: string
          description: string
          id?: string
          images?: string[] | null
          pickup_location: string
          status?: Database["public"]["Enums"]["listing_status"]
          subcategory?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          condition?: Database["public"]["Enums"]["item_condition"]
          created_at?: string
          description?: string
          id?: string
          images?: string[] | null
          pickup_location?: string
          status?: Database["public"]["Enums"]["listing_status"]
          subcategory?: string | null
          title?: string
          updated_at?: string
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
          is_custom_category: boolean
          location: string
          moderation_note: string | null
          moderation_status: Database["public"]["Enums"]["moderation_status"]
          status: Database["public"]["Enums"]["request_status"]
          title: string
          updated_at: string
          urgency: Database["public"]["Enums"]["urgency_level"]
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          is_custom_category?: boolean
          location: string
          moderation_note?: string | null
          moderation_status?: Database["public"]["Enums"]["moderation_status"]
          status?: Database["public"]["Enums"]["request_status"]
          title: string
          updated_at?: string
          urgency?: Database["public"]["Enums"]["urgency_level"]
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          is_custom_category?: boolean
          location?: string
          moderation_note?: string | null
          moderation_status?: Database["public"]["Enums"]["moderation_status"]
          status?: Database["public"]["Enums"]["request_status"]
          title?: string
          updated_at?: string
          urgency?: Database["public"]["Enums"]["urgency_level"]
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
          read: boolean
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      organization_subcategory_preferences: {
        Row: {
          accepted_subcategories: string[] | null
          category: string
          id: string
          organization_id: string
          rejected_subcategories: string[] | null
        }
        Insert: {
          accepted_subcategories?: string[] | null
          category: string
          id?: string
          organization_id: string
          rejected_subcategories?: string[] | null
        }
        Update: {
          accepted_subcategories?: string[] | null
          category?: string
          id?: string
          organization_id?: string
          rejected_subcategories?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_subcategory_preferences_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          accepted_categories: string[] | null
          created_at: string
          description: string | null
          id: string
          name: string
          rejected_categories: string[] | null
          status: Database["public"]["Enums"]["org_status"]
          updated_at: string
          user_id: string
          verification_document: string | null
          verification_document_name: string | null
        }
        Insert: {
          accepted_categories?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          rejected_categories?: string[] | null
          status?: Database["public"]["Enums"]["org_status"]
          updated_at?: string
          user_id: string
          verification_document?: string | null
          verification_document_name?: string | null
        }
        Update: {
          accepted_categories?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          rejected_categories?: string[] | null
          status?: Database["public"]["Enums"]["org_status"]
          updated_at?: string
          user_id?: string
          verification_document?: string | null
          verification_document_name?: string | null
        }
        Relationships: []
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
          status: Database["public"]["Enums"]["pickup_status"]
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
          status?: Database["public"]["Enums"]["pickup_status"]
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
          status?: Database["public"]["Enums"]["pickup_status"]
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
          is_banned: boolean
          name: string
          nric: string | null
          status: Database["public"]["Enums"]["user_status"]
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
          is_banned?: boolean
          name: string
          nric?: string | null
          status?: Database["public"]["Enums"]["user_status"]
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
          is_banned?: boolean
          name?: string
          nric?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          verification_document?: string | null
          verification_document_name?: string | null
        }
        Relationships: []
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
          role: Database["public"]["Enums"]["app_role"]
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
          description: string
          end_time: string
          event_date: string
          id: string
          location: string
          organization_id: string
          requirements: string[] | null
          spots_filled: number
          spots_total: number
          start_time: string
          status: Database["public"]["Enums"]["event_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          end_time: string
          event_date: string
          id?: string
          location: string
          organization_id: string
          requirements?: string[] | null
          spots_filled?: number
          spots_total: number
          start_time: string
          status?: Database["public"]["Enums"]["event_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          end_time?: string
          event_date?: string
          id?: string
          location?: string
          organization_id?: string
          requirements?: string[] | null
          spots_filled?: number
          spots_total?: number
          start_time?: string
          status?: Database["public"]["Enums"]["event_status"]
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
          message: string | null
          status: Database["public"]["Enums"]["volunteer_status"]
          user_id: string
        }
        Insert: {
          age: number
          created_at?: string
          event_id: string
          id?: string
          message?: string | null
          status?: Database["public"]["Enums"]["volunteer_status"]
          user_id: string
        }
        Update: {
          age?: number
          created_at?: string
          event_id?: string
          id?: string
          message?: string | null
          status?: Database["public"]["Enums"]["volunteer_status"]
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
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
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
      campaign_status: "active" | "completed" | "cancelled"
      event_status: "upcoming" | "ongoing" | "completed" | "cancelled"
      item_condition: "new" | "like_new" | "good" | "fair"
      listing_status: "available" | "claimed" | "removed"
      moderation_status: "pending" | "approved" | "rejected"
      notification_type:
        | "approval"
        | "donation"
        | "chat"
        | "pickup"
        | "volunteer"
        | "crowdfunding"
        | "system"
      org_status: "pending" | "approved" | "rejected"
      pickup_status:
        | "pending"
        | "accepted"
        | "rejected"
        | "completed"
        | "cancelled"
      request_status: "active" | "fulfilled" | "cancelled"
      urgency_level: "low" | "medium" | "high"
      user_status: "active" | "pending" | "rejected"
      volunteer_status: "pending" | "approved" | "rejected"
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
      campaign_status: ["active", "completed", "cancelled"],
      event_status: ["upcoming", "ongoing", "completed", "cancelled"],
      item_condition: ["new", "like_new", "good", "fair"],
      listing_status: ["available", "claimed", "removed"],
      moderation_status: ["pending", "approved", "rejected"],
      notification_type: [
        "approval",
        "donation",
        "chat",
        "pickup",
        "volunteer",
        "crowdfunding",
        "system",
      ],
      org_status: ["pending", "approved", "rejected"],
      pickup_status: [
        "pending",
        "accepted",
        "rejected",
        "completed",
        "cancelled",
      ],
      request_status: ["active", "fulfilled", "cancelled"],
      urgency_level: ["low", "medium", "high"],
      user_status: ["active", "pending", "rejected"],
      volunteer_status: ["pending", "approved", "rejected"],
    },
  },
} as const
