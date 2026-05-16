import { useEffect } from 'react';
import { useCatalogStore } from '../store/catalogStore';
import { useCartStore } from '../store/cartStore';
import { Alert } from '../components/shared/Alert';
import { Badge } from '../components/shared/Badge';

const CATEGORY_COLORS: Record<string, 'blue' | 'green' | 'yellow' | 'gray' | 'teal'> = {};
const COLOR_LIST = ['blue', 'teal', 'yellow', 'green', 'gray'] as const;
let colorIdx = 0;
function getCategoryColor(cat: string): 'blue' | 'green' | 'yellow' | 'gray' | 'teal' {
  if (!CATEGORY_COLORS[cat]) {
    CATEGORY_COLORS[cat] = COLOR_LIST[colorIdx % COLOR_LIST.length];
    colorIdx++;
  }
  return CATEGORY_COLORS[cat];
}

export function CatalogPage() {
  const { products, search, loading, error, loadProducts, uploadFromServer, setSearch, getFiltered, clearError } = useCatalogStore();
  const { addProduct, loading: cartLoading, error: cartError, userId, clearError: clearCartError } = useCartStore();

  useEffect(() => { void loadProducts(); }, []);

  const filtered = getFiltered();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Catálogo de Productos</h1>
          <p className="text-sm text-slate-500 mt-0.5">{products.length} productos disponibles</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => void loadProducts()}
            disabled={loading}
            className="flex items-center gap-1.5 border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm hover:bg-white/80 hover:border-slate-300 disabled:opacity-40 transition"
          >
            <span className={loading ? 'animate-spin inline-block' : ''}>↻</span>
            Actualizar
          </button>
          <button
            onClick={() => void uploadFromServer()}
            disabled={loading}
            className="flex items-center gap-1.5 bg-sky-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-sky-700 disabled:opacity-40 transition shadow-sm"
          >
            {loading ? <span className="animate-spin inline-block">↻</span> : '↑'}
            {loading ? 'Cargando…' : 'Cargar catálogo'}
          </button>
        </div>
      </div>

      {(error || cartError) && (
        <Alert message={error ?? cartError ?? ''} onClose={error ? clearError : clearCartError} />
      )}

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
        <input
          className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm bg-white/90 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition"
          placeholder="Buscar por nombre o categoría…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-5xl mb-4">📦</div>
          <p className="font-medium text-slate-500">No hay productos cargados</p>
          <p className="text-xs mt-1">Usa <strong>"Cargar catálogo"</strong> para importar el archivo <code className="bg-slate-100 px-1 rounded">catalogo.csv</code> del servidor</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-4xl mb-3">🔍</div>
          <p>Sin resultados para "<strong>{search}</strong>"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p, idx) => (
            <div
              key={p.id}
              className="fade-up bg-white/90 backdrop-blur rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3 hover:shadow-md hover:border-slate-200 transition-all"
              style={{ animationDelay: `${Math.min(idx, 8) * 45}ms` }}
            >
              <div className="flex justify-between items-start">
                <Badge label={p.categoria} color={getCategoryColor(p.categoria)} />
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.stock > 10 ? 'bg-emerald-50 text-emerald-600' : p.stock > 0 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                  {p.stock > 0 ? `Stock: ${p.stock}` : 'Agotado'}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 text-sm leading-snug">{p.nombre}</h3>
              </div>
              <p className="text-sky-700 font-bold text-xl">${p.precio.toFixed(2)}</p>
              <button
                onClick={() => void addProduct(p)}
                disabled={p.stock === 0 || !userId || cartLoading}
                className="w-full bg-sky-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-sky-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {!userId ? '👤 Selecciona usuario' : p.stock === 0 ? 'Agotado' : cartLoading ? '…' : '+ Agregar al carrito'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
