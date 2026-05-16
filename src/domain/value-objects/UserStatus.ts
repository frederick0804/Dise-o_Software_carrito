export const UserStatus = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
