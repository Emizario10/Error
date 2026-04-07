"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  currentPrice: number;
  imageUrl: string | null;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: CartItem) => void;
  removeItem: (id: string) => void;
  toggleCart: () => void;
  clearCart: () => void;
  totalPrice: () => number;
}

/**
 * USE_CART_STORE: Core persistent inventory manager.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product) => {
        set((state) => ({
          items: [...state.items, product],
          isOpen: true // Auto-open for feedback
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id)
        }));
      },

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      clearCart: () => set({ items: [], isOpen: false }),

      totalPrice: () => {
        return get().items.reduce((total: number, item) => total + item.currentPrice, 0);
      },
    }),
    {
      name: 'krom-sys-cart',
    }
  )
);
