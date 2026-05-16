export const API_BASE = 'http://localhost:5096';

export interface BackendProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
}

export interface BackendCartItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface BackendCartResponse {
  items: BackendCartItem[];
  total: number;
}

export interface BackendOrder {
  id: string;
  userId: string;
  total: number;
  status: string;
  createdAt: string;
}

export interface BackendUser {
  id: string;
  names: string;
  address: string;
  phone: string;
  status: string;
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`[${res.status}] ${text}`);
  }

  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}
