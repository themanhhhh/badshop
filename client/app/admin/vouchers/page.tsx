'use client';

import { useMemo, useState } from 'react';
import { Check, Edit, Loader2, Plus, Power, PowerOff, Search, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AdminLoading } from '@/components/admin/AdminLoading';
import { useBrands, useCategories, useProducts, useVouchers } from '@/hooks/useApi';
import { voucherApi } from '@/lib/api';
import { formatPrice } from '@/lib/productMapper';
import type { Brand, Category, Product, Voucher } from '@/lib/types';

type VoucherForm = {
  name: string;
  code: string;
  description: string;
  status: Voucher['status'];
  discount_value: number;
  max_discount_amount: number | '';
  minimum_spend: number;
  total_usage_limit: number | '';
  per_user_usage_limit: number | '';
  start_date: string;
  end_date: string;
  scope_type: Voucher['scope_type'];
  is_stackable: boolean;
  is_public: boolean;
  productIds: string[];
  categoryIds: string[];
  brandIds: string[];
};

const statusLabels: Record<Voucher['status'], string> = {
  draft: 'Nháp',
  active: 'Đang chạy',
  inactive: 'Tạm dừng',
  expired: 'Hết hạn',
};

const scopeTypeLabels: Record<Voucher['scope_type'], string> = {
  all: 'Toàn shop',
  product: 'Theo sản phẩm',
  category: 'Theo danh mục',
  brand: 'Theo thương hiệu',
};

function createDefaultForm(): VoucherForm {
  const now = new Date();
  const end = new Date(now);
  end.setDate(end.getDate() + 30);

  return {
    name: '',
    code: '',
    description: '',
    status: 'draft',
    discount_value: 10,
    max_discount_amount: '',
    minimum_spend: 0,
    total_usage_limit: '',
    per_user_usage_limit: 1,
    start_date: toDateTimeInput(now),
    end_date: toDateTimeInput(end),
    scope_type: 'all',
    is_stackable: true,
    is_public: true,
    productIds: [],
    categoryIds: [],
    brandIds: [],
  };
}

function toDateTimeInput(date: Date | string): string {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return '';
  value.setMinutes(value.getMinutes() - value.getTimezoneOffset());
  return value.toISOString().slice(0, 16);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Thao tác thất bại';
}

function getDiscountDisplay(voucher: Voucher): string {
  const maxDiscount = voucher.max_discount_amount ? `, tối đa ${formatPrice(Number(voucher.max_discount_amount))}` : '';
  return `${Number(voucher.discount_value)}%${maxDiscount}`;
}

function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
}

