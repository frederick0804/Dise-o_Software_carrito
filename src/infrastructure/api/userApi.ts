import type { UserProps } from '../../domain/types';
import { apiFetch } from './apiClient';
import type { BackendUser } from './apiClient';

function toUserProps(bu: BackendUser): UserProps {
  return {
    id: bu.id,
    nombres: bu.names,
    direccion: bu.address,
    telefono: bu.phone,
    estado: bu.status === 'Active' ? 'Activo' : 'Inactivo',
  };
}

function toBackendStatus(estado: string): string {
  return estado === 'Activo' ? 'Active' : 'Inactive';
}

export async function fetchAllUsers(): Promise<UserProps[]> {
  const data = await apiFetch<BackendUser[]>('/api/users');
  return data.map(toUserProps);
}

export async function createUser(
  nombres: string,
  direccion: string,
  telefono: string,
): Promise<UserProps> {
  const data = await apiFetch<BackendUser>('/api/users', {
    method: 'POST',
    body: JSON.stringify({ names: nombres, address: direccion, phone: telefono }),
  });
  return toUserProps(data);
}

export async function updateUserStatus(userId: string, estado: string): Promise<void> {
  await apiFetch(`/api/users/${userId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: toBackendStatus(estado) }),
  });
}

export async function deleteUser(userId: string): Promise<void> {
  await apiFetch(`/api/users/${userId}`, { method: 'DELETE' });
}
