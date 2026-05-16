import type { Product } from '../entities/Product';

export interface IProductRepository {
  findAll(): Product[];
  findById(id: string): Product | undefined;
  findByCategory(categoria: string): Product[];
  save(product: Product): void;
  saveMany(products: Product[]): void;
  update(product: Product): void;
}
