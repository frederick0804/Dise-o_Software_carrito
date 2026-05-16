import type { Order } from '../entities/Order';

// Puerto para cola FIFO de pedidos (patrón Queue)
export interface IOrderQueue {
  enqueue(order: Order): void;
  dequeue(): Order | undefined;
  peek(): Order | undefined;
  getAll(): Order[];
  size(): number;
}
