'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Check } from 'lucide-react';
import { type DisplayProduct, formatPrice } from '@/lib/productMapper';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: DisplayProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    
    await addToCart({
      productId: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image || '/products/placeholder.jpg',
      quantity: 1,
    });
    
    setIsAdding(false);
    setAdded(true);
    
    // Reset after 2 seconds
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group relative">
      {/* Badge */}
      {product.badge && (
        <div className={`absolute top-3 left-3 z-10 px-3 py-1 text-[10px] font-medium uppercase tracking-wider ${
          product.badge === 'hot' ? 'bg-black text-white' :
          product.badge === 'new' ? 'bg-white text-black border border-black' :
          'bg-red-600 text-white'
        }`}>
          {product.badge === 'hot' ? 'Best Seller' :
           product.badge === 'new' ? 'New' :
           `-${discount}%`}
        </div>
      )}

      {/* Add to Cart Button - appears on hover */}
      <Button
        size="icon"
        variant={added ? "default" : "secondary"}
        className={`absolute top-3 right-3 z-10 h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
          added ? 'bg-green-600 hover:bg-green-700' : ''
        }`}
        onClick={handleAddToCart}
        disabled={isAdding}
      >
        {added ? (
          <Check className="h-4 w-4" />
        ) : (
          <ShoppingCart className="h-4 w-4" />
        )}
      </Button>

      {/* Image */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="aspect-[3/4] bg-gray-50 overflow-hidden mb-4">
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50 group-hover:scale-105 transition-transform duration-500">
            {/* Placeholder icon */}
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-3xl font-light">
                {product.brand.charAt(0)}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="space-y-2">
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide line-clamp-1 group-hover:underline">
            {product.name}
          </h3>
        </Link>
        
        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