export default function AdminVouchersPage() {
  const { data: vouchers, loading: vouchersLoading, refetch } = useVouchers();
  const { data: products, loading: productsLoading } = useProducts();
  const { data: categories, loading: categoriesLoading } = useCategories();
  const { data: brands, loading: brandsLoading } = useBrands();

  const [form, setForm] = useState<VoucherForm>(() => createDefaultForm());
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const loading = vouchersLoading || productsLoading || categoriesLoading || brandsLoading;
  const displayVouchers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return vouchers || [];
    return (vouchers || []).filter((voucher) =>
      voucher.name.toLowerCase().includes(query) || voucher.code.toLowerCase().includes(query)
    );
  }, [vouchers, searchQuery]);

  const resetForm = () => {
    setForm(createDefaultForm());
    setEditingVoucher(null);
  };

  const startEdit = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setForm({
      name: voucher.name,
      code: voucher.code,
      description: voucher.description || '',
      status: voucher.status,
      discount_value: Number(voucher.discount_value || 0),
      max_discount_amount: voucher.max_discount_amount ? Number(voucher.max_discount_amount) : '',
      minimum_spend: Number(voucher.minimum_spend || 0),
      total_usage_limit: voucher.total_usage_limit ? Number(voucher.total_usage_limit) : '',
      per_user_usage_limit: voucher.per_user_usage_limit ? Number(voucher.per_user_usage_limit) : '',
      start_date: toDateTimeInput(voucher.start_date),
      end_date: toDateTimeInput(voucher.end_date),
      scope_type: voucher.scope_type,
      is_stackable: voucher.is_stackable,
      is_public: voucher.is_public,
      productIds: voucher.products?.map((product) => product.id) || [],
      categoryIds: voucher.categories?.map((category) => category.id) || [],
      brandIds: voucher.brands?.map((brand) => brand.id) || [],
    });
  };

  const buildPayload = () => ({
    name: form.name.trim(),
    code: form.code.trim(),
    description: form.description.trim(),
    status: form.status,
    discount_type: 'percentage' as const,
    discount_value: Number(form.discount_value || 0),
    max_discount_amount: form.max_discount_amount === '' ? null : Number(form.max_discount_amount),
    minimum_spend: Number(form.minimum_spend || 0),
    total_usage_limit: form.total_usage_limit === '' ? null : Number(form.total_usage_limit),
    per_user_usage_limit: form.per_user_usage_limit === '' ? null : Number(form.per_user_usage_limit),
    start_date: new Date(form.start_date).toISOString(),
    end_date: new Date(form.end_date).toISOString(),
    scope_type: form.scope_type,
    is_stackable: form.is_stackable,
    is_public: form.is_public,
    productIds: form.scope_type === 'product' ? form.productIds : [],
    categoryIds: form.scope_type === 'category' ? form.categoryIds : [],
    brandIds: form.scope_type === 'brand' ? form.brandIds : [],
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editingVoucher) {
        await voucherApi.update(editingVoucher.id, buildPayload());
        toast.success('Đã cập nhật voucher');
      } else {
        await voucherApi.create(buildPayload());
        toast.success('Đã tạo voucher');
      }
      resetForm();
      refetch();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const runVoucherAction = async (voucher: Voucher, action: 'activate' | 'deactivate' | 'delete') => {
    setActionId(voucher.id);
    try {
      if (action === 'activate') {
        await voucherApi.activate(voucher.id);
        toast.success('Đã kích hoạt voucher');
      } else if (action === 'deactivate') {
        await voucherApi.deactivate(voucher.id);
        toast.success('Đã vô hiệu hóa voucher');
      } else {
        await voucherApi.delete(voucher.id);
        toast.success('Đã xóa voucher');
      }
      refetch();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setActionId(null);
    }
  };

  const renderScopeSelector = () => {
    if (form.scope_type === 'all') {
      return <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">Voucher áp dụng cho toàn bộ sản phẩm trong shop.</p>;
    }

    if (form.scope_type === 'product') {
      return <ScopeList items={products || []} selectedIds={form.productIds} onToggle={(id) => setForm((prev) => ({ ...prev, productIds: toggleId(prev.productIds, id) }))} getLabel={(item) => item.name} />;
    }
    if (form.scope_type === 'category') {
      return <ScopeList items={categories || []} selectedIds={form.categoryIds} onToggle={(id) => setForm((prev) => ({ ...prev, categoryIds: toggleId(prev.categoryIds, id) }))} getLabel={(item) => item.name} />;
    }
    return <ScopeList items={brands || []} selectedIds={form.brandIds} onToggle={(id) => setForm((prev) => ({ ...prev, brandIds: toggleId(prev.brandIds, id) }))} getLabel={(item) => item.name} />;
  };

  if (loading) {
    return <AdminLoading fullPage text="Đang tải dữ liệu voucher..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý voucher</h1>
          <p className="text-muted-foreground">Tạo và vận hành mã giảm giá cho shop</p>
        </div>
        <Button type="button" onClick={resetForm} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Tạo voucher mới
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{editingVoucher ? 'Chỉnh sửa voucher' : 'Tạo voucher'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <div className="space-y-2">
                  <Label htmlFor="voucher-name">Tên voucher *</Label>
                  <Input id="voucher-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required placeholder="VD: Giảm 10% đơn từ 500k" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="voucher-code">Mã voucher *</Label>
                  <Input id="voucher-code" value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value.toUpperCase() })} required placeholder="VD: SHOP10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="voucher-description">Mô tả</Label>
                <Textarea id="voucher-description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={3} placeholder="Mô tả ngắn về điều kiện voucher" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value as Voucher['status'] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Nháp</SelectItem>
                      <SelectItem value="active">Đang chạy</SelectItem>
                      <SelectItem value="inactive">Tạm dừng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Loại voucher</Label>
                  <div className="flex h-10 items-center rounded-md border border-input bg-muted/50 px-3 text-sm">
                    Giảm theo phần trăm (%)
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="discount-value">Phần trăm giảm (%) *</Label>
                  <Input id="discount-value" type="number" min="1" max="100" value={form.discount_value} onChange={(event) => setForm({ ...form, discount_value: Number(event.target.value) })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-discount">Giảm tối đa</Label>
                  <Input id="max-discount" type="number" min="0" value={form.max_discount_amount} onChange={(event) => setForm({ ...form, max_discount_amount: event.target.value === '' ? '' : Number(event.target.value) })} placeholder="Không giới hạn" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="minimum-spend">Đơn tối thiểu</Label>
                  <Input id="minimum-spend" type="number" min="0" value={form.minimum_spend} onChange={(event) => setForm({ ...form, minimum_spend: Number(event.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usage-limit">Tổng lượt dùng</Label>
                  <Input id="usage-limit" type="number" min="1" value={form.total_usage_limit} onChange={(event) => setForm({ ...form, total_usage_limit: event.target.value === '' ? '' : Number(event.target.value) })} placeholder="Không giới hạn" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="per-user-limit">Lượt dùng mỗi khách</Label>
                  <Input id="per-user-limit" type="number" min="1" value={form.per_user_usage_limit} onChange={(event) => setForm({ ...form, per_user_usage_limit: event.target.value === '' ? '' : Number(event.target.value) })} placeholder="Không giới hạn" />
                </div>
                <div className="space-y-2">
                  <Label>Phạm vi áp dụng</Label>
                  <Select value={form.scope_type} onValueChange={(value) => setForm({ ...form, scope_type: value as Voucher['scope_type'] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toàn shop</SelectItem>
                      <SelectItem value="product">Theo sản phẩm</SelectItem>
                      <SelectItem value="category">Theo danh mục</SelectItem>
                      <SelectItem value="brand">Theo thương hiệu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Ngày bắt đầu *</Label>
                  <Input id="start-date" type="datetime-local" value={form.start_date} onChange={(event) => setForm({ ...form, start_date: event.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">Ngày kết thúc *</Label>
                  <Input id="end-date" type="datetime-local" value={form.end_date} onChange={(event) => setForm({ ...form, end_date: event.target.value })} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Chọn phạm vi</Label>
                {renderScopeSelector()}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-2 rounded-lg border p-3 text-sm">
                  <input type="checkbox" checked={form.is_stackable} onChange={(event) => setForm({ ...form, is_stackable: event.target.checked })} />
                  Cho phép dùng cùng voucher khác
                </label>
                <label className="flex items-center gap-2 rounded-lg border p-3 text-sm">
                  <input type="checkbox" checked={form.is_public} onChange={(event) => setForm({ ...form, is_public: event.target.checked })} />
                  Hiển thị công khai
                </label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                  {editingVoucher ? 'Lưu thay đổi' : 'Tạo voucher'}
                </Button>
                {editingVoucher && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    <X className="mr-2 h-4 w-4" />
                    Hủy
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-base">Danh sách voucher ({displayVouchers.length})</CardTitle>
              <div className="relative sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Tìm tên hoặc mã voucher..." className="pl-9" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-left text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Voucher</th>
                    <th className="px-4 py-3 font-medium">Giảm giá</th>
                    <th className="px-4 py-3 font-medium">Điều kiện</th>
                    <th className="px-4 py-3 font-medium">Sử dụng</th>
                    <th className="px-4 py-3 font-medium">Trạng thái</th>
                    <th className="px-4 py-3 font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {displayVouchers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">Chưa có voucher</td>
                    </tr>
                  ) : (
                    displayVouchers.map((voucher) => (
                      <tr key={voucher.id} className="align-top">
                        <td className="px-4 py-3">
                          <p className="font-medium">{voucher.name}</p>
                          <p className="mt-1 font-mono text-xs text-muted-foreground">{voucher.code}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{scopeTypeLabels[voucher.scope_type]}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p>Giảm theo %</p>
                          <p className="mt-1 font-medium">{getDiscountDisplay(voucher)}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p>Đơn từ {formatPrice(Number(voucher.minimum_spend || 0))}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{new Date(voucher.start_date).toLocaleDateString('vi-VN')} - {new Date(voucher.end_date).toLocaleDateString('vi-VN')}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p>{voucher.usage_count || 0}/{voucher.total_usage_limit || '∞'}</p>
                          <p className="mt-1 text-xs text-muted-foreground">Mỗi khách: {voucher.per_user_usage_limit || '∞'}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium">{statusLabels[voucher.status]}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => startEdit(voucher)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            {voucher.status === 'active' ? (
                              <Button type="button" variant="outline" size="sm" disabled={actionId === voucher.id} onClick={() => runVoucherAction(voucher, 'deactivate')}>
                                {actionId === voucher.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <PowerOff className="h-4 w-4" />}
                              </Button>
                            ) : (
                              <Button type="button" variant="outline" size="sm" disabled={actionId === voucher.id} onClick={() => runVoucherAction(voucher, 'activate')}>
                                {actionId === voucher.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Power className="h-4 w-4" />}
                              </Button>
                            )}
                            <Button type="button" variant="outline" size="sm" disabled={actionId === voucher.id || voucher.status === 'active'} onClick={() => runVoucherAction(voucher, 'delete')}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ScopeList<T extends Product | Category | Brand>({
  items,
  selectedIds,
  onToggle,
  getLabel,
}: {
  items: T[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  getLabel: (item: T) => string;
}) {
  return (
    <div className="max-h-56 overflow-y-auto rounded-lg border divide-y">
      {items.length === 0 ? (
        <p className="p-4 text-sm text-muted-foreground">Không có dữ liệu để chọn</p>
      ) : (
        items.map((item) => (
          <button key={item.id} type="button" onClick={() => onToggle(item.id)} className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-muted/70">
            <span className={`flex h-5 w-5 items-center justify-center rounded border ${selectedIds.includes(item.id) ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black' : 'border-input'}`}>
              {selectedIds.includes(item.id) && <Check className="h-3 w-3" />}
            </span>
            <span className="truncate text-sm">{getLabel(item)}</span>
          </button>
        ))
      )}
    </div>
  );
}
