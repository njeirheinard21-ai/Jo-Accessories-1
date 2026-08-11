import { Order } from '../domain/Order';

export interface IOrderRepository {
  getOrders(): Promise<Order[]>;
  getUserOrders(userId: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | null>;
  createOrder(order: Omit<Order, 'id'>): Promise<Order>;
  updateOrderStatus(id: string, status: Order['status']): Promise<void>;
}
