import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, writeBatch, serverTimestamp, runTransaction } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from './productService';

export interface Order {
  id: string;
  userId: string;
  items: any[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'pending_whatsapp_confirmation';
  customerInfo?: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  createdAt: any;
  updatedAt: any;
}

const COLLECTION_NAME = 'orders';

export const orderService = {
  createDraftOrder: async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    try {
      const orderRef = doc(collection(db, COLLECTION_NAME));
      
      await setDoc(orderRef, {
        ...orderData,
        id: orderRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return {
        ...orderData,
        id: orderRef.id,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
    } catch (error) {
      console.error("Failed to save draft order: ", error);
      throw error;
    }
  },

  createOrder: async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    // Implement transaction to securely update inventory and create order
    try {
      const orderRef = doc(collection(db, COLLECTION_NAME));
      
      await runTransaction(db, async (transaction) => {
        // First read all products to ensure they have enough stock
        const productReads = orderData.items.map(async (item) => {
          const productRef = doc(db, 'products', item.productId);
          const productDoc = await transaction.get(productRef);
          if (!productDoc.exists()) {
            throw new Error(`Product ${item.productId} does not exist!`);
          }
          const productData = productDoc.data() as Product;
          if ((productData.stock || 0) < item.quantity) {
            throw new Error(`Insufficient stock for product ${productData.name}`);
          }
          return { ref: productRef, newStock: (productData.stock || 0) - item.quantity };
        });
        
        const updates = await Promise.all(productReads);
        
        // Then apply all writes
        updates.forEach(({ ref, newStock }) => {
          transaction.update(ref, { stock: newStock, updatedAt: serverTimestamp() });
        });
        
        transaction.set(orderRef, {
          ...orderData,
          id: orderRef.id,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });
      
      return {
        ...orderData,
        id: orderRef.id,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
    } catch (error) {
      console.error("Transaction failed: ", error);
      throw error;
    }
  },

  getUserOrders: async (userId: string): Promise<Order[]> => {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
  },
  
  // Admin functions
  getAllOrders: async (): Promise<Order[]> => {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
  },
  
  updateOrderStatus: async (orderId: string, status: Order['status']): Promise<void> => {
    const orderRef = doc(db, COLLECTION_NAME, orderId);
    await setDoc(orderRef, { 
      status, 
      updatedAt: serverTimestamp() 
    }, { merge: true });
  }
};
