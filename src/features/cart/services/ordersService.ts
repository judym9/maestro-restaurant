import { supabase, isSupabaseConfigured } from '../../../lib/supabase/client';
import type { CartItem } from '../types/cart.types';
import type { OrderRow, OrderInsert } from '../../../types/database.types';

export interface CustomerDetails {
  name: string;
  phone: string;
  address?: string;
  notes?: string;
}

export interface CreateOrderResponse {
  data: OrderRow | null;
  orderNumber: string;
  error: Error | null;
  fromFallback: boolean;
}

export async function createOrder(
  customer: CustomerDetails,
  items: CartItem[],
  totalPrice: number
): Promise<CreateOrderResponse> {
  const shortCode = 'MST-' + Math.floor(10000 + Math.random() * 90000);

  // If Supabase is not configured or in offline demo mode
  if (!isSupabaseConfigured) {
    const mockOrder: OrderRow = {
      id: shortCode,
      customer_name: customer.name,
      customer_phone: customer.phone,
      delivery_address: customer.address || null,
      total_price: totalPrice,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    // Save mock order in localStorage for audit
    try {
      const existing = JSON.parse(localStorage.getItem('maestro_recent_orders') || '[]');
      existing.unshift(mockOrder);
      localStorage.setItem('maestro_recent_orders', JSON.stringify(existing.slice(0, 10)));
    } catch (e) {
      console.error('Failed to write mock order to localStorage:', e);
    }

    return {
      data: mockOrder,
      orderNumber: shortCode,
      error: null,
      fromFallback: true,
    };
  }

  try {
    // 1. Insert order header
    const orderPayload: OrderInsert = {
      customer_name: customer.name,
      customer_phone: customer.phone,
      delivery_address: customer.address || null,
      total_price: totalPrice,
      status: 'pending',
    };

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert(orderPayload)
      .select()
      .single();

    if (orderError || !orderData) {
      throw new Error(orderError?.message || 'Failed to create order record');
    }

    // 2. Insert order items
    // If item.mealId is not a valid UUID (e.g. from local string ID), pass null or meal_id
    const isUuid = (str: string) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    const itemsPayload = items.map((item) => ({
      order_id: orderData.id,
      meal_id: isUuid(item.mealId) ? item.mealId : null,
      quantity: item.quantity,
      unit_price: item.unitPrice,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsPayload);

    if (itemsError) {
      console.warn('[ordersService] Order items insertion warning:', itemsError.message);
    }

    const orderDisplayId = 'MST-' + orderData.id.slice(0, 6).toUpperCase();

    return {
      data: orderData,
      orderNumber: orderDisplayId,
      error: null,
      fromFallback: false,
    };
  } catch (err: any) {
    console.error('[ordersService] Error creating order in Supabase:', err);

    // Graceful fallback so checkout never fails the customer
    const fallbackOrder: OrderRow = {
      id: shortCode,
      customer_name: customer.name,
      customer_phone: customer.phone,
      delivery_address: customer.address || null,
      total_price: totalPrice,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    return {
      data: fallbackOrder,
      orderNumber: shortCode,
      error: err,
      fromFallback: true,
    };
  }
}
