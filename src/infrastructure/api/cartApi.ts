import type { CartItemProps, ProductProps } from '../../domain/types';
import { apiFetch } from './apiClient';
import type { BackendCartResponse } from './apiClient';

export interface CartSnapshot {
  items: CartItemProps[];
  total: number;
}

function toCartItemProps(bci: {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}): CartItemProps {
  return {
    productId: bci.productId,
    product: {
      id: bci.productId,
      nombre: bci.productName,
      precio: bci.price,
      categoria: '',
      stock: 0,
    },
    cantidad: bci.quantity,
    subtotal: bci.subtotal,
  };
}

export async function fetchCart(userId: string): Promise<CartSnapshot> {
  const data = await apiFetch<BackendCartResponse>(`/api/cart/${userId}`);
  return {
    items: data.items.map(toCartItemProps),
    total: data.total,
  };
}

export async function addToCart(
  userId: string,
  product: ProductProps,
  qty: number,
): Promise<void> {
  await apiFetch(`/api/cart/${userId}/add`, {
    method: 'POST',
    body: JSON.stringify({
      productId: product.id,
      productName: product.nombre,
      price: product.precio,
      quantity: qty,
    }),
  });
}

export async function removeFromCart(userId: string, productId: string): Promise<void> {
  await apiFetch(`/api/cart/${userId}/items/${productId}`, { method: 'DELETE' });
}

export async function updateCartQuantity(
  userId: string,
  productId: string,
  quantity: number,
): Promise<void> {
  await apiFetch(`/api/cart/${userId}/items/${productId}/quantity`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  });
}
