export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface ThemePaletteConfig {
  primary_accent: string;
  dark_bg: string;
  dark_surface: string;
  light_bg: string;
  light_surface: string;
  dark_border?: string;
  light_border?: string;
}

export interface Database {
  public: {
    Tables: {
      site_settings: {
        Row: {
          id: string;
          restaurant_name_ar: string;
          restaurant_name_en: string;
          address_ar: string;
          address_en: string;
          maps_embed_url: string;
          primary_phone: string;
          whatsapp_number: string;
          working_hours_ar: string;
          working_hours_en: string;
          delivery_estimate_ar: string;
          delivery_estimate_en: string;
          is_restaurant_open: boolean;
          banner_enabled: boolean;
          banner_text_ar: string;
          banner_text_en: string;
          theme_palette: ThemePaletteConfig;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_name_ar?: string;
          restaurant_name_en?: string;
          address_ar?: string;
          address_en?: string;
          maps_embed_url?: string;
          primary_phone?: string;
          whatsapp_number?: string;
          working_hours_ar?: string;
          working_hours_en?: string;
          delivery_estimate_ar?: string;
          delivery_estimate_en?: string;
          is_restaurant_open?: boolean;
          banner_enabled?: boolean;
          banner_text_ar?: string;
          banner_text_en?: string;
          theme_palette?: ThemePaletteConfig;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_name_ar?: string;
          restaurant_name_en?: string;
          address_ar?: string;
          address_en?: string;
          maps_embed_url?: string;
          primary_phone?: string;
          whatsapp_number?: string;
          working_hours_ar?: string;
          working_hours_en?: string;
          delivery_estimate_ar?: string;
          delivery_estimate_en?: string;
          is_restaurant_open?: boolean;
          banner_enabled?: boolean;
          banner_text_ar?: string;
          banner_text_en?: string;
          theme_palette?: ThemePaletteConfig;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name_ar: string;
          name_en: string;
          slug: string;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name_ar: string;
          name_en: string;
          slug: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name_ar?: string;
          name_en?: string;
          slug?: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      menu_items: {
        Row: {
          id: string;
          category_id: string | null;
          name_ar: string;
          name_en: string;
          title_ar?: string | null;
          title_en?: string | null;
          description_ar: string | null;
          description_en: string | null;
          price: number;
          image_url: string | null;
          badge: string | null;
          is_available: boolean;
          preparation_time: string | null;
          prep_time_minutes?: number;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          name_ar: string;
          name_en: string;
          title_ar?: string | null;
          title_en?: string | null;
          description_ar?: string | null;
          description_en?: string | null;
          price: number;
          image_url?: string | null;
          badge?: string | null;
          is_available?: boolean;
          preparation_time?: string | null;
          prep_time_minutes?: number;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          name_ar?: string;
          name_en?: string;
          title_ar?: string | null;
          title_en?: string | null;
          description_ar?: string | null;
          description_en?: string | null;
          price?: number;
          image_url?: string | null;
          badge?: string | null;
          is_available?: boolean;
          preparation_time?: string | null;
          prep_time_minutes?: number;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          role: 'admin' | 'manager' | 'editor';
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: 'admin' | 'manager' | 'editor';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'admin' | 'manager' | 'editor';
          created_at?: string;
        };
        Relationships: [];
      };
      meals: {
        Row: {
          id: string;
          category_id: string | null;
          name_ar: string;
          name_en: string;
          description_ar: string | null;
          description_en: string | null;
          price: number;
          image_url: string | null;
          is_promoted: boolean;
          is_available: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          name_ar: string;
          name_en: string;
          description_ar?: string | null;
          description_en?: string | null;
          price: number;
          image_url?: string | null;
          is_promoted?: boolean;
          is_available?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          name_ar?: string;
          name_en?: string;
          description_ar?: string | null;
          description_en?: string | null;
          price?: number;
          image_url?: string | null;
          is_promoted?: boolean;
          is_available?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "meals_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      orders: {
        Row: {
          id: string;
          customer_name: string;
          customer_phone: string;
          delivery_address: string | null;
          total_price: number;
          status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_phone: string;
          delivery_address?: string | null;
          total_price: number;
          status?: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          customer_phone?: string;
          delivery_address?: string | null;
          total_price?: number;
          status?: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
          created_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          meal_id: string | null;
          quantity: number;
          unit_price: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          meal_id?: string | null;
          quantity: number;
          unit_price: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          meal_id?: string | null;
          quantity?: number;
          unit_price?: number;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_meal_id_fkey";
            columns: ["meal_id"];
            isOneToOne: false;
            referencedRelation: "menu_items";
            referencedColumns: ["id"];
          }
        ];
      };
      promotions: {
        Row: {
          id: string;
          title_ar: string;
          title_en: string;
          description_ar: string | null;
          description_en: string | null;
          discount_percentage: number;
          badge: string | null;
          image_url: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title_ar: string;
          title_en: string;
          description_ar?: string | null;
          description_en?: string | null;
          discount_percentage?: number;
          badge?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title_ar?: string;
          title_en?: string;
          description_ar?: string | null;
          description_en?: string | null;
          discount_percentage?: number;
          badge?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      restaurant_settings: {
        Row: {
          id: number;
          is_kitchen_open: boolean;
          delivery_time_ar: string;
          delivery_time_en: string;
          announcement_banner_active: boolean;
          announcement_banner_text_ar: string;
          announcement_banner_text_en: string;
          phone: string;
          whatsapp: string;
          address_ar: string;
          address_en: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          is_kitchen_open?: boolean;
          delivery_time_ar?: string;
          delivery_time_en?: string;
          announcement_banner_active?: boolean;
          announcement_banner_text_ar?: string;
          announcement_banner_text_en?: string;
          phone?: string;
          whatsapp?: string;
          address_ar?: string;
          address_en?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          is_kitchen_open?: boolean;
          delivery_time_ar?: string;
          delivery_time_en?: string;
          announcement_banner_active?: boolean;
          announcement_banner_text_ar?: string;
          announcement_banner_text_en?: string;
          phone?: string;
          whatsapp?: string;
          address_ar?: string;
          address_en?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type SiteSettingsRow = Database['public']['Tables']['site_settings']['Row'];
export type SiteSettingsInsert = Database['public']['Tables']['site_settings']['Insert'];
export type SiteSettingsUpdate = Database['public']['Tables']['site_settings']['Update'];

export type CategoryRow = Database['public']['Tables']['categories']['Row'];
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
export type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

export type MenuItemRow = Database['public']['Tables']['menu_items']['Row'];
export type MenuItemInsert = Database['public']['Tables']['menu_items']['Insert'];
export type MenuItemUpdate = Database['public']['Tables']['menu_items']['Update'];

export type PromotionRow = Database['public']['Tables']['promotions']['Row'];
export type PromotionInsert = Database['public']['Tables']['promotions']['Insert'];
export type PromotionUpdate = Database['public']['Tables']['promotions']['Update'];

export type RestaurantSettingsRow = Database['public']['Tables']['restaurant_settings']['Row'];
export type RestaurantSettingsInsert = Database['public']['Tables']['restaurant_settings']['Insert'];
export type RestaurantSettingsUpdate = Database['public']['Tables']['restaurant_settings']['Update'];

export type MealRow = Database['public']['Tables']['meals']['Row'];
export type OrderRow = Database['public']['Tables']['orders']['Row'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
export type OrderItemRow = Database['public']['Tables']['order_items']['Row'];
export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert'];
