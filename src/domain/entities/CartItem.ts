import type { CartItemProps } from '../types';

export class CartItem {
  constructor(private props: CartItemProps) {}

  get productId() { return this.props.productId; }
  get product() { return this.props.product; }
  get cantidad() { return this.props.cantidad; }
  get subtotal() { return this.props.product.precio * this.props.cantidad; }

  withCantidad(cantidad: number): CartItem {
    if (cantidad < 1) throw new Error('La cantidad mínima es 1');
    return new CartItem({ ...this.props, cantidad, subtotal: this.props.product.precio * cantidad });
  }

  toPlain(): CartItemProps {
    return { ...this.props, subtotal: this.subtotal };
  }
}
