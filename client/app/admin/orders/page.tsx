import Link from 'next/link';
import { Search, Filter, Eye, MoreHorizontal, Download } from 'lucide-react';
import { orders, formatPrice } from '@/lib/mockData';

export default function AdminOrdersPage() {
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
          <p className="text-muted-foreground">Tổng cộng {orders.length} đơn hàng</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-input bg-white hover:bg-gray-50 font-medium rounded-lg transition-colors">
          <Download className="h-4 w-4" />
          Xuất Excel
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['Tất cả', 'Chờ xử lý', 'Đang xử lý', 'Đang giao', 'Hoàn thành', 'Đã hủy'].map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              i === 0 ? 'bg-blue-600 text-white' : 'bg-white border border-input hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-border flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn, tên khách hàng..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <input
          type="date"
          className="h-10 px-4 border border-input rounded-lg bg-background text-sm"
        />
        <button className="h-10 px-4 border border-input rounded-lg bg-background hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm">
          <Filter className="h-4 w-4" />
          Bộ lọc
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                  <input type="checkbox" className="rounded" />
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
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium text-blue-600">{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm truncate max-w-[200px]" title={order.products.join(', ')}>
                      {order.products.join(', ')}
                    </p>
                    <p className="text-xs text-muted-foreground">{order.products.length} sản phẩm</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold">{formatPrice(order.total)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">{order.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border-0 cursor-pointer ${statusColors[order.status]}`}
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
                        href={`/admin/orders/${order.id}`}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Chi tiết"
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </Link>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Thêm">
                        <MoreHorizontal className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Hiển thị 1-{orders.length} / {orders.length} đơn hàng
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 border border-input rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50" disabled>
              Trước
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
              1
            </button>
            <button className="px-3 py-2 border border-input rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50" disabled>
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
