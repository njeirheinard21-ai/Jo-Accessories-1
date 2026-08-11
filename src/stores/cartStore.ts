import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../services/productService';

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotals: () => { total: number; count: number };
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: (product, quantity = 1) => set((state) => {
        const existingItem = state.items.find(item => item.id === product.id);
        if (existingItem) {
          return {
            items: state.items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
            isOpen: true // open cart when adding
          };
        }
        return { items: [...state.items, { ...product, quantity }], isOpen: true };
      }),
      removeItem: (productId) => set((state) => ({
        items: state.items.filter(item => item.id !== productId),
      })),
      updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map(item =>
          item.id === productId ? { ...item, quantity } : item
        ),
      })),
      clearCart: () => set({ items: [] }),
      getTotals: () => {
        const { items } = get();
        return items.reduce(
          (acc, item) => ({
            total: acc.total + item.price * item.quantity,
            count: acc.count + item.quantity,
          }),
          { total: 0, count: 0 }
        );
      },
    }),
    { name: 'cart-storage' }
  )
);
