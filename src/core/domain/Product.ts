export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  image: string;
  hoverImage?: string;
  images?: string[];
  stock: number;
  featured?: boolean;
  brand?: string;
  colors?: string[];
  materials?: string[];
  dimensions?: string;
  care?: string;
  authenticity?: string;
  badges?: string[];
  tags?: string[];
  status: 'active' | 'draft' | 'archived';
  createdAt?: number;
  updatedAt?: number;
}
