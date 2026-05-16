import type { IOrderQueue } from '../../domain/ports/IOrderQueue';
import type { Order } from '../../domain/entities/Order';

export class GetPendingOrdersUseCase {
  constructor(private orderQueue: IOrderQueue) {}

  execute(): Order[] {
    return this.orderQueue.getAll();
  }
}
