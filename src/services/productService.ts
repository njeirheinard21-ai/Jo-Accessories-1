import { 
  collection, doc, getDoc, getDocs, query, where, orderBy, 
  setDoc, updateDoc, deleteDoc, runTransaction, 
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

export interface ProductFilters {
  category?: string;
  brand?: string[];
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: string; // 'Recommended', 'Newest', 'Price: High to Low', 'Price: Low to High'
  search?: string;
}

export const productService = {
  getProducts: async (pageSize = 20, pageIndex = 0, filters?: ProductFilters): Promise<{ products: Product[], hasNextPage: boolean, total: number }> => {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('status', '==', 'active')
      );
      const snapshot = await getDocs(q);
      
      let allProducts = snapshot.empty ? (mockProducts as Product[]) : snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

      // Apply Filters
      if (filters) {
        if (filters.category) {
          allProducts = allProducts.filter(p => p.category?.toLowerCase() === filters.category?.toLowerCase());
        }
        if (filters.brand && filters.brand.length > 0) {
          allProducts = allProducts.filter(p => p.brand && filters.brand!.includes(p.brand));
        }
        if (filters.colors && filters.colors.length > 0) {
          allProducts = allProducts.filter(p => p.colors?.some(c => filters.colors!.includes(c)));
        }
        if (filters.minPrice !== undefined) {
          allProducts = allProducts.filter(p => p.price >= filters.minPrice!);
        }
        if (filters.maxPrice !== undefined) {
          allProducts = allProducts.filter(p => p.price <= filters.maxPrice!);
        }
        if (filters.search) {
          const s = filters.search.toLowerCase();
          allProducts = allProducts.filter(p => 
            p.name.toLowerCase().includes(s) || 
            (p.brand && p.brand.toLowerCase().includes(s)) ||
            (p.category && p.category.toLowerCase().includes(s))
          );
        }
        
        // Apply Sort
        if (filters.sort) {
          switch (filters.sort) {
            case 'Newest':
              allProducts.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
              break;
            case 'Price: Low to High':
              allProducts.sort((a, b) => a.price - b.price);
              break;
            case 'Price: High to Low':
              allProducts.sort((a, b) => b.price - a.price);
              break;
            default: // Recommended / null
              // No strict sort, could sort by featured
              allProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
              break;
          }
        }
      }

      const total = allProducts.length;
      const start = pageIndex * pageSize;
      const paginatedProducts = allProducts.slice(start, start + pageSize);

      return {
        products: paginatedProducts,
        hasNextPage: start + pageSize < total,
        total
      };
    } catch (error: any) {
      console.warn("Warning fetching products:", error?.message || error);
      return { products: mockProducts.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize) as Product[], hasNextPage: false, total: mockProducts.length };
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
