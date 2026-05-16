import type { ICartRepository } from '../../domain/ports/ICartRepository';
import type { IProductRepository } from '../../domain/ports/IProductRepository';
import type { IHistoryRepository } from '../../domain/ports/IHistoryRepository';
import type { Cart } from '../../domain/entities/Cart';
import { createEvent } from '../../domain/events/DomainEvent';

export class RemoveProductUseCase {
  constructor(
    private cartRepo: ICartRepository,
    private productRepo: IProductRepository,
    private historyRepo: IHistoryRepository,
  ) {}

  execute(userId: string, productId: string): Cart {
    const cart = this.cartRepo.findByUserId(userId);
    if (!cart) throw new Error('Carrito no encontrado');

    const product = this.productRepo.findById(productId);
    const updated = cart.removeItem(productId);
    this.cartRepo.save(updated);

    this.historyRepo.add(
      createEvent('ELIMINAR_PRODUCTO', `Se eliminó "${product?.nombre ?? productId}" del carrito`, {
        productId,
        userId,
      }),
    );

    return updated;
  }
}
