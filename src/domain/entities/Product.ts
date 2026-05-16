import type { ProductProps } from '../types';

export class Product {
  private constructor(private props: ProductProps) {}

  static create(params: Omit<ProductProps, 'id'>): Product {
    const id = `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    return new Product({ ...params, id });
  }

  static fromProps(props: ProductProps): Product {
    return new Product(props);
  }

  get id() { return this.props.id; }
  get nombre() { return this.props.nombre; }
  get precio() { return this.props.precio; }
  get categoria() { return this.props.categoria; }
  get stock() { return this.props.stock; }

  hasStock(qty: number): boolean {
    return this.props.stock >= qty;
  }

  toPlain(): ProductProps {
    return { ...this.props };
  }
}
