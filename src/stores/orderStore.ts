import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Order, OrderItem, Product } from '../lib/supabase';

interface ExtendedOrderItem extends OrderItem {
  product: Product;
}

interface ExtendedOrder extends Order {
  order_items: ExtendedOrderItem[];
}

interface OrdersState {
  orders: Order[];
  currentOrder: ExtendedOrder | null;
  isLoading: boolean;
  error: string | null;
  fetchOrders: (userId: string) => Promise<void>;
  fetchOrderById: (userId: string, orderId: string) => Promise<void>;
  createOrder: (userId: string, shippingAddress: string, items: Array<{ productId: string, quantity: number, price: number }>) => Promise<{ success: boolean, orderId?: string }>;
}

export const useOrderStore = create<OrdersState>((set) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  fetchOrders: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      set({ orders: data, isLoading: false });
    } catch (error) {
      console.error('Error fetching orders:', error);
      set({ 
        error: (error as Error).message, 
        isLoading: false 
      });
    }
  },

  fetchOrderById: async (userId: string, orderId: string) => {
    set({ isLoading: true, error: null, currentOrder: null });
    try {
      // First fetch the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', userId)
        .single();

      if (orderError) {
        throw orderError;
      }

      // Then fetch the order items with their associated products
      const { data: orderItemsData, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          product: products (*)
        `)
        .eq('order_id', orderId);

      if (itemsError) {
        throw itemsError;
      }

      // Combine the data
      const orderWithItems = {
        ...orderData,
        order_items: orderItemsData as ExtendedOrderItem[]
      };

      set({ 
        currentOrder: orderWithItems, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching order details:', error);
      set({ 
        error: (error as Error).message, 
        isLoading: false 
      });
    }
  },

  createOrder: async (userId: string, shippingAddress: string, items: Array<{ productId: string, quantity: number, price: number }>) => {
    set({ isLoading: true, error: null });
    try {
      // Calculate total price
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Create the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          status: 'pending',
          total,
          shipping_address: shippingAddress,
        })
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      // Create order items
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.productId,
        quantity: item.quantity,
        price_at_purchase: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw itemsError;
      }

      set({ isLoading: false });
      return { success: true, orderId: orderData.id };
    } catch (error) {
      console.error('Error creating order:', error);
      set({ 
        error: (error as Error).message, 
        isLoading: false 
      });
      return { success: false };
    }
  },
}));