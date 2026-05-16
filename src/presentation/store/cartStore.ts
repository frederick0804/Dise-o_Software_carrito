import { create } from 'zustand';
import type { CartItemProps, ProductProps } from '../../domain/types';
import { fetchCart, addToCart, removeFromCart, updateCartQuantity } from '../../infrastructure/api/cartApi';
import { checkoutOrder } from '../../infrastructure/api/orderApi';

interface CartState {
  items: CartItemProps[];
  total: number;
  userId: string | null;
  loading: boolean;
  error: string | null;
  setUser: (userId: string | null) => void;
  loadCart: () => Promise<void>;
  addProduct: (product: ProductProps, cantidad?: number) => Promise<void>;
  removeProduct: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, cantidad: number) => Promise<void>;
  checkout: () => Promise<void>;
  clearError: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,
  userId: null,
  loading: false,
  error: null,

  setUser: (userId) => {
    if (!userId) {
      set({ userId: null, items: [], total: 0, loading: false, error: null });
      return;
    }
    set({ userId, items: [], total: 0, error: null });
    void get().loadCart();
  },

  loadCart: async () => {
    const { userId } = get();
    if (!userId) return;
    set({ loading: true, error: null });
    try {
      const snapshot = await fetchCart(userId);
      set({ items: snapshot.items, total: snapshot.total, loading: false });
    } catch (e) {
      set({ error: `Error al cargar carrito: ${(e as Error).message}`, loading: false });
    }
  },

  addProduct: async (product, cantidad = 1) => {
    const { userId } = get();
    if (!userId) { set({ error: 'Selecciona un usuario primero' }); return; }
    set({ loading: true, error: null });
    try {
      await addToCart(userId, product, cantidad);
      const snapshot = await fetchCart(userId);
      set({ items: snapshot.items, total: snapshot.total, loading: false });
    } catch (e) {
      set({ error: `Error al agregar producto: ${(e as Error).message}`, loading: false });
    }
  },

  removeProduct: async (productId) => {
    const { userId } = get();
    if (!userId) return;
    set({ loading: true, error: null });
    try {
      await removeFromCart(userId, productId);
      const snapshot = await fetchCart(userId);
      set({ items: snapshot.items, total: snapshot.total, loading: false });
    } catch (e) {
      set({ error: `Error al eliminar producto: ${(e as Error).message}`, loading: false });
    }
  },

  updateQuantity: async (productId, cantidad) => {
    const { userId } = get();
    if (!userId) return;
    set({ loading: true, error: null });
    try {
      await updateCartQuantity(userId, productId, cantidad);
      const snapshot = await fetchCart(userId);
      set({ items: snapshot.items, total: snapshot.total, loading: false });
    } catch (e) {
      set({ error: `Error al actualizar cantidad: ${(e as Error).message}`, loading: false });
    }
  },

  checkout: async () => {
    const { userId } = get();
    if (!userId) { set({ error: 'Selecciona un usuario primero' }); return; }
    set({ loading: true, error: null });
    try {
      const msg = await checkoutOrder(userId);
      set({ items: [], total: 0, loading: false });
      console.info('Pedido realizado:', msg);
    } catch (e) {
      set({ error: `Error al realizar pedido: ${(e as Error).message}`, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
