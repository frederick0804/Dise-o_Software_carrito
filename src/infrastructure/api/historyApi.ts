import type { DomainEvent, ActionType } from '../../domain/events/DomainEvent';
import { apiFetch } from './apiClient';

interface BackendActionLog {
  id: number;
  userId?: string | null;
  actionType: string;
  description: string;
  createdAt: string;
}

const ACTION_MAP: Record<string, ActionType> = {
  ADD: 'AGREGAR_PRODUCTO',
  REMOVE: 'ELIMINAR_PRODUCTO',
  UPDATE: 'MODIFICAR_CANTIDAD',
  CHECKOUT: 'REALIZAR_PEDIDO',
};

function toDomainEvent(log: BackendActionLog): DomainEvent {
  const mapped = ACTION_MAP[log.actionType] ?? 'REALIZAR_PEDIDO';
  return {
    id: `evt-${log.id}`,
    type: mapped,
    description: log.description,
    payload: {
      source: 'backend',
      userId: log.userId ?? undefined,
      actionType: log.actionType,
    },
    occurredAt: log.createdAt,
  };
}

export async function fetchHistory(): Promise<DomainEvent[]> {
  const data = await apiFetch<BackendActionLog[]>('/api/history');
  return data.map(toDomainEvent);
}

export async function clearHistory(): Promise<void> {
  await apiFetch<void>('/api/history', { method: 'DELETE' });
}
