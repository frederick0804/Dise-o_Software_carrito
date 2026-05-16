import type { CartProps, CartItemProps, ProductProps } from '../types';
import { CartItem } from './CartItem';

// Aggregate Root
export class Cart {
  private constructor(
    private readonly _userId: string,
    private _items: CartItem[],
  ) {}

  static create(userId: string): Cart {
    return new Cart(userId, []);
  }

  static fromProps(props: CartProps): Cart {
    return new Cart(props.userId, props.items.map(i => new CartItem(i)));
  }

  get userId() { return this._userId; }
  get items() { return [...this._items]; }

  get total(): number {
    return this._items.reduce((sum, item) => sum + item.subtotal, 0);
  }

  addItem(product: ProductProps, cantidad: number): Cart {
    const existing = this._items.find(i => i.productId === product.id);
    if (existing) {
      const updated = this._items.map(i =>
        i.productId === product.id ? i.withCantidad(i.cantidad + cantidad) : i
      );
      return new Cart(this._userId, updated);
    }
    const newItem = new CartItem({
      productId: product.id,
      product,
      cantidad,
      subtotal: product.precio * cantidad,
    });
    return new Cart(this._userId, [...this._items, newItem]);
  }

  removeItem(productId: string): Cart {
    return new Cart(this._userId, this._items.filter(i => i.productId !== productId));
  }

  updateQuantity(productId: string, cantidad: number): Cart {
    const updated = this._items.map(i =>
      i.productId === productId ? i.withCantidad(cantidad) : i
    );
    return new Cart(this._userId, updated);
  }

  isEmpty(): boolean {
    return this._items.length === 0;
  }

  toPlain(): CartProps {
    return {
      userId: this._userId,
      items: this._items.map(i => i.toPlain()),
    };
  }
}
