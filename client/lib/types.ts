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
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice?: number;
  sku?: string;
  stock: number;
  stock_quantity?: number;
  images: ProductImage[];
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
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
