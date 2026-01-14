'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, Heart, Truck, Shield, RotateCcw } from 'lucide-react';
import { Header } from '@/components/shop/Header';
import { Footer } from '@/components/shop/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { products, formatPrice } from '@/lib/mockData';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1);
  const product = products.find(p => p.id === params.id) || products[0];
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="border-b border-gray-100">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">Trang chủ</Link>
              <span>/</span>
              <Link href="/products" className="hover:text-foreground transition-colors">Sản phẩm</Link>
              <span>/</span>
              <span className="text-foreground">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Detail */}
        <div className="container mx-auto px-4 py-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center relative">
                {product.badge && (
                  <Badge 
                    variant={product.badge === 'sale' ? 'destructive' : 'default'}
                    className="absolute top-4 left-4"
                  >
                    {product.badge === 'hot' ? 'Best Seller' :
                     product.badge === 'new' ? 'New' :
                     `-${discount}%`}
                  </Badge>
                )}
                <div className="w-32 h-32 bg-muted-foreground/10 rounded-full flex items-center justify-center">
                  <span className="text-muted-foreground text-5xl font-light">
                    {product.brand.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-muted rounded cursor-pointer hover:opacity-80 transition-opacity" />
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  {product.brand}
                </p>
                <h1 className="text-2xl lg:text-3xl font-bold uppercase tracking-wide mb-4">
                  {product.name}
                </h1>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sản phẩm chính hãng {product.brand} với chất lượng cao cấp. 
                Thiết kế hiện đại, phù hợp cho mọi cấp độ chơi từ nghiệp dư đến chuyên nghiệp.
              </p>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-xs uppercase tracking-widest font-medium">Số lượng</span>
                <div className="flex items-center border rounded">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button className="flex-1 h-12">
                  Thêm vào giỏ
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              <Separator />

              {/* Features */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <Truck className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Miễn phí giao hàng</p>
                </div>
                <div className="text-center">
                  <Shield className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Bảo hành 12 tháng</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Đổi trả 30 ngày</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="border-t">
          <div className="container mx-auto px-4 py-12">
            <h2 className="text-lg font-bold uppercase tracking-wide mb-6">Mô tả sản phẩm</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p>
                {product.name} là sản phẩm cao cấp đến từ thương hiệu {product.brand}. 
                Được thiết kế với công nghệ tiên tiến, sản phẩm mang đến trải nghiệm tuyệt vời cho người chơi cầu lông.
              </p>
              <p className="mt-4">
                Đặc điểm nổi bật:
              </p>
              <ul className="mt-2 space-y-1">
                <li>Chất liệu cao cấp, độ bền cao</li>
                <li>Thiết kế công thái học, cầm nắm thoải mái</li>
                <li>Phù hợp cho mọi cấp độ chơi</li>
                <li>Bảo hành chính hãng 12 tháng</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t">
            <div className="container mx-auto px-4 py-12">
              <h2 className="text-lg font-bold uppercase tracking-wide mb-8 text-center">
                Sản phẩm liên quan
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
