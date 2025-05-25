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
    console.log('Starting fetchProductById for ID:', id);
    set({ isLoading: true, error: null, currentProduct: null });
    try {
      console.log('Making Supabase request for product:', id);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      console.log('Supabase raw response data:', data);
      console.log('Supabase raw response error:', error);

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      if (!data) {
        console.warn('No product found for ID:', id);
        set({ currentProduct: null, isLoading: false, error: 'Product not found' });
        return;
      }

      console.log('Product data received:', data);
      set({ currentProduct: data, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message
        : 'Failed to fetch product.';
      console.error('Error in fetchProductById:', error);
      set({ 
        error: errorMessage,
        isLoading: false,
        currentProduct: null
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