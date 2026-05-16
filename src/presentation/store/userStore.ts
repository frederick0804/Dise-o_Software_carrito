import { create } from 'zustand';
import type { UserProps } from '../../domain/types';
import { UserStatus } from '../../domain/value-objects/UserStatus';
import {
  fetchAllUsers,
  createUser as apiCreateUser,
  updateUserStatus as apiUpdateStatus,
  deleteUser as apiDeleteUser,
} from '../../infrastructure/api/userApi';

interface UserState {
  users: UserProps[];
  selectedUserId: string | null;
  loading: boolean;
  error: string | null;
  loadUsers: () => Promise<void>;
  createUser: (nombres: string, direccion: string, telefono: string) => Promise<void>;
  updateStatus: (userId: string, status: UserStatus) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  selectUser: (userId: string | null) => void;
  clearError: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  selectedUserId: null,
  loading: false,
  error: null,

  loadUsers: async () => {
    set({ loading: true, error: null });
    try {
      const users = await fetchAllUsers();
      set({ users, loading: false });
    } catch (e) {
      set({ error: `Error al cargar usuarios: ${(e as Error).message}`, loading: false });
    }
  },

  createUser: async (nombres, direccion, telefono) => {
    const nombreTrim = nombres.trim();
    const telefonoTrim = telefono.trim();

    if (nombreTrim.length < 2)
      return set({ error: 'El nombre debe tener al menos 2 caracteres.' });
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombreTrim))
      return set({ error: 'El nombre solo puede contener letras y espacios.' });
    if (telefonoTrim.length < 7)
      return set({ error: 'El teléfono debe tener al menos 7 dígitos.' });
    if (!/^[0-9+\-\s()]+$/.test(telefonoTrim))
      return set({ error: 'El teléfono solo puede contener números y los caracteres + - ( ).' });

    const existe = get().users.find(
      u => u.nombres.toLowerCase() === nombreTrim.toLowerCase(),
    );
    if (existe) return set({ error: `Ya existe un usuario con el nombre "${nombreTrim}".` });

    set({ loading: true, error: null });
    try {
      const user = await apiCreateUser(nombreTrim, direccion.trim(), telefonoTrim);
      set(s => ({ users: [...s.users, user], loading: false, error: null }));
    } catch (e) {
      set({ error: `Error al crear usuario: ${(e as Error).message}`, loading: false });
    }
  },

  updateStatus: async (userId, status) => {
    set({ loading: true, error: null });
    try {
      await apiUpdateStatus(userId, status);
      set(s => ({
        users: s.users.map(u => (u.id === userId ? { ...u, estado: status } : u)),
        loading: false,
        error: null,
      }));
    } catch (e) {
      set({ error: `Error al actualizar estado: ${(e as Error).message}`, loading: false });
    }
  },

  deleteUser: async (userId) => {
    const { users, selectedUserId } = get();
    const user = users.find(u => u.id === userId);
    if (!user) return;
    if (user.estado === UserStatus.ACTIVE)
      return set({ error: 'No se puede eliminar un usuario Activo. Desactívalo primero.' });
    if (selectedUserId === userId)
      return set({ error: 'No se puede eliminar el usuario activo en el carrito.' });

    set({ loading: true, error: null });
    try {
      await apiDeleteUser(userId);
      set(s => ({ users: s.users.filter(u => u.id !== userId), loading: false, error: null }));
    } catch (e) {
      set({ error: `Error al eliminar usuario: ${(e as Error).message}`, loading: false });
    }
  },

  selectUser: (userId) => set({ selectedUserId: userId }),
  clearError: () => set({ error: null }),
}));
