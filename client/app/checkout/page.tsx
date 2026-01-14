'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, CreditCard, Truck, Wallet, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { products, formatPrice } from '@/lib/mockData';

// Mock cart items
const cartItems = [
  { ...products[0], quantity: 1 },
  { ...products[3], quantity: 2 },
];

const paymentMethods = [
  { id: 'cod', name: 'Thanh toán khi nhận hàng (COD)', icon: Truck },
  { id: 'bank', name: 'Chuyển khoản ngân hàng', icon: Building2 },
  { id: 'momo', name: 'Ví MoMo', icon: Wallet },
  { id: 'card', name: 'Thẻ tín dụng/Ghi nợ', icon: CreditCard },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    province: '',
    district: '',
    ward: '',
    address: '',
    note: '',
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 500000 ? 0 : 30000;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      router.push('/checkout/success');
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/cart" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="h-4 w-4" />
              Quay lại giỏ hàng
            </Link>
            <Link href="/" className="text-xl font-bold tracking-[0.2em] uppercase">
              BadmintonPro
            </Link>
            <div className="w-[120px]" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium uppercase tracking-widest">
                    Thông tin giao hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Họ và tên <span className="text-red-500">*</span></Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nhập họ tên"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại <span className="text-red-500">*</span></Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Nhập số điện thoại"
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Nhập email (tùy chọn)"
                      className="h-11"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Tỉnh/Thành phố <span className="text-red-500">*</span></Label>
                      <Select
                        value={formData.province}
                        onValueChange={(value) => setFormData({ ...formData, province: value })}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Chọn tỉnh/thành" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                          <SelectItem value="hn">Hà Nội</SelectItem>
                          <SelectItem value="dn">Đà Nẵng</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Quận/Huyện <span className="text-red-500">*</span></Label>
                      <Select
                        value={formData.district}
                        onValueChange={(value) => setFormData({ ...formData, district: value })}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Chọn quận/huyện" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="q1">Quận 1</SelectItem>
                          <SelectItem value="q3">Quận 3</SelectItem>
                          <SelectItem value="q7">Quận 7</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Phường/Xã <span className="text-red-500">*</span></Label>
                      <Select
                        value={formData.ward}
                        onValueChange={(value) => setFormData({ ...formData, ward: value })}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Chọn phường/xã" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="p1">Phường Bến Nghé</SelectItem>
                          <SelectItem value="p2">Phường Bến Thành</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ cụ thể <span className="text-red-500">*</span></Label>
                    <Input
                      id="address"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Số nhà, tên đường..."
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="note">Ghi chú</Label>
                    <Textarea
                      id="note"
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      placeholder="Ghi chú cho đơn hàng (tùy chọn)"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium uppercase tracking-widest">
                    Phương thức thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === method.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === method.id ? 'border-primary' : 'border-muted-foreground'
                      }`}>
                        {paymentMethod === method.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        )}
                      </div>
                      <method.icon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">{method.name}</span>
                    </label>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-base font-medium uppercase tracking-widest">
                    Đơn hàng của bạn
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center shrink-0">
                          <span className="text-muted-foreground text-sm font-light">
                            {item.brand.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">SL: {item.quantity}</p>
                        </div>
                        <div className="text-sm font-medium shrink-0">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tạm tính</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phí vận chuyển</span>
                      <span>{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-medium">
                    <span>Tổng cộng</span>
                    <span className="text-lg">{formatPrice(total)}</span>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 mt-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Bằng việc đặt hàng, bạn đồng ý với{' '}
                    <Link href="/policy" className="underline hover:text-foreground">
                      điều khoản
                    </Link>{' '}
                    của chúng tôi
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
