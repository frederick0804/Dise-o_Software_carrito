import { useEffect } from 'react';
import { useHistoryStore } from '../store/historyStore';
import type { ActionType } from '../../domain/events/DomainEvent';
import { Badge } from '../components/shared/Badge';

const ACTION_LABELS: Record<ActionType, { label: string; color: 'green' | 'red' | 'yellow' | 'blue' | 'gray' | 'violet' | 'teal' }> = {
  AGREGAR_PRODUCTO:         { label: 'Agregar',        color: 'green'  },
  ELIMINAR_PRODUCTO:        { label: 'Eliminar',        color: 'red'    },
  MODIFICAR_CANTIDAD:       { label: 'Modificar',       color: 'yellow' },
  REALIZAR_PEDIDO:          { label: 'Pedido',          color: 'teal' },
  CREAR_USUARIO:            { label: 'Nuevo usuario',   color: 'blue'   },
  ACTUALIZAR_ESTADO_USUARIO:{ label: 'Estado usuario',  color: 'gray'   },
};

export function HistoryPage() {
  const { events, loadHistory, clearHistory } = useHistoryStore();

  useEffect(() => { loadHistory(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Historial de Acciones</h1>
          <p className="text-sm text-slate-500 mt-0.5">{events.length} evento{events.length !== 1 ? 's' : ''} registrado{events.length !== 1 ? 's' : ''}</p>
        </div>
        {events.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-sm text-rose-400 hover:text-rose-600 transition font-medium"
          >
            Limpiar historial
          </button>
        )}
      </div>

      {events.length === 0 ? (
        <div className="text-center py-24 text-slate-400">
          <div className="text-6xl mb-4">📋</div>
          <p className="font-medium text-slate-500">Sin acciones registradas aún</p>
          <p className="text-sm mt-1">Las acciones del carrito y usuarios se registran aquí</p>
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-50">
            {events.map(evt => {
              const meta = ACTION_LABELS[evt.type] ?? { label: evt.type, color: 'gray' as const };
              return (
                <div key={evt.id} className="px-5 py-3.5 flex items-start gap-4 hover:bg-sky-50/60 transition">
                  <div className="pt-0.5 shrink-0">
                    <Badge label={meta.label} color={meta.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800">{evt.description}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(evt.occurredAt).toLocaleString('es-EC', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
