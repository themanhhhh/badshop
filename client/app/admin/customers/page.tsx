'use client';

import { useState } from 'react';

import { Search, Filter, Mail, Phone, MoreHorizontal, UserPlus, Loader2 } from 'lucide-react';
import { useUsers } from '@/hooks/useApi';
import { formatPrice } from '@/lib/productMapper';
import { AdminSelect } from '@/components/admin/AdminSelect';
import { AdminLoading } from '@/components/admin/AdminLoading';

export default function AdminCustomersPage() {
  const { data: users, loading, refetch } = useUsers();
  const [statusFilter, setStatusFilter] = useState('all');

  // Transform API users to customer format
  const displayCustomers = (users || []).map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || 'N/A',
    totalOrders: 0,
    totalSpent: 0,
    status: 'active' as const,
    joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '',
    lastOrderDate: '',
  }));

  if (loading) {
    return <AdminLoading fullPage text="Đang tải khách hàng..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Quản lý khách hàng</h1>
          <p className="text-muted-foreground">
            Tổng cộng {displayCustomers.length} khách hàng
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          Thêm khách hàng
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Tổng khách hàng</p>
          <p className="text-2xl font-bold">{displayCustomers.length}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Khách hoạt động</p>
          <p className="text-2xl font-bold text-green-600">
            {displayCustomers.filter(c => c.status === 'active').length}
          </p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Tổng doanh thu</p>
          <p className="text-2xl font-bold text-blue-600">
            {formatPrice(displayCustomers.reduce((sum, c) => sum + (c.totalSpent || 0), 0))}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl p-4 border border-border flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <label htmlFor="customer-search" className="sr-only">Tìm kiếm khách hàng</label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <input
            id="customer-search"
            type="search"
            name="search"
            placeholder="Tìm theo tên, email, số điện thoại…"
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <AdminSelect
          value={statusFilter}
          onValueChange={setStatusFilter}
          placeholder="Tất cả trạng thái"
          className="w-[180px]"
          options={[
            { value: 'all', label: 'Tất cả trạng thái' },
            { value: 'active', label: 'Hoạt động' },
            { value: 'inactive', label: 'Không hoạt động' },
          ]}
        />
        <button className="h-10 px-4 border border-input rounded-lg bg-background hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2 text-sm focus-visible:ring-2 focus-visible:ring-ring">
          <Filter className="h-4 w-4" aria-hidden="true" />
          Bộ lọc
        </button>
      </div>

      {/* Customers Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                  <input type="checkbox" className="rounded" aria-label="Chọn tất cả khách hàng" />
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Khách hàng</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Liên hệ</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Đơn hàng</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Tổng chi tiêu</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Trạng thái</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {displayCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded" aria-label={`Chọn ${customer.name}`} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">ID: {customer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{customer.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{customer.totalOrders} đơn</p>
                      {customer.lastOrderDate && (
                        <p className="text-xs text-muted-foreground">Lần cuối: {customer.lastOrderDate}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold">{formatPrice(customer.totalSpent)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      customer.status === 'active' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' 
                        : 'bg-gray-100 text-gray-700 dark:bg-muted dark:text-muted-foreground'
                    }`}>
                      {customer.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      className="p-2 hover:bg-accent rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={`Tùy chọn cho ${customer.name}`}
                    >
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Hiển thị 1-{displayCustomers.length} / {displayCustomers.length} khách hàng
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 border border-input rounded-lg text-sm hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50" disabled>
              Trước
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
              1
            </button>
            <button className="px-3 py-2 border border-input rounded-lg text-sm hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50" disabled>
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
