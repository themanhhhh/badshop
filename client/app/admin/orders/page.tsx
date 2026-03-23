'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, Eye, MoreHorizontal, Download, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useOrders } from '@/hooks/useApi';
import { formatPrice } from '@/lib/productMapper';
import { AdminLoading } from '@/components/admin/AdminLoading';
import { Button } from '@/components/ui/button';

export default function AdminOrdersPage() {
  const { data: orders, loading, error, refetch } = useOrders();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Use API data directly
  const filteredOrders = orders || [];
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  
  const displayOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400',
    processing: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
    shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
    delivered: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
    confirmed: 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400',
    shipping: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400',
  };

  const statusLabels: Record<string, string> = {
    pending: 'Chờ xử lý',
    processing: 'Đang xử lý',
    shipped: 'Đang giao',
    delivered: 'Hoàn thành',
    cancelled: 'Đã hủy',
    confirmed: 'Đã xác nhận',
    shipping: 'Đang vận chuyển',
  };

  if (loading) {
    return <AdminLoading fullPage text="Đang tải đơn hàng..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
          <p className="text-muted-foreground">
            Tổng cộng {filteredOrders.length} đơn hàng
          </p>
        </div>
        <div className="flex gap-2">
         
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-input bg-card hover:bg-accent hover:text-accent-foreground font-medium rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-ring">
            <Download className="h-4 w-4" aria-hidden="true" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['Tất cả', 'Chờ xử lý', 'Đang xử lý', 'Đang giao', 'Hoàn thành', 'Đã hủy'].map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              i === 0 ? 'bg-blue-600 text-white' : 'bg-card border border-input hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl p-4 border border-border flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <label htmlFor="order-search" className="sr-only">Tìm kiếm đơn hàng</label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <input
            id="order-search"
            type="search"
            name="search"
            placeholder="Tìm theo mã đơn, tên khách hàng…"
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div>
          <label htmlFor="order-date" className="sr-only">Lọc theo ngày</label>
          <input
            id="order-date"
            type="date"
            className="h-10 px-4 border border-input rounded-lg bg-background text-sm focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <button className="h-10 px-4 border border-input rounded-lg bg-background hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2 text-sm focus-visible:ring-2 focus-visible:ring-ring">
          <Filter className="h-4 w-4" aria-hidden="true" />
          Bộ lọc
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                  <input type="checkbox" className="rounded" aria-label="Chọn tất cả đơn hàng" />
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Mã đơn</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Khách hàng</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Sản phẩm</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Tổng tiền</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Ngày đặt</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Trạng thái</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {displayOrders.map((order: any) => (
                <tr key={order.id || order.orderNumber} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded" aria-label={`Chọn đơn hàng ${order.id || order.orderNumber}`} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium text-blue-600">{order.id || order.orderNumber}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{order.customer || order.user?.name || 'Khách hàng'}</p>
                      <p className="text-sm text-muted-foreground">{order.email || order.user?.email || ''}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm truncate max-w-[200px]" title={order.products?.join(', ') || ''}>
                      {order.products?.join(', ') || order.items?.map((i: any) => i.product?.name).join(', ') || 'Sản phẩm'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.products?.length || order.items?.length || 0} sản phẩm
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold">{formatPrice(order.total)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">
                      {order.date || (order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : '')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <label htmlFor={`status-${order.id || order.orderNumber}`} className="sr-only">Trạng thái đơn hàng</label>
                    <select 
                      id={`status-${order.id || order.orderNumber}`}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring ${statusColors[order.status] || 'bg-gray-100 text-gray-700 dark:bg-muted dark:text-muted-foreground'}`}
                      defaultValue={order.status}
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Link 
                        href={`/admin/orders/${order.id || order.orderNumber}`}
                        className="p-2 hover:bg-accent rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={`Chi tiết đơn hàng ${order.id || order.orderNumber}`}
                      >
                        <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      </Link>
                      <button 
                        className="p-2 hover:bg-accent rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={`Tùy chọn khác cho đơn hàng ${order.id || order.orderNumber}`}
                      >
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Hiển thị {filteredOrders.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredOrders.length)} của {filteredOrders.length} đơn hàng
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
