'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Eye, Download, Loader2, AlertCircle, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useOrdersWithFilters } from '@/hooks/useApi';
import { orderApi } from '@/lib/api';
import { exportOrdersToExcel } from '@/lib/exportOrdersToExcel';
import { formatPrice } from '@/lib/productMapper';
import { AdminLoading } from '@/components/admin/AdminLoading';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function AdminOrdersPage() {
  const [searchInput, setSearchInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [filters, setFilters] = useState({ search: '', status: 'all', date: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [isDeletingOrder, setIsDeletingOrder] = useState(false);
  const [statusState, setStatusState] = useState<Record<string, string>>({});
  const itemsPerPage = 10;

  const { data, loading, error, refetch } = useOrdersWithFilters({
    page: currentPage,
    limit: itemsPerPage,
    search: filters.search,
    status: filters.status,
    date: filters.date,
  });

  const displayOrders = data?.data || [];
  const pagination = data?.pagination || { total: 0, totalPages: 1 };
  const filteredOrdersCount = pagination.total;
  const totalPages = pagination.totalPages;
  const displayOrderIds = useMemo(
    () => displayOrders.map((order: any) => order.id || order.orderNumber),
    [displayOrders]
  );
  const allVisibleSelected = displayOrders.length > 0 && displayOrders.every((order: any) => selectedOrderIds.includes(order.id || order.orderNumber));

  useEffect(() => {
    const nextState: Record<string, string> = {};
    displayOrders.forEach((order: any) => {
      nextState[order.id || order.orderNumber] = order.status;
    });

    setStatusState((prev) => {
      const prevKeys = Object.keys(prev);
      const nextKeys = Object.keys(nextState);

      if (prevKeys.length === nextKeys.length && nextKeys.every((key) => prev[key] === nextState[key])) {
        return prev;
      }

      return nextState;
    });
  }, [displayOrders]);

  useEffect(() => {
    setSelectedOrderIds((prev) => {
      const nextSelected = prev.filter((id) => displayOrderIds.includes(id));

      if (nextSelected.length === prev.length && nextSelected.every((id, index) => id === prev[index])) {
        return prev;
      }

      return nextSelected;
    });
  }, [displayOrderIds]);

  const handleApplyFilters = () => {
    setFilters(prev => ({ ...prev, search: searchInput, date: dateInput }));
    setCurrentPage(1);
  };

  const handleStatusTabClick = (status: string) => {
    setFilters(prev => ({ ...prev, status }));
    setCurrentPage(1);
  };

  const handleExportExcel = async () => {
    try {
      setExporting(true);

      const exportLimit = Math.max(filteredOrdersCount, displayOrders.length, 1);
      const exportData = await orderApi.getWithFilters({
        page: 1,
        limit: exportLimit,
        search: filters.search,
        status: filters.status,
        date: filters.date,
      });

      const today = new Date();
      const dateStamp = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      await exportOrdersToExcel(exportData.data || [], `smashx-orders-${dateStamp}.xlsx`);
    } catch (error) {
      console.error('Failed to export orders:', error);
      toast.error('Khong the xuat file Excel. Vui long thu lai.');
    } finally {
      setExporting(false);
    }
  };

  const handleSelectAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedOrderIds([]);
      return;
    }
    setSelectedOrderIds(displayOrders.map((order: any) => order.id || order.orderNumber));
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const handleStatusChange = async (orderId: string, nextStatus: string) => {
    const previousStatus = statusState[orderId];
    setStatusState((prev) => ({ ...prev, [orderId]: nextStatus }));
    setUpdatingOrderId(orderId);

    try {
      await orderApi.update(orderId, { status: nextStatus } as any);
      await refetch();
    } catch (error) {
      console.error('Failed to update order status:', error);
      setStatusState((prev) => ({ ...prev, [orderId]: previousStatus }));
      toast.error('Khong the cap nhat trang thai don hang. Vui long thu lai.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedOrderIds.length === 0) return;

    try {
      setBulkDeleting(true);
      await Promise.all(selectedOrderIds.map((orderId) => orderApi.delete(orderId)));
      toast.success(`Da xoa ${selectedOrderIds.length} don hang.`);
      setSelectedOrderIds([]);
      setIsBulkDeleteDialogOpen(false);
      await refetch();
    } catch (error) {
      console.error('Failed to bulk delete orders:', error);
      toast.error('Khong the xoa tat ca don hang da chon. Vui long thu lai.');
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!deletingOrderId) return;

    try {
      setIsDeletingOrder(true);
      await orderApi.delete(deletingOrderId);
      toast.success('Da xoa don hang.');
      setSelectedOrderIds((prev) => prev.filter((id) => id !== deletingOrderId));
      setDeletingOrderId(null);
      await refetch();
    } catch (error) {
      console.error('Failed to delete order:', error);
      toast.error('Khong the xoa don hang. Vui long thu lai.');
    } finally {
      setIsDeletingOrder(false);
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300',
    pending_payment: 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300',
    paid: 'bg-gray-200 text-gray-800 dark:bg-slate-700 dark:text-white',
    awaiting_shipment: 'bg-gray-300 text-gray-800 dark:bg-slate-600 dark:text-white',
    awaiting_collection: 'bg-gray-200 text-gray-800 dark:bg-slate-700 dark:text-white',
    in_transit: 'bg-gray-300 text-gray-800 dark:bg-slate-600 dark:text-white',
    delivered: 'bg-black text-white dark:bg-white dark:text-black',
    completed: 'bg-black text-white dark:bg-white dark:text-black',
    cancelled: 'bg-gray-100 text-gray-500 dark:bg-slate-900 dark:text-slate-400',
    confirmed: 'bg-gray-200 text-gray-800 dark:bg-slate-700 dark:text-white',
    shipping: 'bg-gray-300 text-gray-800 dark:bg-slate-600 dark:text-white',
  };

  const statusLabels: Record<string, string> = {
    pending: 'Chờ xử lý',
    pending_payment: 'Chờ thanh toán',
    paid: 'Đã thanh toán',
    awaiting_shipment: 'Chờ tạo shipment',
    awaiting_collection: 'Chờ lấy hàng',
    in_transit: 'Đang trung chuyển',
    delivered: 'Hoàn tất',
    completed: 'Hoàn tất',
    cancelled: 'Đã hủy',
    confirmed: 'Đã xác nhận',
    shipping: 'Đang vận chuyển',
  };

  const statusOptions = Object.entries(statusLabels).map(([value, label]) => ({ value, label }));

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
            Tổng cộng {filteredOrdersCount} đơn hàng
          </p>
        </div>
        <div className="flex gap-2">
          {selectedOrderIds.length > 0 && (
            <button
              disabled={bulkDeleting}
              onClick={() => setIsBulkDeleteDialogOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-card px-4 py-2.5 font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              {bulkDeleting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
              {bulkDeleting ? 'Đang xóa...' : `Xóa đã chọn (${selectedOrderIds.length})`}
            </button>
          )}
          
          <button
            onClick={handleExportExcel}
            disabled={exporting || filteredOrdersCount === 0}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-input bg-card hover:bg-accent hover:text-accent-foreground font-medium rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none"
          >
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />}
            {exporting ? 'Đang xuất...' : 'Xuất Excel'}
          </button>
        </div>
      </div>

      <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa đơn hàng</AlertDialogTitle>
            <AlertDialogDescription>
              {`Bạn sắp xóa ${selectedOrderIds.length} đơn hàng đã chọn. Hành động này không thể hoàn tác.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={bulkDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              disabled={bulkDeleting}
              className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-slate-200"
              onClick={handleBulkDelete}
            >
              {bulkDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                'Xóa đã chọn'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deletingOrderId} onOpenChange={(open) => !open && !isDeletingOrder && setDeletingOrderId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa đơn hàng</AlertDialogTitle>
            <AlertDialogDescription>
              Đơn hàng đã chọn sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingOrder}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeletingOrder}
              className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-slate-200"
              onClick={handleDeleteOrder}
            >
              {isDeletingOrder ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                'Xóa đơn hàng'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'pending_payment', 'paid', 'awaiting_shipment', 'in_transit', 'completed', 'cancelled'].map((statusKey) => (
          <button
            key={statusKey}
            onClick={() => handleStatusTabClick(statusKey)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filters.status === statusKey ? 'bg-foreground text-background' : 'bg-card border border-input hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {statusKey === 'all' ? 'Tất cả' : statusLabels[statusKey] || statusKey}
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
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
          />
        </div>
        <div>
          <label htmlFor="order-date" className="sr-only">Lọc theo ngày</label>
          <input
            id="order-date"
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="h-10 px-4 border border-input rounded-lg bg-background text-sm focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <button onClick={handleApplyFilters} className="h-10 px-4 border border-input rounded-lg bg-background hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2 text-sm focus-visible:ring-2 focus-visible:ring-ring">
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
                  <input
                    type="checkbox"
                    className="rounded"
                    aria-label="Chọn tất cả đơn hàng"
                    checked={allVisibleSelected}
                    onChange={handleSelectAllVisible}
                  />
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
                    <input
                      type="checkbox"
                      className="rounded"
                      aria-label={`Chọn đơn hàng ${order.id || order.orderNumber}`}
                      checked={selectedOrderIds.includes(order.id || order.orderNumber)}
                      onChange={() => handleSelectOrder(order.id || order.orderNumber)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium">{order.id || order.orderNumber}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{order.customer || order.user?.name || 'Khách hàng'}</p>
                      <p className="text-sm text-muted-foreground">{order.email || order.user?.email || ''}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium">
                      {(order.order_items || order.items || []).reduce((acc: number, item: any) => acc + (item.quantity || 1), 0)} sản phẩm
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold">{formatPrice(order.total)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">
                      {new Date(order.created_at || order.createdAt || new Date()).toLocaleDateString('vi-VN')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <label htmlFor={`status-${order.id || order.orderNumber}`} className="sr-only">Trạng thái đơn hàng</label>
                    {updatingOrderId === (order.id || order.orderNumber) ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Dang cap nhat
                      </div>
                    ) : (
                      <Select
                        value={statusState[order.id || order.orderNumber] || order.status}
                        onValueChange={(value) => handleStatusChange(order.id || order.orderNumber, value)}
                      >
                        <SelectTrigger
                          id={`status-${order.id || order.orderNumber}`}
                          className={`h-9 min-w-[170px] rounded-full border-0 px-3 text-xs font-medium shadow-none focus-visible:ring-2 focus-visible:ring-ring ${statusColors[statusState[order.id || order.orderNumber] || order.status] || 'bg-gray-100 text-gray-700 dark:bg-muted dark:text-muted-foreground'}`}
                        >
                          <SelectValue placeholder="Chon trang thai" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border border-slate-200 bg-white p-1 shadow-xl">
                          {statusOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="rounded-xl px-3 py-2 text-sm text-slate-700 focus:bg-slate-100 focus:text-slate-900"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
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
                        aria-label={`Xóa đơn hàng ${order.id || order.orderNumber}`}
                        onClick={() => setDeletingOrderId(order.id || order.orderNumber)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
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
            Hiển thị {filteredOrdersCount > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredOrdersCount)} của {filteredOrdersCount} đơn hàng
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
