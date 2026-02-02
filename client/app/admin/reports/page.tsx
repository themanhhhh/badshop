import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  Download
} from 'lucide-react';
import { stats, monthlyRevenue, formatPrice, products, orders, customers } from '@/lib/mockData';

export default function AdminReportsPage() {
  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue));
  
  // Calculate category sales
  const categorySales = [
    { name: 'Vợt cầu lông', sales: 45, color: 'bg-blue-500' },
    { name: 'Giày', sales: 28, color: 'bg-green-500' },
    { name: 'Phụ kiện', sales: 18, color: 'bg-purple-500' },
    { name: 'Cầu lông', sales: 9, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Báo cáo & Thống kê</h1>
          <p className="text-muted-foreground">Tổng quan hoạt động kinh doanh</p>
        </div>
        <div className="flex items-center gap-3">
          <div>
            <label htmlFor="report-year" className="sr-only">Năm báo cáo</label>
            <select id="report-year" className="h-10 px-4 border border-input rounded-lg bg-background text-sm focus-visible:ring-2 focus-visible:ring-ring">
              <option>Năm 2026</option>
              <option>Năm 2025</option>
            </select>
          </div>
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-input bg-white hover:bg-gray-50 font-medium rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-ring">
            <Download className="h-4 w-4" aria-hidden="true" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" aria-hidden="true" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.revenueGrowth >= 0 ? <TrendingUp className="h-4 w-4" aria-hidden="true" /> : <TrendingDown className="h-4 w-4" aria-hidden="true" />}
              {stats.revenueGrowth}%
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
          <p className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-blue-600" aria-hidden="true" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${stats.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.ordersGrowth >= 0 ? <TrendingUp className="h-4 w-4" aria-hidden="true" /> : <TrendingDown className="h-4 w-4" aria-hidden="true" />}
              {stats.ordersGrowth}%
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
          <p className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" aria-hidden="true" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${stats.customersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.customersGrowth >= 0 ? <TrendingUp className="h-4 w-4" aria-hidden="true" /> : <TrendingDown className="h-4 w-4" aria-hidden="true" />}
              {stats.customersGrowth}%
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Khách hàng</p>
          <p className="text-2xl font-bold">{stats.totalCustomers.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Package className="h-5 w-5 text-orange-600" aria-hidden="true" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${stats.productsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.productsGrowth >= 0 ? <TrendingUp className="h-4 w-4" aria-hidden="true" /> : <TrendingDown className="h-4 w-4" aria-hidden="true" />}
              {stats.productsGrowth}%
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Sản phẩm</p>
          <p className="text-2xl font-bold">{stats.totalProducts.toLocaleString()}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">Doanh thu theo tháng</h2>
              <p className="text-sm text-muted-foreground">Năm 2026</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-sm" />
                <span>Doanh thu</span>
              </div>
            </div>
          </div>
          
          {/* Bar Chart */}
          <div className="h-64 flex items-end gap-2">
            {monthlyRevenue.map((item, i) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md transition-all hover:from-blue-600 hover:to-blue-500 cursor-pointer"
                  style={{ 
                    height: `${(item.revenue / maxRevenue) * 100}%`,
                    minHeight: '20px'
                  }}
                  title={formatPrice(item.revenue)}
                />
                <span className="text-xs text-muted-foreground">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Sales */}
        <div className="bg-white rounded-2xl p-6 border border-border">
          <h2 className="text-lg font-semibold mb-6">Doanh số theo danh mục</h2>
          <div className="space-y-4">
            {categorySales.map((category) => (
              <div key={category.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{category.name}</span>
                  <span className="text-sm text-muted-foreground">{category.sales}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${category.color} rounded-full transition-all`}
                    style={{ width: `${category.sales}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 border border-border">
          <h2 className="text-lg font-semibold mb-4">Sản phẩm bán chạy</h2>
          <div className="space-y-4">
            {products.slice(0, 5).map((product, i) => (
              <div key={product.id} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                  i === 0 ? 'bg-yellow-100 text-yellow-600' :
                  i === 1 ? 'bg-gray-100 text-gray-600' :
                  i === 2 ? 'bg-orange-100 text-orange-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.brand}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(product.price)}</p>
                  <p className="text-xs text-muted-foreground">{product.reviews} đánh giá</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 border border-border">
          <h2 className="text-lg font-semibold mb-4">Hoạt động gần đây</h2>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
                <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <ShoppingCart className="h-4 w-4 text-blue-600" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{order.customer}</span>
                    {' '}đã đặt hàng{' '}
                    <span className="font-medium">{order.id}</span>
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" aria-hidden="true" />
                    {order.date}
                  </p>
                </div>
                <span className="font-medium text-sm">{formatPrice(order.total)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
