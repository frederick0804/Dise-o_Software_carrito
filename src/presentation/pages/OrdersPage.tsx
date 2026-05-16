import { useEffect } from 'react';
import { useOrderStore } from '../store/orderStore';
import { useUserStore } from '../store/userStore';
import { Badge } from '../components/shared/Badge';

export function OrdersPage() {
  const { orders, loading, loadOrders, dequeueOrder } = useOrderStore();
  const { users } = useUserStore();

  useEffect(() => { void loadOrders(); }, []);

  const getUserName = (userId: string) =>
    users.find(u => u.id === userId)?.nombres ?? `${userId.slice(0, 8)}…`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Cola de Pedidos</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {orders.length} pedido{orders.length !== 1 ? 's' : ''} pendiente{orders.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => void loadOrders()}
            disabled={loading}
            className="flex items-center gap-1.5 border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-sm hover:bg-white/80 disabled:opacity-40 transition"
          >
            <span className={loading ? 'animate-spin inline-block' : ''}>↻</span>
            Actualizar
          </button>
          {orders.length > 0 && (
            <button
              onClick={() => { void dequeueOrder(); }}
              disabled={loading}
              className="flex items-center gap-1.5 bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-700 disabled:opacity-40 transition shadow-sm"
            >
              ▶ Procesar siguiente (FIFO)
            </button>
          )}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 text-slate-400">
          <div className="text-6xl mb-4">📬</div>
          <p className="font-medium text-slate-500">No hay pedidos en cola</p>
          <p className="text-sm mt-1">Realiza una compra desde el <strong className="text-slate-600">Carrito</strong></p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order, idx) => (
            <div
              key={order.id}
              className={`fade-up bg-white/90 backdrop-blur rounded-2xl border shadow-sm p-5 transition-all ${
                idx === 0
                  ? 'border-sky-200 ring-2 ring-sky-100 shadow-sky-100'
                  : 'border-slate-100'
              }`}
              style={{ animationDelay: `${Math.min(idx, 8) * 45}ms` }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${idx === 0 ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {idx + 1}
                  </div>
                  <div>
                    {idx === 0 && (
                      <div className="mb-1">
                        <Badge label="Siguiente en cola" color="teal" />
                      </div>
                    )}
                    <p className="font-medium text-slate-800 text-sm">
                      Usuario: <span className="text-sky-700">{getUserName(order.userId)}</span>
                    </p>
                    <p className="font-mono text-xs text-slate-400 mt-0.5">{order.id}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleString('es-EC', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-sky-700">${order.total.toFixed(2)}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Total del pedido</p>
                </div>
              </div>

              {order.items.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                  {order.items.map(item => (
                    <div key={item.productId} className="flex justify-between text-sm text-slate-600">
                      <span>{item.product.nombre} <span className="text-slate-400">×{item.cantidad}</span></span>
                      <span className="font-medium">${item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
