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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          body: string
          category: string
          created_at: string
          excerpt: string
          featured_media_id: string | null
          id: string
          noindex: boolean
          og_media_id: string | null
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          body?: string
          category?: string
          created_at?: string
          excerpt?: string
          featured_media_id?: string | null
          id?: string
          noindex?: boolean
          og_media_id?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          category?: string
          created_at?: string
          excerpt?: string
          featured_media_id?: string | null
          id?: string
          noindex?: boolean
          og_media_id?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_featured_media_id_fkey"
            columns: ["featured_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_og_media_id_fkey"
            columns: ["og_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      ctas: {
        Row: {
          created_at: string
          cta_type: string
          destination: string
          enabled: boolean
          icon: string | null
          id: string
          key: string
          label: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_type?: string
          destination?: string
          enabled?: boolean
          icon?: string | null
          id?: string
          key: string
          label: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_type?: string
          destination?: string
          enabled?: boolean
          icon?: string | null
          id?: string
          key?: string
          label?: string
          updated_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          created_at: string
          customer_id: string | null
          details: Json
          email: string | null
          id: string
          message: string | null
          name: string
          notes: string
          phone: string
          preferred_at: string | null
          source: string
          status: string
          subject: string | null
          type: string
          updated_at: string
          vehicle_id: string | null
          vehicle_slug: string | null
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          details?: Json
          email?: string | null
          id?: string
          message?: string | null
          name: string
          notes?: string
          phone: string
          preferred_at?: string | null
          source?: string
          status?: string
          subject?: string | null
          type: string
          updated_at?: string
          vehicle_id?: string | null
          vehicle_slug?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          details?: Json
          email?: string | null
          id?: string
          message?: string | null
          name?: string
          notes?: string
          phone?: string
          preferred_at?: string | null
          source?: string
          status?: string
          subject?: string | null
          type?: string
          updated_at?: string
          vehicle_id?: string | null
          vehicle_slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enquiries_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enquiries_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          category: string
          created_at: string
          id: string
          position: number
          question: string
          status: string
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string
          created_at?: string
          id?: string
          position?: number
          question: string
          status?: string
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          id?: string
          position?: number
          question?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      featured_vehicles: {
        Row: {
          id: string
          position: number
          vehicle_id: string
        }
        Insert: {
          id?: string
          position?: number
          vehicle_id: string
        }
        Update: {
          id?: string
          position?: number
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "featured_vehicles_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: true
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      galleries: {
        Row: {
          created_at: string
          description: string
          id: string
          position: number
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          position?: number
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          position?: number
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          created_at: string
          gallery_id: string
          id: string
          media_id: string
          position: number
        }
        Insert: {
          created_at?: string
          gallery_id: string
          id?: string
          media_id: string
          position?: number
        }
        Update: {
          created_at?: string
          gallery_id?: string
          id?: string
          media_id?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "gallery_items_gallery_id_fkey"
            columns: ["gallery_id"]
            isOneToOne: false
            referencedRelation: "galleries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_items_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          alt: string
          bucket: string
          caption: string
          category: string
          created_at: string
          created_by: string | null
          file_name: string
          height: number | null
          id: string
          mime_type: string
          path: string
          size_bytes: number
          updated_at: string
          url: string
          width: number | null
        }
        Insert: {
          alt?: string
          bucket?: string
          caption?: string
          category?: string
          created_at?: string
          created_by?: string | null
          file_name: string
          height?: number | null
          id?: string
          mime_type?: string
          path: string
          size_bytes?: number
          updated_at?: string
          url: string
          width?: number | null
        }
        Update: {
          alt?: string
          bucket?: string
          caption?: string
          category?: string
          created_at?: string
          created_by?: string | null
          file_name?: string
          height?: number | null
          id?: string
          mime_type?: string
          path?: string
          size_bytes?: number
          updated_at?: string
          url?: string
          width?: number | null
        }
        Relationships: []
      }
      nav_items: {
        Row: {
          created_at: string
          external: boolean
          href: string
          id: string
          is_cta: boolean
          label: string
          menu: string
          parent_id: string | null
          position: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          external?: boolean
          href: string
          id?: string
          is_cta?: boolean
          label: string
          menu?: string
          parent_id?: string | null
          position?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          external?: boolean
          href?: string
          id?: string
          is_cta?: boolean
          label?: string
          menu?: string
          parent_id?: string | null
          position?: number
          updated_at?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "nav_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "nav_items"
            referencedColumns: ["id"]
          },
        ]
      }
      page_sections: {
        Row: {
          body: string
          created_at: string
          enabled: boolean
          heading: string
          id: string
          media_id: string | null
          page_slug: string
          position: number
          primary_cta_id: string | null
          secondary_cta_id: string | null
          section_key: string
          settings: Json
          subheading: string
          updated_at: string
          variant: string
        }
        Insert: {
          body?: string
          created_at?: string
          enabled?: boolean
          heading?: string
          id?: string
          media_id?: string | null
          page_slug: string
          position?: number
          primary_cta_id?: string | null
          secondary_cta_id?: string | null
          section_key: string
          settings?: Json
          subheading?: string
          updated_at?: string
          variant?: string
        }
        Update: {
          body?: string
          created_at?: string
          enabled?: boolean
          heading?: string
          id?: string
          media_id?: string | null
          page_slug?: string
          position?: number
          primary_cta_id?: string | null
          secondary_cta_id?: string | null
          section_key?: string
          settings?: Json
          subheading?: string
          updated_at?: string
          variant?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_sections_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_sections_primary_cta_id_fkey"
            columns: ["primary_cta_id"]
            isOneToOne: false
            referencedRelation: "ctas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_sections_secondary_cta_id_fkey"
            columns: ["secondary_cta_id"]
            isOneToOne: false
            referencedRelation: "ctas"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          body: string
          canonical: string | null
          created_at: string
          draft: Json | null
          featured_media_id: string | null
          id: string
          intro: string
          is_system: boolean
          noindex: boolean
          og_description: string | null
          og_media_id: string | null
          og_title: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          body?: string
          canonical?: string | null
          created_at?: string
          draft?: Json | null
          featured_media_id?: string | null
          id?: string
          intro?: string
          is_system?: boolean
          noindex?: boolean
          og_description?: string | null
          og_media_id?: string | null
          og_title?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          canonical?: string | null
          created_at?: string
          draft?: Json | null
          featured_media_id?: string | null
          id?: string
          intro?: string
          is_system?: boolean
          noindex?: boolean
          og_description?: string | null
          og_media_id?: string | null
          og_title?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pages_featured_media_id_fkey"
            columns: ["featured_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pages_og_media_id_fkey"
            columns: ["og_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          approved: boolean
          created_at: string
          customer_name: string
          id: string
          rating: number
          review: string
          vehicle: string | null
        }
        Insert: {
          approved?: boolean
          created_at?: string
          customer_name: string
          id?: string
          rating?: number
          review: string
          vehicle?: string | null
        }
        Update: {
          approved?: boolean
          created_at?: string
          customer_name?: string
          id?: string
          rating?: number
          review?: string
          vehicle?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          cta_id: string | null
          detail: string
          id: string
          media_id: string | null
          points: string[]
          position: number
          slug: string
          status: string
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_id?: string | null
          detail?: string
          id?: string
          media_id?: string | null
          points?: string[]
          position?: number
          slug: string
          status?: string
          summary?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_id?: string | null
          detail?: string
          id?: string
          media_id?: string | null
          points?: string[]
          position?: number
          slug?: string
          status?: string
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_cta_id_fkey"
            columns: ["cta_id"]
            isOneToOne: false
            referencedRelation: "ctas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          address_line1: string
          address_line2: string
          announcement: string
          announcement_enabled: boolean
          city: string
          company_name: string
          country: string
          default_seo_description: string | null
          default_seo_title: string | null
          email: string
          favicon_media_id: string | null
          hours: Json
          id: boolean
          logo_dark_media_id: string | null
          logo_light_media_id: string | null
          logo_media_id: string | null
          map_query: string
          og_media_id: string | null
          phone_display: string
          phone_tel: string
          postal: string
          primary_color: string | null
          secondary_color: string | null
          short_name: string
          socials: Json
          tagline: string
          updated_at: string
          whatsapp_number: string
          whatsapp_templates: Json
        }
        Insert: {
          address_line1?: string
          address_line2?: string
          announcement?: string
          announcement_enabled?: boolean
          city?: string
          company_name?: string
          country?: string
          default_seo_description?: string | null
          default_seo_title?: string | null
          email?: string
          favicon_media_id?: string | null
          hours?: Json
          id?: boolean
          logo_dark_media_id?: string | null
          logo_light_media_id?: string | null
          logo_media_id?: string | null
          map_query?: string
          og_media_id?: string | null
          phone_display?: string
          phone_tel?: string
          postal?: string
          primary_color?: string | null
          secondary_color?: string | null
          short_name?: string
          socials?: Json
          tagline?: string
          updated_at?: string
          whatsapp_number?: string
          whatsapp_templates?: Json
        }
        Update: {
          address_line1?: string
          address_line2?: string
          announcement?: string
          announcement_enabled?: boolean
          city?: string
          company_name?: string
          country?: string
          default_seo_description?: string | null
          default_seo_title?: string | null
          email?: string
          favicon_media_id?: string | null
          hours?: Json
          id?: boolean
          logo_dark_media_id?: string | null
          logo_light_media_id?: string | null
          logo_media_id?: string | null
          map_query?: string
          og_media_id?: string | null
          phone_display?: string
          phone_tel?: string
          postal?: string
          primary_color?: string | null
          secondary_color?: string | null
          short_name?: string
          socials?: Json
          tagline?: string
          updated_at?: string
          whatsapp_number?: string
          whatsapp_templates?: Json
        }
        Relationships: [
          {
            foreignKeyName: "site_settings_favicon_media_id_fkey"
            columns: ["favicon_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_settings_logo_dark_media_id_fkey"
            columns: ["logo_dark_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_settings_logo_light_media_id_fkey"
            columns: ["logo_light_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_settings_logo_media_id_fkey"
            columns: ["logo_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_settings_og_media_id_fkey"
            columns: ["og_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          bio: string
          created_at: string
          email: string | null
          id: string
          media_id: string | null
          name: string
          phone: string | null
          position: number
          position_title: string
          socials: Json
          status: string
          updated_at: string
        }
        Insert: {
          bio?: string
          created_at?: string
          email?: string | null
          id?: string
          media_id?: string | null
          name: string
          phone?: string | null
          position?: number
          position_title?: string
          socials?: Json
          status?: string
          updated_at?: string
        }
        Update: {
          bio?: string
          created_at?: string
          email?: string | null
          id?: string
          media_id?: string | null
          name?: string
          phone?: string | null
          position?: number
          position_title?: string
          socials?: Json
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          created_at: string
          customer_name: string
          happened_on: string | null
          id: string
          media_id: string | null
          position: number
          rating: number
          review: string
          status: string
          updated_at: string
          vehicle: string | null
        }
        Insert: {
          created_at?: string
          customer_name: string
          happened_on?: string | null
          id?: string
          media_id?: string | null
          position?: number
          rating?: number
          review: string
          status?: string
          updated_at?: string
          vehicle?: string | null
        }
        Update: {
          created_at?: string
          customer_name?: string
          happened_on?: string | null
          id?: string
          media_id?: string | null
          position?: number
          rating?: number
          review?: string
          status?: string
          updated_at?: string
          vehicle?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
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
      vehicle_media: {
        Row: {
          created_at: string
          id: string
          is_cover: boolean
          media_id: string
          position: number
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_cover?: boolean
          media_id: string
          position?: number
          vehicle_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_cover?: boolean
          media_id?: string
          position?: number
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_media_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_media_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          archived: boolean
          availability: string
          body_type: string
          color: string
          condition: string
          created_at: string
          currency: string
          description: string
          drive_type: string
          engine: string
          featured: boolean
          features: string[]
          fuel: string
          id: string
          image_keys: string[]
          image_urls: string[]
          interior_color: string
          is_demo: boolean
          make: string
          mileage: number
          model: string
          noindex: boolean
          price: number
          published: boolean
          seo_description: string | null
          seo_title: string | null
          slug: string
          stock_number: string | null
          transmission: string
          updated_at: string
          variant: string
          video_url: string | null
          year: number
        }
        Insert: {
          archived?: boolean
          availability?: string
          body_type?: string
          color?: string
          condition?: string
          created_at?: string
          currency?: string
          description?: string
          drive_type?: string
          engine?: string
          featured?: boolean
          features?: string[]
          fuel?: string
          id?: string
          image_keys?: string[]
          image_urls?: string[]
          interior_color?: string
          is_demo?: boolean
          make: string
          mileage?: number
          model: string
          noindex?: boolean
          price: number
          published?: boolean
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          stock_number?: string | null
          transmission?: string
          updated_at?: string
          variant?: string
          video_url?: string | null
          year: number
        }
        Update: {
          archived?: boolean
          availability?: string
          body_type?: string
          color?: string
          condition?: string
          created_at?: string
          currency?: string
          description?: string
          drive_type?: string
          engine?: string
          featured?: boolean
          features?: string[]
          fuel?: string
          id?: string
          image_keys?: string[]
          image_urls?: string[]
          interior_color?: string
          is_demo?: boolean
          make?: string
          mileage?: number
          model?: string
          noindex?: boolean
          price?: number
          published?: boolean
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          stock_number?: string | null
          transmission?: string
          updated_at?: string
          variant?: string
          video_url?: string | null
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_manage_content: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "editor" | "sales"
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
    Enums: {
      app_role: ["super_admin", "admin", "editor", "sales"],
    },
  },
} as const
