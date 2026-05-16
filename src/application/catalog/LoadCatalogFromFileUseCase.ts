import type { IProductRepository } from '../../domain/ports/IProductRepository';
import { Product } from '../../domain/entities/Product';

export class LoadCatalogFromFileUseCase {
  constructor(private productRepo: IProductRepository) {}

  async execute(file: File): Promise<Product[]> {
    const text = await file.text();
    const rows = text.trim().split('\n');

    // Soporta CSV con cabecera: nombre,precio,categoria,stock
    const [header, ...dataRows] = rows;
    const keys = header.split(',').map((k: string) => k.trim().toLowerCase());

    if (!['nombre', 'precio', 'categoria', 'stock'].every((k: string) => keys.includes(k))) {
      throw new Error('El CSV debe tener columnas: nombre, precio, categoria, stock');
    }

    const products = dataRows
      .filter(row => row.trim())
      .map(row => {
        const values = row.split(',').map(v => v.trim());
        const record: Record<string, string> = {};
        keys.forEach((k, i) => (record[k] = values[i]));

        return Product.create({
          nombre: record.nombre,
          precio: parseFloat(record.precio),
          categoria: record.categoria,
          stock: parseInt(record.stock, 10),
        });
      });

    this.productRepo.saveMany(products);
    return products;
  }
}
