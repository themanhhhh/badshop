import Link from 'next/link';
import { Plus, Search, Filter, Edit, Trash2, Eye, CircleDot, Footprints, Feather, Backpack, Star } from 'lucide-react';
import { products, formatPrice } from '@/lib/mockData';

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
          <p className="text-muted-foreground">Tổng cộng {products.length} sản phẩm</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Thêm sản phẩm
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-border flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select className="h-10 px-4 border border-input rounded-lg bg-background text-sm">
          <option value="">Tất cả danh mục</option>
          <option value="racket">Vợt cầu lông</option>
          <option value="shoes">Giày</option>
          <option value="accessories">Phụ kiện</option>
        </select>
        <select className="h-10 px-4 border border-input rounded-lg bg-background text-sm">
          <option value="">Tất cả thương hiệu</option>
          <option value="yonex">Yonex</option>
          <option value="victor">Victor</option>
          <option value="lining">Li-Ning</option>
        </select>
        <button className="h-10 px-4 border border-input rounded-lg bg-background hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm">
          <Filter className="h-4 w-4" />
          Bộ lọc
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Sản phẩm</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Danh mục</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Giá</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Kho</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Đánh giá</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {product.category === 'racket' ? <CircleDot className="h-6 w-6 text-gray-500" /> :
                         product.category === 'shoes' ? <Footprints className="h-6 w-6 text-gray-500" /> :
                         product.category === 'shuttlecock' ? <Feather className="h-6 w-6 text-gray-500" /> : <Backpack className="h-6 w-6 text-gray-500" />}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium capitalize">
                      {product.category === 'racket' ? 'Vợt' :
                       product.category === 'shoes' ? 'Giày' :
                       product.category === 'shuttlecock' ? 'Cầu' : 'Phụ kiện'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{formatPrice(product.price)}</p>
                      {product.originalPrice && (
                        <p className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.originalPrice)}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">{product.rating}</span>
                      <span className="text-muted-foreground">({product.reviews})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Xem">
                        <Eye className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Sửa">
                        <Edit className="h-4 w-4 text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Xóa">
                        <Trash2 className="h-4 w-4 text-red-600" />
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
            Hiển thị 1-{products.length} / {products.length} sản phẩm
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
