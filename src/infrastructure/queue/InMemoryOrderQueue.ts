import type { IOrderQueue } from '../../domain/ports/IOrderQueue';
import type { OrderProps } from '../../domain/types';
import { Order } from '../../domain/entities/Order';

const KEY = 'carrito:orders';

export class InMemoryOrderQueue implements IOrderQueue {
  private load(): OrderProps[] {
    try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); }
    catch { return []; }
  }

  private persist(orders: OrderProps[]): void {
    localStorage.setItem(KEY, JSON.stringify(orders));
  }

  enqueue(order: Order): void {
    const orders = this.load();
    orders.push(order.toPlain());
    this.persist(orders);
  }

  dequeue(): Order | undefined {
    const orders = this.load();
    if (orders.length === 0) return undefined;
    const [first, ...rest] = orders;
    this.persist(rest);
    return Order.fromProps(first);
  }

  peek(): Order | undefined {
    const orders = this.load();
    return orders.length > 0 ? Order.fromProps(orders[0]) : undefined;
  }

  getAll(): Order[] { return this.load().map(Order.fromProps); }

  size(): number { return this.load().length; }
}
