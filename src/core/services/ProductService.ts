import { IProductRepository } from '../repositories/IProductRepository';
import { Product } from '../domain/Product';

export class ProductService {
  constructor(private repository: IProductRepository) {}

  async getAllProducts(): Promise<Product[]> {
    return this.repository.getProducts();
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.repository.getProduct(id);
  }

  async createNewProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    // We could add business logic here like validation, audit logging
    return this.repository.createProduct(productData);
  }

  async updateProductDetails(id: string, updates: Partial<Product>): Promise<void> {
    return this.repository.updateProduct(id, updates);
  }

  async removeProduct(id: string): Promise<void> {
    return this.repository.deleteProduct(id);
  }

  async processStockReservation(id: string, quantity: number): Promise<void> {
    return this.repository.reserveStock(id, quantity);
  }
}
