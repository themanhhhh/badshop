// API Types - matching server entities
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'admin' | 'customer';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  // snake_case from API
  image_url?: string;
  is_primary?: boolean;
  product_id?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice?: number;
  original_price?: number; // snake_case from API
  sku?: string;
  stock: number;
  stock_quantity?: number;
  images: ProductImage[];
  product_images?: ProductImage[]; // snake_case from API
  categoryId?: string;
  category_id?: string;
  category?: Category;
  brandId?: string;
  brand_id?: string;
  brand?: Brand;
  badge?: string;
  rating?: number;
  isActive: boolean;
  is_active?: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: User;
  items: OrderItem[];
  addressId?: string;
  address?: Address;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'banking' | 'momo' | 'vnpay';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  user?: User;
  productId: string;
  product?: Product;
  rating: number;
  title?: string;
  content?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  title?: string;
  description?: string;
  code: string;
  type: 'collection' | 'flash_sale' | 'promotion' | 'seasonal';
  status: 'draft' | 'active' | 'scheduled' | 'paused' | 'ended';
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  start_date: string;
  end_date: string;
  image_url?: string;
  display_order: number;
  show_on_homepage: boolean;
  isActive?: boolean; // Keep for backward compatibility if used, but server seems not to return it explicitly unless calculated
  created_at: string;
  updated_at: string;
}

export interface FlashSaleProduct {
  id: string;
  productId: string;
  product?: Product;
  discountPrice: number;
  quantity: number;
  soldCount: number;
}

export interface FlashSale {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  products: FlashSaleProduct[];
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
