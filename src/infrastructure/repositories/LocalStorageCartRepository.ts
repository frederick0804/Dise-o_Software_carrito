import type { ICartRepository } from '../../domain/ports/ICartRepository';
import type { CartProps } from '../../domain/types';
import { Cart } from '../../domain/entities/Cart';

const KEY = 'carrito:carts';

export class LocalStorageCartRepository implements ICartRepository {
  private load(): Record<string, CartProps> {
    try { return JSON.parse(localStorage.getItem(KEY) ?? '{}'); }
    catch { return {}; }
  }

  private persist(carts: Record<string, CartProps>): void {
    localStorage.setItem(KEY, JSON.stringify(carts));
  }

  findByUserId(userId: string): Cart | undefined {
    const carts = this.load();
    return carts[userId] ? Cart.fromProps(carts[userId]) : undefined;
  }

  save(cart: Cart): void {
    const carts = this.load();
    carts[cart.userId] = cart.toPlain();
    this.persist(carts);
  }

  clear(userId: string): void {
    const carts = this.load();
    delete carts[userId];
    this.persist(carts);
  }
}
