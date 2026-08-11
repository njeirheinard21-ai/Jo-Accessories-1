import { Product } from '../domain/Product';

export interface IProductRepository {
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | null>;
  createProduct(product: Omit<Product, 'id'>): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<void>;
  deleteProduct(id: string): Promise<void>;
  reserveStock(id: string, quantity: number): Promise<void>;
}
