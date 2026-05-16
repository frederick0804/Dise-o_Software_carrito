import { create } from 'zustand';
import type { ProductProps } from '../../domain/types';
import { fetchAllProducts, uploadCatalogFromServer } from '../../infrastructure/api/catalogApi';

interface CatalogState {
  products: ProductProps[];
  search: string;
  error: string | null;
  loading: boolean;
  loadProducts: () => Promise<void>;
  uploadFromServer: () => Promise<void>;
  setSearch: (q: string) => void;
  getFiltered: () => ProductProps[];
  clearError: () => void;
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
  products: [],
  search: '',
  error: null,
  loading: false,

  loadProducts: async () => {
    set({ loading: true, error: null });
    try {
      const products = await fetchAllProducts();
      set({ products, loading: false });
    } catch (e) {
      set({ error: `Error al cargar catálogo: ${(e as Error).message}`, loading: false });
    }
  },

  uploadFromServer: async () => {
    set({ loading: true, error: null });
    try {
      const msg = await uploadCatalogFromServer();
      const products = await fetchAllProducts();
      set({ products, loading: false, error: null });
      console.info('Catálogo cargado:', msg);
    } catch (e) {
      set({ error: `Error al cargar catálogo: ${(e as Error).message}`, loading: false });
    }
  },

  setSearch: (q) => set({ search: q }),

  getFiltered: () => {
    const { products, search } = get();
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q),
    );
  },

  clearError: () => set({ error: null }),
}));
