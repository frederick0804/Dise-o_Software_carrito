import type { ProductProps } from '../../domain/types';
import { apiFetch } from './apiClient';
import type { BackendProduct } from './apiClient';

function toProductProps(bp: BackendProduct): ProductProps {
  return {
    id: bp.id,
    nombre: bp.name,
    precio: bp.price,
    categoria: bp.category,
    stock: bp.stock,
  };
}

export async function fetchAllProducts(): Promise<ProductProps[]> {
  const data = await apiFetch<BackendProduct[]>('/api/catalog');
  return data.map(toProductProps);
}

export async function uploadCatalogFromServer(): Promise<string> {
  const res = await apiFetch<{ message: string }>('/api/catalog/upload', {
    method: 'POST',
  });
  return res.message;
}
