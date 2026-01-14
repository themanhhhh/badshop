import { DollarSign, ShoppingCart, Users, Package, MoreHorizontal, Eye, BarChart3 } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { orders, stats, formatPrice } from '@/lib/mockData';

export default function AdminDashboardPage() {
  const recentOrders = orders.slice(0, 5);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const statusLabels: Record<string, string> = {
    pending: 'Chờ xử lý',
    processing: 'Đang xử lý',
    shipped: 'Đang giao',
    delivered: 'Hoàn thành',
    cancelled: 'Đã hủy',
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Tổng doanh thu"
          value={formatPrice(stats.totalRevenue)}
          change={stats.revenueGrowth}
          icon={DollarSign}
          iconColor="text-green-600"
          iconBg="bg-green-100"
        />
        <StatsCard
          title="Đơn hàng"
          value={stats.totalOrders.toLocaleString()}
          change={stats.ordersGrowth}
          icon={ShoppingCart}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
        />
        <StatsCard
          title="Khách hàng"
          value={stats.totalCustomers.toLocaleString()}
          change={stats.customersGrowth}
          icon={Users}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
        />
        <StatsCard
          title="Sản phẩm"
          value={stats.totalProducts.toLocaleString()}
          change={stats.productsGrowth}
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
            <select className="px-3 py-2 border border-input rounded-lg text-sm bg-background">
              <option>Năm 2026</option>
              <option>Năm 2025</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <p>Biểu đồ doanh thu sẽ hiển thị ở đây</p>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 border border-border">
          <h2 className="text-lg font-semibold mb-4">Sản phẩm bán chạy</h2>
          <div className="space-y-4">
            {['Yonex Astrox 99 Pro', 'Victor Thruster K 9900', 'Yonex Power Cushion 65Z3'].map((product, i) => (
              <div key={product} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${
                  i === 0 ? 'bg-yellow-100 text-yellow-600' :
                  i === 1 ? 'bg-gray-100 text-gray-600' :
                  'bg-orange-100 text-orange-600'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{product}</p>
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
          <a href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Xem tất cả
          </a>
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
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium">{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm truncate max-w-[200px]">{order.products.join(', ')}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium">{formatPrice(order.total)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal className="h-4 w-4 text-gray-600" />
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
