import { create } from 'zustand';
import type { OrderProps } from '../../domain/types';
import { fetchPendingOrders, dequeueNextOrder } from '../../infrastructure/api/orderApi';

interface OrderState {
  orders: OrderProps[];
  loading: boolean;
  error: string | null;
  loadOrders: () => Promise<void>;
  dequeueOrder: () => Promise<void>;
  clearError: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  loading: false,
  error: null,

  loadOrders: async () => {
    set({ loading: true, error: null });
    try {
      const orders = await fetchPendingOrders();
      set({ orders, loading: false });
    } catch (e) {
      set({ error: `Error al cargar pedidos: ${(e as Error).message}`, loading: false });
    }
  },

  dequeueOrder: async () => {
    set({ loading: true, error: null });
    try {
      await dequeueNextOrder();
      const orders = await fetchPendingOrders();
      set({ orders, loading: false });
    } catch (e) {
      set({ error: `Error al procesar pedido: ${(e as Error).message}`, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
