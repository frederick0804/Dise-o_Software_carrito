import type { OrderProps, OrderStatus, CartItemProps } from '../types';

export class Order {
  private constructor(private props: OrderProps) {}

  static create(userId: string, items: CartItemProps[], total: number): Order {
    const id = `order-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    return new Order({
      id,
      userId,
      items,
      total,
      status: 'pendiente' as OrderStatus,
      createdAt: new Date().toISOString(),
    });
  }

  static fromProps(props: OrderProps): Order {
    return new Order(props);
  }

  get id() { return this.props.id; }
  get userId() { return this.props.userId; }
  get items() { return this.props.items; }
  get total() { return this.props.total; }
  get status() { return this.props.status; }
  get createdAt() { return this.props.createdAt; }

  toPlain(): OrderProps {
    return { ...this.props };
  }
}
