import { useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import { useUserStore } from '../store/userStore';
import { useOrderStore } from '../store/orderStore';
import { Alert } from '../components/shared/Alert';

export function CartPage() {
  const { items, total, userId, loading, error, loadCart, removeProduct, updateQuantity, checkout, clearError } = useCartStore();
  const { users } = useUserStore();
  const { loadOrders } = useOrderStore();

  useEffect(() => { void loadCart(); }, [userId]);

  const activeUser = users.find(u => u.id === userId);
  const itemCount = items.reduce((s, i) => s + i.cantidad, 0);

  const handleCheckout = async () => {
    await checkout();
    void loadOrders();
  };

  if (!userId) {
    return (
      <div className="text-center py-24 text-slate-400">
        <div className="text-6xl mb-4">👤</div>
        <p className="text-lg font-medium text-slate-500">Ningún usuario seleccionado</p>
        <p className="text-sm mt-1">Ve a <strong className="text-slate-600">Usuarios</strong> y haz clic en una fila para activarlo</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Carrito de Compras</h1>
          {activeUser && (
            <p className="text-sm text-sky-700 mt-0.5">
              Usuario activo: <strong>{activeUser.nombres}</strong>
            </p>
          )}
        </div>
        <button
          onClick={() => void loadCart()}
          disabled={loading}
          className="flex items-center gap-1.5 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-sm hover:bg-white/80 disabled:opacity-40 transition"
        >
          <span className={loading ? 'animate-spin inline-block' : ''}>↻</span>
          Actualizar
        </button>
      </div>

      {error && <Alert message={error} onClose={clearError} />}

      {items.length === 0 ? (
        <div className="text-center py-24 text-slate-400">
          <div className="text-6xl mb-4">🛒</div>
          <p className="font-medium text-slate-500">El carrito está vacío</p>
          <p className="text-sm mt-1">Agrega productos desde el <strong className="text-slate-600">Catálogo</strong></p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 grid grid-cols-12 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <div className="col-span-5">Producto</div>
                <div className="col-span-2 text-right">Precio</div>
                <div className="col-span-3 text-center">Cantidad</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>
              <div className="divide-y divide-slate-100">
                {items.map(item => (
                  <div key={item.productId} className="px-5 py-4 grid grid-cols-12 items-center gap-2 hover:bg-slate-50 transition">
                    <div className="col-span-5">
                      <p className="font-medium text-slate-800 text-sm">{item.product.nombre}</p>
                      <button
                        onClick={() => void removeProduct(item.productId)}
                        className="text-xs text-rose-400 hover:text-rose-600 mt-0.5 transition"
                      >
                        Eliminar
                      </button>
                    </div>
                    <div className="col-span-2 text-right text-sm text-slate-500">
                      ${item.product.precio.toFixed(2)}
                    </div>
                    <div className="col-span-3 flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => void updateQuantity(item.productId, item.cantidad - 1)}
                        disabled={item.cantidad <= 1 || loading}
                        className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 text-sm font-bold transition"
                      >−</button>
                      <span className="w-7 text-center text-sm font-semibold text-slate-700">{item.cantidad}</span>
                      <button
                        onClick={() => void updateQuantity(item.productId, item.cantidad + 1)}
                        disabled={loading}
                        className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 text-sm font-bold transition"
                      >+</button>
                    </div>
                    <div className="col-span-2 text-right font-semibold text-sky-700 text-sm">
                      ${item.subtotal.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4 sticky top-4">
              <h2 className="font-semibold text-slate-700 text-base">Resumen</h2>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Artículos</span>
                  <span className="font-medium">{itemCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Productos únicos</span>
                  <span className="font-medium">{items.length}</span>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                <span className="font-bold text-slate-800">Total</span>
                <span className="text-2xl font-bold text-sky-700">${total.toFixed(2)}</span>
              </div>
              <button
                onClick={() => void handleCheckout()}
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm text-sm"
              >
                {loading ? '⏳ Procesando…' : '✓ Realizar Pedido'}
              </button>
              <p className="text-xs text-slate-400 text-center">El pedido se enviará a la cola de procesamiento</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
