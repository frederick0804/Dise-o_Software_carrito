// ============================================================
// Tipos de transferencia de datos (plain objects)
// Usados para serialización/deserialización (localStorage, stores)
// ============================================================

export interface UserProps {
  id: string;
  nombres: string;
  direccion: string;
  telefono: string;
  estado: string;
}

export interface ProductProps {
  id: string;
  nombre: string;
  precio: number;
  categoria: string;
  stock: number;
}

export interface CartItemProps {
  productId: string;
  product: ProductProps;
  cantidad: number;
  subtotal: number;
}

export interface CartProps {
  userId: string;
  items: CartItemProps[];
}

export type OrderStatus = 'pendiente' | 'procesando' | 'completado';

export interface OrderProps {
  id: string;
  userId: string;
  items: CartItemProps[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}
