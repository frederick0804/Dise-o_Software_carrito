import type { ICartRepository } from '../../domain/ports/ICartRepository';
import type { IOrderQueue } from '../../domain/ports/IOrderQueue';
import type { IHistoryRepository } from '../../domain/ports/IHistoryRepository';
import { Order } from '../../domain/entities/Order';
import { createEvent } from '../../domain/events/DomainEvent';

export class CheckoutUseCase {
  constructor(
    private cartRepo: ICartRepository,
    private orderQueue: IOrderQueue,
    private historyRepo: IHistoryRepository,
  ) {}

  execute(userId: string): Order {
    const cart = this.cartRepo.findByUserId(userId);
    if (!cart || cart.isEmpty()) throw new Error('El carrito está vacío');

    const order = Order.create(userId, cart.items.map(i => i.toPlain()), cart.total);
    this.orderQueue.enqueue(order);
    this.cartRepo.clear(userId);

    this.historyRepo.add(
      createEvent('REALIZAR_PEDIDO', `Pedido #${order.id} encolado por $${order.total.toFixed(2)}`, {
        orderId: order.id,
        userId,
        total: order.total,
        itemCount: order.items.length,
      }),
    );

    return order;
  }
}
