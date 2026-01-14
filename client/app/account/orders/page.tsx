'use client';

import Link from 'next/link';
import { Package, ChevronRight } from 'lucide-react';
import { Header } from '@/components/shop/Header';
import { Footer } from '@/components/shop/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/mockData';

// Mock orders data
const orders = [
  {
    id: 'ORD-2026011401',
    date: '14/01/2026',
    status: 'processing',
    statusText: 'Đang xử lý',
    total: 7400000,
    items: [
      { name: 'Yonex Astrox 99 Pro', quantity: 1 },
      { name: 'Yonex Power Cushion 65Z3', quantity: 2 },
    ],
  },
  {
    id: 'ORD-2026011201',
    date: '12/01/2026',
    status: 'shipped',
    statusText: 'Đang giao',
    total: 3800000,
    items: [
      { name: 'Victor Thruster K 9900', quantity: 1 },
    ],
  },
  {
    id: 'ORD-2026011001',
    date: '10/01/2026',
    status: 'delivered',
    statusText: 'Đã giao',
    total: 2400000,
    items: [
      { name: 'Victor A970ACE', quantity: 1 },
    ],
  },
];

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  processing: 'secondary',
  shipped: 'default',
  delivered: 'outline',
  cancelled: 'destructive',
};

export default function OrdersPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">Trang chủ</Link>
              <span>/</span>
              <Link href="/account" className="hover:text-foreground transition-colors">Tài khoản</Link>
              <span>/</span>
              <span className="text-foreground">Đơn hàng</span>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold uppercase tracking-wide text-center">
            Đơn hàng của tôi
          </h1>
        </div>

        <div className="container mx-auto px-4 pb-16 max-w-3xl">
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                      </div>
                      <Badge variant={statusColors[order.status]}>
                        {order.statusText}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          {order.items.map((item, i) => (
                            <span key={i}>
                              {item.name} x{item.quantity}
                              {i < order.items.length - 1 && ', '}
                            </span>
                          ))}
                        </p>
                        <p className="text-sm font-medium mt-1">
                          Tổng: {formatPrice(order.total)}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/account/orders/${order.id}`}>
                          Xem chi tiết
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-6">Bạn chưa có đơn hàng nào</p>
              <Button asChild>
                <Link href="/products">
                  Mua sắm ngay
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
