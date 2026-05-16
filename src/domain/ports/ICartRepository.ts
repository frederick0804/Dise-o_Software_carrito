import type { Cart } from '../entities/Cart';

export interface ICartRepository {
  findByUserId(userId: string): Cart | undefined;
  save(cart: Cart): void;
  clear(userId: string): void;
}
