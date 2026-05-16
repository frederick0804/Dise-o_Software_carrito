import { create } from 'zustand';
import type { DomainEvent } from '../../domain/events/DomainEvent';
import { fetchHistory, clearHistory as apiClearHistory } from '../../infrastructure/api/historyApi';

interface HistoryState {
  events: DomainEvent[];
  loading: boolean;
  error: string | null;
  loadHistory: () => Promise<void>;
  clearHistory: () => Promise<void>;
  clearError: () => void;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  events: [],
  loading: false,
  error: null,

  loadHistory: async () => {
    set({ loading: true, error: null });
    try {
      const events = await fetchHistory();
      set({ events, loading: false });
    } catch (e) {
      set({ error: `Error al cargar historial: ${(e as Error).message}`, loading: false });
    }
  },

  clearHistory: async () => {
    set({ loading: true, error: null });
    try {
      await apiClearHistory();
      set({ events: [], loading: false });
    } catch (e) {
      set({ error: `Error al limpiar historial: ${(e as Error).message}`, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
