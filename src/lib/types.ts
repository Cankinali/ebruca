export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  code: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  sizes: string[];
  colors: string[];
  description: string;
  measurements?: string;
  stock: 'in_stock' | 'low_stock' | 'out_of_stock';
  isFeatured?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  objectPosition?: string;
  subcategories?: Subcategory[];
  productCount?: number;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  product?: string;
}

export interface FilterOptions {
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
}

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'bestseller';
