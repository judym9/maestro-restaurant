export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name_ar: string;
          name_en: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name_ar: string;
          name_en: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name_ar?: string;
          name_en?: string;
          slug?: string;
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
            referencedRelation: "meals";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type CategoryRow = Database['public']['Tables']['categories']['Row'];
export type MealRow = Database['public']['Tables']['meals']['Row'];
export type OrderRow = Database['public']['Tables']['orders']['Row'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
export type OrderItemRow = Database['public']['Tables']['order_items']['Row'];
export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert'];
