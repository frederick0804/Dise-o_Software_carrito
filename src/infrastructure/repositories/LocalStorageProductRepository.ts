import type { IProductRepository } from '../../domain/ports/IProductRepository';
import type { ProductProps } from '../../domain/types';
import { Product } from '../../domain/entities/Product';

const KEY = 'carrito:products';

export class LocalStorageProductRepository implements IProductRepository {
  private load(): ProductProps[] {
    try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); }
    catch { return []; }
  }

  private persist(products: ProductProps[]): void {
    localStorage.setItem(KEY, JSON.stringify(products));
  }

  findAll(): Product[] { return this.load().map(Product.fromProps); }

  findById(id: string): Product | undefined {
    const found = this.load().find(p => p.id === id);
    return found ? Product.fromProps(found) : undefined;
  }

  findByCategory(categoria: string): Product[] {
    return this.load()
      .filter(p => p.categoria.toLowerCase() === categoria.toLowerCase())
      .map(Product.fromProps);
  }

  save(product: Product): void {
    const products = this.load();
    products.push(product.toPlain());
    this.persist(products);
  }

  saveMany(products: Product[]): void {
    this.persist([...this.load(), ...products.map(p => p.toPlain())]);
  }

  update(product: Product): void {
    this.persist(this.load().map(p => p.id === product.id ? product.toPlain() : p));
  }
}
