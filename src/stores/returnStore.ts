import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Return } from '../lib/supabase';

interface ReturnState {
  returns: Return[];
  currentReturn: Return | null;
  isLoading: boolean;
  error: string | null;
  fetchReturns: (userId: string) => Promise<void>;
  fetchReturnById: (returnId: string) => Promise<void>;
  createReturn: (userId: string, orderId: string, orderItemId: string, reason: string) => Promise<{ success: boolean, returnId?: string }>;
}

export const useReturnStore = create<ReturnState>((set) => ({
  returns: [],
  currentReturn: null,
  isLoading: false,
  error: null,

  fetchReturns: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('returns')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      set({ returns: data, isLoading: false });
    } catch (error) {
      console.error('Error fetching returns:', error);
      set({ 
        error: (error as Error).message, 
        isLoading: false 
      });
    }
  },

  fetchReturnById: async (returnId: string) => {
    set({ isLoading: true, error: null, currentReturn: null });
    try {
      const { data, error } = await supabase
        .from('returns')
        .select('*')
        .eq('id', returnId)
        .single();

      if (error) {
        throw error;
      }

      set({ currentReturn: data, isLoading: false });
    } catch (error) {
      console.error('Error fetching return details:', error);
      set({ 
        error: (error as Error).message, 
        isLoading: false 
      });
    }
  },

  createReturn: async (userId: string, orderId: string, orderItemId: string, reason: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('returns')
        .insert({
          user_id: userId,
          order_id: orderId,
          order_item_id: orderItemId,
          status: 'pending',
          reason
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      set({ isLoading: false });
      return { success: true, returnId: data.id };
    } catch (error) {
      console.error('Error creating return request:', error);
      set({ 
        error: (error as Error).message, 
        isLoading: false 
      });
      return { success: false };
    }
  },
}));