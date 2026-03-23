'use client';

import { useState, useMemo, useEffect } from 'react';

import { Search, Filter, Mail, Phone, MoreHorizontal, UserPlus, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUsers } from '@/hooks/useApi';
import { formatPrice } from '@/lib/productMapper';
import { AdminSelect } from '@/components/admin/AdminSelect';
import { AdminLoading } from '@/components/admin/AdminLoading';
import { Button } from '@/components/ui/button';

export default function AdminCustomersPage() {
  const { data: users, loading, refetch } = useUsers();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Transform API users to customer format
  const allCustomers = useMemo(() => {
    return (users || []).map(user => ({
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
  }, [users]);
  
  // Filter
  const filteredCustomers = useMemo(() => {
    return allCustomers.filter(customer => {
      const matchesSearch = !searchQuery || 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery);
        
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [allCustomers, searchQuery, statusFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const displayCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCustomers, currentPage]);

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
            Tổng cộng {filteredCustomers.length} khách hàng
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          Thêm khách hàng
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Tổng khách hàng</p>
          <p className="text-2xl font-bold">{allCustomers.length}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Khách hoạt động</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {allCustomers.filter(c => c.status === 'active').length}
          </p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Tổng doanh thu</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatPrice(allCustomers.reduce((sum, c) => sum + (c.totalSpent || 0), 0))}
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
              {displayCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                    Không tìm thấy khách hàng nào
                  </td>
                </tr>
              ) : (
                displayCustomers.map((customer) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Hiển thị {filteredCustomers.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredCustomers.length)} của {filteredCustomers.length} khách hàng
          </p>
          
          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {totalPages > 0 ? Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              )) : (
                <Button
                  variant="default"
                  size="sm"
                  className="w-8 h-8 p-0"
                  disabled
                >
                  1
                </Button>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(Math.max(1, totalPages), prev + 1))}
              disabled={currentPage >= totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
