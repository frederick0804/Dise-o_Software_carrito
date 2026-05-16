import type { OrderProps } from '../../domain/types';
import { apiFetch } from './apiClient';
import type { BackendOrder } from './apiClient';

function toOrderProps(bo: BackendOrder): OrderProps {
  return {
    id: bo.id,
    userId: bo.userId,
    items: [],
    total: bo.total,
    status: 'pendiente',
    createdAt: bo.createdAt,
  };
}

export async function checkoutOrder(userId: string): Promise<string> {
  const res = await apiFetch<{ message: string; orderId: string; total: number }>(
    `/api/orders/checkout/${userId}`,
    { method: 'POST' },
  );
  return res.message;
}

export async function fetchPendingOrders(): Promise<OrderProps[]> {
  const data = await apiFetch<{ count: number; orders: BackendOrder[] }>('/api/orders/pending');
  return data.orders.map(toOrderProps);
}

export async function dequeueNextOrder(): Promise<OrderProps | null> {
  const data = await apiFetch<{ message: string; order: BackendOrder | null }>('/api/orders/dequeue', {
    method: 'POST',
  });
  return data.order ? toOrderProps(data.order) : null;
}
