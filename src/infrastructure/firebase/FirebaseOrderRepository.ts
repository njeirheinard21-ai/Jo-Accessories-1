import { collection, doc, getDoc, getDocs, query, where, orderBy, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Order } from '../../core/domain/Order';
import { IOrderRepository } from '../../core/repositories/IOrderRepository';

const COLLECTION_NAME = 'orders';

export class FirebaseOrderRepository implements IOrderRepository {
  async getOrders(): Promise<Order[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
  }

  async getOrder(id: string): Promise<Order | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Order;
    }
    return null;
  }

  async createOrder(order: Omit<Order, 'id'>): Promise<Order> {
    const docRef = doc(collection(db, COLLECTION_NAME));
    const newOrder = {
      ...order,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await setDoc(docRef, newOrder);
    return { id: docRef.id, ...newOrder } as Order;
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      status,
      updatedAt: Date.now()
    });
  }
}
