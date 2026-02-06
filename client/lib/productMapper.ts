import { Product as ApiProduct } from './types';

// Display product interface matching what components expect
export interface DisplayProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  badge?: 'hot' | 'new' | 'sale';
  inStock: boolean;
}

// Map API badge to display badge
function mapBadge(badge?: string): 'hot' | 'new' | 'sale' | undefined {
  if (!badge || badge === 'none') return undefined;
  if (badge === 'bestseller') return 'hot';
  if (badge === 'new') return 'new';
  if (badge === 'sale') return 'sale';
  return undefined;
}

// Transform API Product to display format for components
export function mapProductForDisplay(product: ApiProduct): DisplayProduct {
  // Handle both camelCase and snake_case from API
  const stock = product.stock ?? product.stock_quantity ?? 0;
  // Support both originalPrice (camelCase) and original_price (snake_case)
  const origPrice = product.originalPrice ?? product.original_price;
  
  // Get image from product_images (snake_case from API) or images (camelCase)
  const images = product.product_images || product.images || [];
  let imageUrl = '/products/placeholder.jpg';
  
  if (images.length > 0) {
    // Find primary image first, otherwise use first image
    const primaryImage = images.find(img => img.is_primary || img.isPrimary);
    const firstImage = primaryImage || images[0];
    imageUrl = firstImage.image_url || firstImage.url || imageUrl;
  }
  
  return {
    id: product.id,
    name: product.name,
    brand: product.brand?.name || '',
    price: Number(product.price),
    originalPrice: origPrice ? Number(origPrice) : undefined,
    image: imageUrl,
    category: product.category?.slug || 'racket',
    rating: Number(product.rating) || 4.5,
    reviews: 0,
    badge: mapBadge(product.badge),
    inStock: stock > 0,
  };
}

// Map array of products
export function mapProductsForDisplay(products: ApiProduct[]): DisplayProduct[] {
  // Defensive check: return empty array if products is not an array
  if (!Array.isArray(products)) {
    console.warn('mapProductsForDisplay: Expected array but received:', typeof products);
    return [];
  }
  return products.map(mapProductForDisplay);
}

// Format price in VND
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
}
