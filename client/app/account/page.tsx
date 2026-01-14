'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login
    alert('Đăng nhập thành công!');
  };

  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Logo Header */}
      <div className="py-6 border-b border-gray-100">
        <Link href="/" className="block text-center">
          <h1 className="text-xl font-bold tracking-[0.3em] uppercase">
            BadmintonPro
          </h1>
        </Link>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md border-0 shadow-none">
          <CardHeader className="text-center space-y-1 pb-8">
            <CardTitle className="text-2xl font-bold">Đăng nhập</CardTitle>
            <CardDescription>
              Đăng nhập để mua sắm và theo dõi đơn hàng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Số điện thoại <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Số điện thoại"
                  className="h-12 bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Mật khẩu <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mật khẩu"
                  className="h-12 bg-gray-50"
                />
              </div>

              <div className="text-left">
                <Link 
                  href="/account/forgot-password" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Quên thông tin tài khoản
                </Link>
              </div>

              <Button type="submit" className="w-full h-12">
                Đăng nhập
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Bạn chưa có tài khoản?{' '}
                <Link 
                  href="/account/register" 
                  className="text-foreground font-medium hover:underline"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
