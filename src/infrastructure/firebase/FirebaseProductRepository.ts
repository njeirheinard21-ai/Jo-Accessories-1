import { 
  collection, doc, getDoc, getDocs, query, where, orderBy, 
  limit, startAfter, setDoc, updateDoc, deleteDoc, runTransaction, 
  QueryDocumentSnapshot, writeBatch
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Product } from '../../core/domain/Product';
import { IProductRepository } from '../../core/repositories/IProductRepository';
import { mockProducts } from '../../data/mockProducts';

const COLLECTION_NAME = 'products';

export class FirebaseProductRepository implements IProductRepository {
  async getProducts(): Promise<Product[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return mockProducts as any as Product[];
      }
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (error) {
      console.warn("Warning fetching products:", error);
      return mockProducts as any as Product[];
    }
  }

  async getProduct(id: string): Promise<Product | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
      }
      return mockProducts.find(p => p.id === id) as any as Product || null;
    } catch (error) {
      console.warn("Warning fetching product:", error);
      return mockProducts.find(p => p.id === id) as any as Product || null;
    }
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const docRef = doc(collection(db, COLLECTION_NAME));
    const newProduct = {
      ...product,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: product.status || 'active'
    };
    await setDoc(docRef, newProduct);
    return { id: docRef.id, ...newProduct } as Product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Date.now()
    });
  }

  async deleteProduct(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  }

  async reserveStock(id: string, quantity: number): Promise<void> {
    const productRef = doc(db, COLLECTION_NAME, id);
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
  }
}
