export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  images?: string[];
  stock: number;
  featured?: boolean;
  brand?: string;
  status: 'active' | 'draft' | 'archived';
  createdAt?: number;
  updatedAt?: number;
}
