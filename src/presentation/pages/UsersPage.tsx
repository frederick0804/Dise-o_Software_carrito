import { useEffect, useState } from 'react';
import { useUserStore } from '../store/userStore';
import { useCartStore } from '../store/cartStore';
import { UserStatus } from '../../domain/value-objects/UserStatus';
import { Alert } from '../components/shared/Alert';
import { Badge } from '../components/shared/Badge';

interface FormErrors {
  nombres?: string;
  telefono?: string;
}

function validateForm(nombres: string, telefono: string): FormErrors {
  const errs: FormErrors = {};
  const n = nombres.trim();
  const t = telefono.trim();
  if (n.length < 2) errs.nombres = 'Mínimo 2 caracteres.';
  else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(n)) errs.nombres = 'Solo letras y espacios.';
  if (t.length < 7) errs.telefono = 'Mínimo 7 dígitos.';
  else if (!/^[0-9+\-\s()]+$/.test(t)) errs.telefono = 'Solo números y + - ( ).';
  return errs;
}

export function UsersPage() {
  const { users, error, loadUsers, createUser, updateStatus, deleteUser, selectUser, clearError } = useUserStore();
  const { userId: activeUserId, setUser } = useCartStore();

  const [form, setForm] = useState({ nombres: '', direccion: '', telefono: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => { void loadUsers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateForm(form.nombres, form.telefono);
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setFormErrors({});
    await createUser(form.nombres, form.direccion, form.telefono);
    setForm({ nombres: '', direccion: '', telefono: '' });
    setShowForm(false);
  };

  const handleClearSelection = () => {
    selectUser(null);
    setUser(null);
  };

  const handleSelectForCart = (userId: string) => {
    if (activeUserId === userId) {
      handleClearSelection();
      return;
    }
    selectUser(userId);
    setUser(userId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Usuarios</h1>
          <p className="text-sm text-slate-500 mt-0.5">{users.length} usuario{users.length !== 1 ? 's' : ''} registrado{users.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          {activeUserId && (
            <button
              onClick={handleClearSelection}
              className="flex items-center gap-1.5 border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-sm hover:bg-white/80 hover:text-slate-800 transition"
            >
              Quitar selección
            </button>
          )}
          <button
            onClick={() => { setShowForm(v => !v); setFormErrors({}); }}
            className="flex items-center gap-1.5 bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-700 transition shadow-sm"
          >
            + Nuevo usuario
          </button>
        </div>
      </div>

      {error && <Alert message={error} onClose={clearError} />}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
          <h2 className="font-semibold text-slate-700 text-base">Crear nuevo usuario</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Nombres <span className="text-rose-500">*</span></label>
              <input
                className={`border rounded-xl px-3 py-2.5 text-sm w-full focus:outline-none focus:ring-2 transition ${formErrors.nombres ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-sky-200 focus:border-sky-300'}`}
                placeholder="Ej: Juan Pérez"
                value={form.nombres}
                onChange={e => { setForm(f => ({ ...f, nombres: e.target.value })); setFormErrors(f => ({ ...f, nombres: undefined })); }}
              />
              {formErrors.nombres && <span className="text-rose-500 text-xs">{formErrors.nombres}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Dirección</label>
              <input
                className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300 transition"
                placeholder="Ej: Av. Principal 123"
                value={form.direccion}
                onChange={e => setForm(f => ({ ...f, direccion: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Teléfono <span className="text-rose-500">*</span></label>
              <input
                className={`border rounded-xl px-3 py-2.5 text-sm w-full focus:outline-none focus:ring-2 transition ${formErrors.telefono ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-sky-200 focus:border-sky-300'}`}
                placeholder="Ej: 0991234567"
                value={form.telefono}
                onChange={e => { setForm(f => ({ ...f, telefono: e.target.value })); setFormErrors(f => ({ ...f, telefono: undefined })); }}
              />
              {formErrors.telefono && <span className="text-rose-500 text-xs">{formErrors.telefono}</span>}
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" className="bg-sky-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-sky-700 transition shadow-sm">
              Guardar usuario
            </button>
            <button type="button" onClick={() => { setShowForm(false); setFormErrors({}); }} className="text-slate-500 px-4 py-2 text-sm hover:text-slate-700 transition">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {users.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-5xl mb-4">👤</div>
          <p className="font-medium text-slate-500">No hay usuarios registrados</p>
          <p className="text-xs mt-1">Crea un usuario para comenzar a usar el carrito</p>
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">ID</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Nombres</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Dirección</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Teléfono</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Estado</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map(u => (
                <tr
                  key={u.id}
                  onClick={() => handleSelectForCart(u.id)}
                  className={`cursor-pointer transition-colors hover:bg-sky-50/70 ${activeUserId === u.id ? 'bg-sky-50/80 border-l-4 border-l-sky-500' : ''}`}
                >
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-400">{u.id.slice(0, 8)}…</td>
                  <td className="px-5 py-3.5 font-medium text-slate-800">{u.nombres}</td>
                  <td className="px-5 py-3.5 text-slate-500">{u.direccion || <span className="text-slate-300">—</span>}</td>
                  <td className="px-5 py-3.5 text-slate-500">{u.telefono}</td>
                  <td className="px-5 py-3.5">
                    <Badge label={u.estado} color={u.estado === UserStatus.ACTIVE ? 'green' : 'red'} />
                  </td>
                  <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-3">
                      {u.estado === UserStatus.ACTIVE ? (
                        <button onClick={() => void updateStatus(u.id, UserStatus.INACTIVE)} className="text-xs text-amber-600 hover:text-amber-800 font-medium transition">
                          Desactivar
                        </button>
                      ) : (
                        <button onClick={() => void updateStatus(u.id, UserStatus.ACTIVE)} className="text-xs text-emerald-600 hover:text-emerald-800 font-medium transition">
                          Activar
                        </button>
                      )}
                      {confirmDelete === u.id ? (
                        <span className="flex items-center gap-1.5">
                          <button onClick={() => { void deleteUser(u.id); setConfirmDelete(null); }} className="text-xs text-rose-600 font-semibold hover:text-rose-800 transition">
                            Confirmar
                          </button>
                          <button onClick={() => setConfirmDelete(null)} className="text-xs text-slate-400 hover:text-slate-600 transition">
                            Cancelar
                          </button>
                        </span>
                      ) : (
                        <button onClick={() => setConfirmDelete(u.id)} className="text-xs text-rose-400 hover:text-rose-600 transition">
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {activeUserId && (
            <div className="px-5 py-2.5 bg-sky-50 border-t border-sky-100 flex items-center gap-2">
              <span className="text-sky-500 text-xs">●</span>
              <p className="text-xs text-sky-700">
                Carrito activo: <strong>{users.find(u => u.id === activeUserId)?.nombres}</strong>
              </p>
              <button
                onClick={handleClearSelection}
                className="ml-auto text-xs text-sky-600 hover:text-sky-800 font-semibold transition"
              >
                Quitar selección
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
