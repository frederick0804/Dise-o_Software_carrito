import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { UsersPage } from '../pages/UsersPage';
import { CatalogPage } from '../pages/CatalogPage';
import { CartPage } from '../pages/CartPage';
import { HistoryPage } from '../pages/HistoryPage';
import { OrdersPage } from '../pages/OrdersPage';
import { useCartStore } from '../store/cartStore';

const NAV_ITEMS = [
  { to: '/usuarios',  label: 'Usuarios',  icon: '👤' },
  { to: '/catalogo',  label: 'Catálogo',  icon: '📦' },
  { to: '/carrito',   label: 'Carrito',   icon: '🛒' },
  { to: '/historial', label: 'Historial', icon: '📋' },
  { to: '/pedidos',   label: 'Pedidos',   icon: '📬' },
];

function Layout({ children }: { children: React.ReactNode }) {
  const { items, userId } = useCartStore();
  const itemCount = items.reduce((s, i) => s + i.cantidad, 0);

  return (
    <div className="min-h-screen app-shell flex flex-col text-slate-900">
      <header className="bg-white/80 border-b border-slate-200/70 backdrop-blur shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold text-sky-700 text-lg tracking-tight">🛍 CarritoApp</span>
          {userId && itemCount > 0 && (
            <span className="text-xs bg-sky-50 text-sky-700 border border-sky-200 rounded-full px-3 py-1 font-medium">
              {itemCount} ítem{itemCount !== 1 ? 's' : ''} en carrito
            </span>
          )}
        </div>
      </header>

      <nav className="bg-white/70 border-b border-slate-200/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 flex gap-1 py-2 overflow-x-auto">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-full transition ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 ring-1 ring-sky-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`
              }
            >
              <span className="text-base">{icon}</span>
              {label}
              {to === '/carrito' && itemCount > 0 && (
                <span className="ml-0.5 bg-sky-600 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-bold">
                  {itemCount}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 fade-up">
        {children}
      </main>

      <footer className="text-center text-xs text-slate-500 py-4 border-t bg-white/70 backdrop-blur">
        Sistema de Carrito de Compras · Arquitectura Hexagonal + DDD · Diseño y Arquitectura de Software
      </footer>
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/usuarios" replace />} />
          <Route path="/usuarios"  element={<UsersPage />} />
          <Route path="/catalogo"  element={<CatalogPage />} />
          <Route path="/carrito"   element={<CartPage />} />
          <Route path="/historial" element={<HistoryPage />} />
          <Route path="/pedidos"   element={<OrdersPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
