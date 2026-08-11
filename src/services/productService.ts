import { 
  collection, doc, getDoc, getDocs, query, where, orderBy, 
  limit, startAfter, setDoc, updateDoc, deleteDoc, runTransaction, 
  QueryDocumentSnapshot, writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { mockProducts } from '../data/mockProducts';
import { auditService } from './auditService';
import { Product as CoreProduct } from '../core/domain/Product';

export interface Product extends CoreProduct {
  isNew?: boolean;
  large?: boolean;
  sku?: string;
}

const COLLECTION_NAME = 'products';

export const productService = {
  getProducts: async (pageSize = 20, lastDoc?: QueryDocumentSnapshot): Promise<{ products: Product[], lastDoc: QueryDocumentSnapshot | null }> => {
    try {
      let q = query(
        collection(db, COLLECTION_NAME),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);
      
      // Fallback to mock data if Firestore is empty (for preview purposes)
      if (snapshot.empty && !lastDoc) {
        return {
          products: mockProducts as Product[],
          lastDoc: null
        };
      }

      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      return {
        products,
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null
      };
    } catch (error: any) {
      console.warn("Warning fetching products:", error?.message || error);
      // Fallback to mock data on error (e.g., missing index)
      return { products: mockProducts as Product[], lastDoc: null };
    }
  },
  
  getProductById: async (id: string): Promise<Product | undefined> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
      }
      return mockProducts.find(p => p.id === id) as Product;
    } catch (error: any) {
      console.warn("Warning fetching product:", error?.message || error);
      return mockProducts.find(p => p.id === id) as Product;
    }
  },

  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const docRef = doc(collection(db, COLLECTION_NAME));
    const newProduct = {
      ...product,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: product.status || 'active'
    };
    await setDoc(docRef, newProduct);
    await auditService.log('product', 'create_product', `Created product ${product.name}`);
    return { id: docRef.id, ...newProduct } as Product;
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Date.now()
    });
    if (updates.stock !== undefined) {
      await auditService.log('product', 'update_inventory', `Updated inventory for product ${id}`);
    }
  },

  deleteProduct: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    await auditService.log('product', 'delete_product', `Deleted product ${id}`);
  },

  reserveStock: async (productId: string, quantity: number): Promise<void> => {
    const productRef = doc(db, COLLECTION_NAME, productId);
    await runTransaction(db, async (transaction) => {
      const productDoc = await transaction.get(productRef);
      if (!productDoc.exists()) {
        throw new Error("Product does not exist!");
      }
      const currentStock = productDoc.data().stock || 0;
      if (currentStock < quantity) {
        throw new Error("Insufficient stock!");
      }
      transaction.update(productRef, { stock: currentStock - quantity });
    });
    await auditService.log('product', 'update_inventory', `Reserved ${quantity} stock for product ${productId}`);
  },

  // Admin util to seed database
  seedDatabase: async (): Promise<void> => {
    const batch = writeBatch(db);
    for (const p of mockProducts) {
      const docRef = doc(collection(db, COLLECTION_NAME));
      batch.set(docRef, {
        ...p,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'active',
        stock: 100
      });
    }
    await batch.commit();
  }
}
