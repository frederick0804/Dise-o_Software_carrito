import type { ICartRepository } from '../../domain/ports/ICartRepository';
import type { IHistoryRepository } from '../../domain/ports/IHistoryRepository';
import type { Cart } from '../../domain/entities/Cart';
import { createEvent } from '../../domain/events/DomainEvent';

export class UpdateQuantityUseCase {
  constructor(
    private cartRepo: ICartRepository,
    private historyRepo: IHistoryRepository,
  ) {}

  execute(userId: string, productId: string, cantidad: number): Cart {
    if (cantidad < 1) throw new Error('La cantidad mínima es 1');
    const cart = this.cartRepo.findByUserId(userId);
    if (!cart) throw new Error('Carrito no encontrado');

    const item = cart.items.find(i => i.productId === productId);
    const updated = cart.updateQuantity(productId, cantidad);
    this.cartRepo.save(updated);

    this.historyRepo.add(
      createEvent('MODIFICAR_CANTIDAD', `Se modificó cantidad de "${item?.product.nombre ?? productId}" a ${cantidad}`, {
        productId,
        cantidad,
        userId,
      }),
    );

    return updated;
  }
}
