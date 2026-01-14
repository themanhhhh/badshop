'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    birthday: '',
    gender: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle register
    alert('Đăng ký thành công!');
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

      {/* Register Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md border-0 shadow-none">
          <CardHeader className="text-center space-y-1 pb-8">
            <CardTitle className="text-2xl font-bold">Đăng ký</CardTitle>
            <CardDescription>
              Tạo tài khoản để trải nghiệm mua sắm tốt hơn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Họ và tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập họ tên tại đây"
                  className="h-12 bg-gray-50"
                />
              </div>

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
                  placeholder="Nhập số điện thoại tại đây"
                  className="h-12 bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Thông tin này cần bắt buộc"
                  className="h-12 bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthday">
                  Ngày sinh <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="birthday"
                  type="date"
                  required
                  value={formData.birthday}
                  onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                  className="h-12 bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label>Giới tính</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                >
                  <SelectTrigger className="h-12 bg-gray-50">
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Nam</SelectItem>
                    <SelectItem value="female">Nữ</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
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

              <Button type="submit" className="w-full h-12">
                Đăng ký
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Bạn đã có tài khoản?{' '}
                <Link 
                  href="/account" 
                  className="text-foreground font-medium hover:underline"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
