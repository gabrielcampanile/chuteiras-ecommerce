export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  brand: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  isNew: boolean;
  isOnSale: boolean;
  discountPercentage?: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // ID do lojista
  status: 'active' | 'inactive' | 'draft';
  specifications: {
    material?: string;
    sole?: string;
    weight?: string;
    closure?: string;
    [key: string]: any;
  };
  shipping: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
  };
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  helpful: number;
  images?: string[];
}

export interface ProductFilter {
  category?: string | string[];
  brand?: string | string[];
  search?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  rating?: number;
}

export interface ProductSort {
  field: 'price' | 'name' | 'rating' | 'createdAt' | 'popularity';
  direction: 'asc' | 'desc';
} 