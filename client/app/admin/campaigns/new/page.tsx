'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Zap, 
  Ticket, 
  Image, 
  Calendar, 
  Package,
  Save,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categories } from '@/lib/mockData';

const campaignTypes = [
  { id: 'flash_sale', name: 'Flash Sale', icon: Zap, description: 'Giảm giá trong thời gian ngắn' },
  { id: 'voucher', name: 'Voucher', icon: Ticket, description: 'Mã giảm giá cho khách hàng' },
  { id: 'banner', name: 'Banner Ads', icon: Image, description: 'Quảng cáo banner trên website' },
  { id: 'seasonal', name: 'Theo mùa', icon: Calendar, description: 'Chiến dịch theo mùa/dịp lễ' },
  { id: 'combo', name: 'Combo', icon: Package, description: 'Ưu đãi mua kèm sản phẩm' },
];

export default function NewCampaignPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    startDate: '',
    endDate: '',
    budget: '',
    discount: '',
    minOrderValue: '',
    maxDiscount: '',
    usageLimit: '',
    targetCategories: [] as string[],
    status: 'draft',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      router.push('/admin/campaigns');
    }, 1500);
  };

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    setFormData({ ...formData, type: typeId });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/campaigns" 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Tạo chiến dịch mới</h1>
          <p className="text-muted-foreground">Thiết lập một chiến dịch marketing mới</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Campaign Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Loại chiến dịch</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {campaignTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleTypeSelect(type.id)}
                      className={`p-4 rounded-xl border-2 text-center transition-all hover:border-blue-300 ${
                        selectedType === type.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-border'
                      }`}
                    >
                      <type.icon className={`h-6 w-6 mx-auto mb-2 ${
                        selectedType === type.id ? 'text-blue-600' : 'text-muted-foreground'
                      }`} />
                      <p className={`text-sm font-medium ${
                        selectedType === type.id ? 'text-blue-600' : ''
                      }`}>{type.name}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên chiến dịch *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: Flash Sale Tết 2026"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả chi tiết về chiến dịch..."
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Ngày bắt đầu *</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Ngày kết thúc *</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="h-11"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Discount Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cài đặt giảm giá</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discount">Phần trăm giảm giá (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      placeholder="VD: 30"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxDiscount">Giảm tối đa (VNĐ)</Label>
                    <Input
                      id="maxDiscount"
                      type="number"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                      placeholder="VD: 500000"
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minOrderValue">Giá trị đơn tối thiểu (VNĐ)</Label>
                    <Input
                      id="minOrderValue"
                      type="number"
                      value={formData.minOrderValue}
                      onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                      placeholder="VD: 500000"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="usageLimit">Giới hạn sử dụng</Label>
                    <Input
                      id="usageLimit"
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                      placeholder="VD: 500"
                      className="h-11"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Target Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Danh mục áp dụng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'racket', name: 'Vợt cầu lông' },
                    { id: 'shoes', name: 'Giày' },
                    { id: 'shuttlecock', name: 'Cầu' },
                    { id: 'accessories', name: 'Phụ kiện' },
                    { id: 'bag', name: 'Túi/Balo' },
                    { id: 'apparel', name: 'Quần áo' },
                  ].map((cat) => (
                    <label
                      key={cat.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.targetCategories.includes(cat.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-border hover:border-blue-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.targetCategories.includes(cat.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              targetCategories: [...formData.targetCategories, cat.id],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              targetCategories: formData.targetCategories.filter((c) => c !== cat.id),
                            });
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">{cat.name}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Để trống để áp dụng cho tất cả danh mục
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Budget */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ngân sách</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Tổng ngân sách (VNĐ) *</Label>
                  <Input
                    id="budget"
                    type="number"
                    required
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="VD: 50000000"
                    className="h-11"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Chiến dịch sẽ tự động dừng khi hết ngân sách
                </p>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Trạng thái</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Lưu nháp</SelectItem>
                    <SelectItem value="scheduled">Lên lịch chạy</SelectItem>
                    <SelectItem value="active">Chạy ngay</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={isSubmitting || !selectedType}
                >
                  {isSubmitting ? (
                    'Đang tạo...'
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Tạo chiến dịch
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11"
                  disabled={isSubmitting}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Xem trước
                </Button>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h4 className="font-medium text-blue-800 mb-2">💡 Mẹo hay</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Đặt tên chiến dịch dễ nhớ, rõ ràng</li>
                  <li>• Flash Sale hiệu quả nhất trong 24-48h</li>
                  <li>• Giới hạn sử dụng tạo cảm giác khan hiếm</li>
                  <li>• Theo dõi hiệu suất để tối ưu hóa</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
