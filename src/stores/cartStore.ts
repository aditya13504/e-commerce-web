import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { CartItem, Product } from '../lib/supabase';

interface CartState {
  items: (CartItem & { product: Product })[];
  isLoading: boolean;
  error: string | null;
  fetchCartItems: (userId: string) => Promise<void>;
  addToCart: (userId: string, productId: string, quantity: number) => Promise<void>;
  updateQuantity: (userId: string, cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (userId: string, cartItemId: string) => Promise<void>;
  clearCart: (userId: string) => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchCartItems: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product: products (*)
        `)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      set({ 
        items: data as (CartItem & { product: Product })[], 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching cart items:', error);
      set({ 
        error: (error as Error).message, 
        isLoading: false 
      });
    }
  },

  addToCart: async (userId: string, productId: string, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      // Check if item already exists in cart
      const { data: existingItems } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single();

      if (existingItems) {
        // Update quantity if item exists
        const newQuantity = existingItems.quantity + quantity;
        await supabase
          .from('cart_items')
          .update({ quantity: newQuantity })
          .eq('id', existingItems.id);
      } else {
        // Add new item if it doesn't exist
        await supabase
          .from('cart_items')
          .insert({ user_id: userId, product_id: productId, quantity });
      }
      
      // Refetch cart items to update state
      await get().fetchCartItems(userId);
    } catch (error) {
      console.error('Error adding to cart:', error);
      set({ 
        error: (error as Error).message, 
        isLoading: false 
      });
    }
  },

  updateQuantity: async (userId: string, cartItemId: string, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      if (quantity <= 0) {
        await get().removeFromCart(userId, cartItemId);
        return;
      }

      await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId)
        .eq('user_id', userId);
      
      // Refetch cart items to update state
      await get().fetchCartItems(userId);
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      set({ 
        error: (error as Error).message, 
        isLoading: false 
      });
    }
  },

  removeFromCart: async (userId: string, cartItemId: string) => {
    set({ isLoading: true, error: null });
    try {
      await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)
        .eq('user_id', userId);
      
      // Refetch cart items to update state
      await get().fetchCartItems(userId);
    } catch (error) {
      console.error('Error removing from cart:', error);
      set({ 
        error: (error as Error).message, 
        isLoading: false 
      });
    }
  },

  clearCart: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);
      
      set({ items: [], isLoading: false });
    } catch (error) {
      console.error('Error clearing cart:', error);
      set({ 
        error: (error as Error).message, 
        isLoading: false 
      });
    }
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
}));