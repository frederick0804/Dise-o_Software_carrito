export type ActionType = 'AGREGAR_PRODUCTO' | 'ELIMINAR_PRODUCTO' | 'MODIFICAR_CANTIDAD' | 'REALIZAR_PEDIDO' | 'CREAR_USUARIO' | 'ACTUALIZAR_ESTADO_USUARIO';

export interface DomainEvent {
  id: string;
  type: ActionType;
  description: string;
  payload: Record<string, unknown>;
  occurredAt: string;
}

export function createEvent(
  type: ActionType,
  description: string,
  payload: Record<string, unknown>,
): DomainEvent {
  return {
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    description,
    payload,
    occurredAt: new Date().toISOString(),
  };
}
