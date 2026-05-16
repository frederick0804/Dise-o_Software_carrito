import type { ICartRepository } from '../../domain/ports/ICartRepository';
import type { IProductRepository } from '../../domain/ports/IProductRepository';
import type { IHistoryRepository } from '../../domain/ports/IHistoryRepository';
import { Cart } from '../../domain/entities/Cart';
import { createEvent } from '../../domain/events/DomainEvent';

export class AddProductUseCase {
  constructor(
    private cartRepo: ICartRepository,
    private productRepo: IProductRepository,
    private historyRepo: IHistoryRepository,
  ) {}

  execute(userId: string, productId: string, cantidad: number): Cart {
    const product = this.productRepo.findById(productId);
    if (!product) throw new Error('Producto no encontrado');
    if (!product.hasStock(cantidad)) throw new Error('Stock insuficiente');

    const cart = this.cartRepo.findByUserId(userId) ?? Cart.create(userId);
    const updated = cart.addItem(product.toPlain(), cantidad);
    this.cartRepo.save(updated);

    this.historyRepo.add(
      createEvent('AGREGAR_PRODUCTO', `Se agregó "${product.nombre}" x${cantidad} al carrito`, {
        productId,
        productName: product.nombre,
        cantidad,
        userId,
      }),
    );

    return updated;
  }
}
