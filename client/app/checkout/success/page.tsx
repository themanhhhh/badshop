'use client';

import Link from 'next/link';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/mockData';

// Mock order data
const orderData = {
  orderId: 'ORD-2026011401',
  date: '14/01/2026',
  total: 7400000,
  shipping: {
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
  },
  payment: 'Thanh toán khi nhận hàng (COD)',
  items: [
    { name: 'Yonex Astrox 99 Pro', quantity: 1, price: 4500000 },
    { name: 'Yonex Power Cushion 65Z3', quantity: 2, price: 2900000 },
  ],
};

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-center">
            <Link href="/" className="text-xl font-bold tracking-[0.2em] uppercase">
              BadmintonPro
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Đặt hàng thành công!</h1>
          <p className="text-muted-foreground">
            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
          </p>
        </div>

        {/* Order Info */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  Mã đơn hàng
                </p>
                <p className="font-medium">{orderData.orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  Ngày đặt
                </p>
                <p className="font-medium">{orderData.date}</p>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Items */}
            <div className="space-y-3">
              {orderData.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.name} <span className="text-muted-foreground">x{item.quantity}</span>
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-medium">
              <span>Tổng cộng</span>
              <span>{formatPrice(orderData.total)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Info */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium uppercase tracking-widest mb-4">
              Thông tin giao hàng
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Người nhận:</span> {orderData.shipping.name}</p>
              <p><span className="text-muted-foreground">Điện thoại:</span> {orderData.shipping.phone}</p>
              <p><span className="text-muted-foreground">Địa chỉ:</span> {orderData.shipping.address}</p>
              <p><span className="text-muted-foreground">Thanh toán:</span> {orderData.payment}</p>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Info */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Đơn hàng đang được xử lý</p>
                <p className="text-sm text-muted-foreground">
                  Chúng tôi sẽ thông báo khi đơn hàng được giao cho đơn vị vận chuyển
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild variant="outline" className="flex-1 h-12">
            <Link href="/account/orders">
              Xem đơn hàng của tôi
            </Link>
          </Button>
          <Button asChild className="flex-1 h-12">
            <Link href="/products">
              Tiếp tục mua sắm
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
