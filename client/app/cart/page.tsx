'use client';

import Link from 'next/link';
import { Minus, Plus, X, ArrowRight } from 'lucide-react';
import { Header } from '@/components/shop/Header';
import { Footer } from '@/components/shop/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { products, formatPrice } from '@/lib/mockData';

// Mock cart items
const cartItems = [
  { ...products[0], quantity: 1 },
  { ...products[3], quantity: 2 },
];

export default function CartPage() {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 500000 ? 0 : 30000;
  const total = subtotal + shipping;

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
              <span className="text-foreground">Giỏ hàng</span>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold uppercase tracking-wide text-center">
            Giỏ hàng
          </h1>
        </div>

        <div className="container mx-auto px-4 pb-16">
          {cartItems.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="border-b hidden md:grid grid-cols-12 gap-4 pb-4 text-xs uppercase tracking-widest text-muted-foreground">
                  <div className="col-span-6">Sản phẩm</div>
                  <div className="col-span-2 text-center">Giá</div>
                  <div className="col-span-2 text-center">Số lượng</div>
                  <div className="col-span-2 text-right">Tổng</div>
                </div>

                {cartItems.map((item) => (
                  <div key={item.id} className="border-b py-6">
                    <div className="grid md:grid-cols-12 gap-4 items-center">
                      {/* Product */}
                      <div className="md:col-span-6 flex gap-4">
                        <div className="w-24 h-24 bg-muted shrink-0 flex items-center justify-center rounded">
                          <span className="text-muted-foreground text-xl font-light">
                            {item.brand.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                            {item.brand}
                          </p>
                          <Link href={`/products/${item.id}`} className="text-sm font-medium hover:underline">
                            {item.name}
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-2 h-auto p-0 text-xs text-muted-foreground hover:text-foreground md:hidden"
                          >
                            <X className="h-3 w-3 mr-1" /> Xóa
                          </Button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="md:col-span-2 text-center">
                        <span className="text-sm">{formatPrice(item.price)}</span>
                      </div>

                      {/* Quantity */}
                      <div className="md:col-span-2 flex justify-center">
                        <div className="flex items-center border rounded">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-10 text-center text-sm">{item.quantity}</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-4">
                        <span className="text-sm font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="hidden md:flex h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium uppercase tracking-widest">
                      Tóm tắt đơn hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tạm tính</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phí vận chuyển</span>
                      <span>{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Tổng cộng</span>
                      <span>{formatPrice(total)}</span>
                    </div>

                    <Button asChild className="w-full h-12 mt-4">
                      <Link href="/checkout">
                        Thanh toán
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>

                    <Link 
                      href="/products" 
                      className="block text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Tiếp tục mua sắm
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-6">Giỏ hàng của bạn đang trống</p>
              <Button asChild className="h-12">
                <Link href="/products">
                  Mua sắm ngay
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
