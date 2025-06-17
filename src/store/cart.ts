import { create } from "zustand";
import type { Product } from "../types/product";


type CartItem = {
  product: Product;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
};

export const useCart = create<CartStore>((set) => ({
  items: [],
  addToCart: (product, quantity) =>
    set((state) => {

        const exists = state.items.find((item) => item.product.id === product.id);
        if (exists) {
        return {
            items: state.items.map((item) =>
            item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
        };
        } else {
        return { items: [...state.items, { product, quantity }] };
        }
    }),


  removeFromCart: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== id),
    })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === id ? { ...item, quantity } : item
      ),
    })),
  clearCart: () => set({ items: [] }),
}));
