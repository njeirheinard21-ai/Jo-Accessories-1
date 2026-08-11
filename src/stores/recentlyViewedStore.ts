import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../services/productService';

interface RecentlyViewedState {
  items: Product[];
  addProduct: (product: Product) => void;
  clearHistory: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      addProduct: (product) => set((state) => {
        const filtered = state.items.filter(item => item.id !== product.id);
        return { items: [product, ...filtered].slice(0, 10) }; // Keep last 10
      }),
      clearHistory: () => set({ items: [] }),
    }),
    { name: 'recently-viewed-storage' }
  )
);
