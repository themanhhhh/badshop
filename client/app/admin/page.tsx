'use client';

import Link from 'next/link';
import { DollarSign, ShoppingCart, Users, Package, MoreHorizontal, Eye, BarChart3, Loader2 } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { useOrders, useProducts, useUsers, useDashboardStats } from '@/hooks/useApi';
import { formatPrice } from '@/lib/productMapper';

export default function AdminDashboardPage() {
  const { data: stats, loading: statsLoading } = useDashboardStats();
  const { data: orders, loading: ordersLoading } = useOrders();
  const { data: products, loading: productsLoading } = useProducts();
  
  // Use API data only - no mock fallback
  const recentOrders = orders?.slice(0, 5) || [];
  const loading = statsLoading || ordersLoading || productsLoading; // Keep others for lists for now

  const dynamicStats = {
    totalRevenue: stats?.totalRevenue || 0,
    totalOrders: stats?.totalOrders || 0,
    totalCustomers: stats?.totalCustomers || 0,
    totalProducts: stats?.totalProducts || 0,
    revenueGrowth: stats?.revenueGrowth || 0,
    ordersGrowth: stats?.ordersGrowth || 0,
    customersGrowth: stats?.customersGrowth || 0,
    productsGrowth: stats?.productsGrowth || 0,
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    confirmed: 'bg-teal-100 text-teal-700',
    shipping: 'bg-indigo-100 text-indigo-700',
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

  return (
    <div className="space-y-6">
      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Đang tải dữ liệu từ server...
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Tổng doanh thu"
          value={formatPrice(dynamicStats.totalRevenue)}
          change={dynamicStats.revenueGrowth}
          icon={DollarSign}
          iconColor="text-green-600"
          iconBg="bg-green-100"
        />
        <StatsCard
          title="Đơn hàng"
          value={dynamicStats.totalOrders.toLocaleString()}
          change={dynamicStats.ordersGrowth}
          icon={ShoppingCart}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
        />
        <StatsCard
          title="Khách hàng"
          value={dynamicStats.totalCustomers.toLocaleString()}
          change={dynamicStats.customersGrowth}
          icon={Users}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
        />
        <StatsCard
          title="Sản phẩm"
          value={dynamicStats.totalProducts.toLocaleString()}
          change={dynamicStats.productsGrowth}
          icon={Package}
          iconColor="text-orange-600"
          iconBg="bg-orange-100"
        />
      </div>

      {/* Charts and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Doanh thu theo tháng</h2>
            <div>
              <label htmlFor="revenue-year" className="sr-only">Năm báo cáo</label>
              <select 
                id="revenue-year"
                className="px-3 py-2 border border-input rounded-lg text-sm bg-background focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option>Năm 2026</option>
                <option>Năm 2025</option>
              </select>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-16 w-16 text-blue-500 mx-auto mb-4" aria-hidden="true" />
              <p>Biểu đồ doanh thu sẽ hiển thị ở đây</p>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 border border-border">
          <h2 className="text-lg font-semibold mb-4">Sản phẩm bán chạy</h2>
          <div className="space-y-4">
            {(products?.slice(0, 3) || ['Yonex Astrox 99 Pro', 'Victor Thruster K 9900', 'Yonex Power Cushion 65Z3']).map((product, i) => (
              <div key={typeof product === 'string' ? product : product.id} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${
                  i === 0 ? 'bg-yellow-100 text-yellow-600' :
                  i === 1 ? 'bg-gray-100 text-gray-600' :
                  'bg-orange-100 text-orange-600'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {typeof product === 'string' ? product : product.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{30 - i * 7} đơn hàng</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold">Đơn hàng gần đây</h2>
          <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Xem tất cả
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Mã đơn</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Khách hàng</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Sản phẩm</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Tổng tiền</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Trạng thái</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentOrders.map((order: any) => (
                <tr key={order.id || order.orderNumber} className="hover:bg-gray-50 transition-colors">
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
                    <p className="text-sm truncate max-w-[200px]">
                      {order.products?.join(', ') || order.items?.map((i: any) => i.product?.name).join(', ') || 'Sản phẩm'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium">{formatPrice(order.total)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={`Xem chi tiết đơn hàng ${order.id || order.orderNumber}`}
                      >
                        <Eye className="h-4 w-4 text-gray-600" aria-hidden="true" />
                      </button>
                      <button 
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={`Tùy chọn khác cho đơn hàng ${order.id || order.orderNumber}`}
                      >
                        <MoreHorizontal className="h-4 w-4 text-gray-600" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
