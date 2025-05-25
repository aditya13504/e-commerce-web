import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Product } from '../lib/supabase';

interface ProductsState {
  products: Product[];
  featuredProducts: Product[];
  categories: string[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchProductsByCategory: (category: string) => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
}

export const useProductStore = create<ProductsState>((set, get) => ({
  products: [],
  featuredProducts: [],
  categories: [],
  currentProduct: null,
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;

      const categories = [...new Set(data.map(product => product.category))];
      set({ products: data, categories, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message
        : 'Failed to connect to the server. Please check your internet connection and try again.';
      console.error('Error fetching products:', error);
      set({ 
        error: errorMessage,
        isLoading: false 
      });
    }
  },

  fetchProductById: async (id: string) => {
    set({ isLoading: true, error: null, currentProduct: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      set({ currentProduct: data, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message
        : 'Failed to connect to the server. Please check your internet connection and try again.';
      console.error('Error fetching product:', error);
      set({ 
        error: errorMessage,
        isLoading: false 
      });
    }
  },

  fetchFeaturedProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .order('name');

      if (error) throw error;
      set({ featuredProducts: data, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message
        : 'Failed to connect to the server. Please check your internet connection and try again.';
      console.error('Error fetching featured products:', error);
      set({ 
        error: errorMessage,
        isLoading: false 
      });
    }
  },

  fetchProductsByCategory: async (category: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('name');

      if (error) throw error;
      set({ products: data, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message
        : 'Failed to connect to the server. Please check your internet connection and try again.';
      console.error('Error fetching products by category:', error);
      set({ 
        error: errorMessage,
        isLoading: false 
      });
    }
  },

  searchProducts: async (query: string) => {
    set({ isLoading: true, error: null });
    try {
      if (!query.trim()) {
        await get().fetchProducts();
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${query}%`)
        .order('name');

      if (error) throw error;
      set({ products: data, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message
        : 'Failed to connect to the server. Please check your internet connection and try again.';
      console.error('Error searching products:', error);
      set({ 
        error: errorMessage,
        isLoading: false 
      });
    }
  },
}));