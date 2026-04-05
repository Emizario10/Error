import { create } from 'zustand';

export interface CartItem {
  productId: string;
  name: string;
  price: number; // price in cents
  imageUrl?: string | null;
  quantity: number;
}

export interface CartState {
  cartItems: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  totalPrice: () => number; // computed
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  addItem: (item, quantity = 1) => {
    set((state) => {
      const exists = state.cartItems.find((i) => i.productId === item.productId);
      if (exists) {
        return {
          cartItems: state.cartItems.map((i) =>
            i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i
          ),
        };
      }
      return { cartItems: [...state.cartItems, { ...item, quantity }] };
    });
  },
  removeItem: (productId) =>
    set((state) => ({ cartItems: state.cartItems.filter((i) => i.productId !== productId) })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      cartItems: state.cartItems.map((i) =>
        i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i
      ),
    })),
  clear: () => set({ cartItems: [] }),
  totalPrice: () => {
    const items = get().cartItems;
    return items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  },
}));
