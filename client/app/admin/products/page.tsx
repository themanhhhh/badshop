'use client';

import Link from 'next/link';
import { Plus, Search, Filter, Edit, Trash2, Eye, CircleDot, Footprints, Feather, Backpack, Star, Loader2, AlertCircle } from 'lucide-react';
import { useProducts, useBrands, useCategories } from '@/hooks/useApi';
import { formatPrice } from '@/lib/productMapper';

export default function AdminProductsPage() {
  const { data: products, loading, error, refetch } = useProducts();
  const { data: brands } = useBrands();
  const { data: categories } = useCategories();

  // Use API data directly
  const displayProducts = products || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
          <p className="text-muted-foreground">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang tải...
              </span>
            ) : (
              `Tổng cộng ${displayProducts.length} sản phẩm`
            )}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Thêm sản phẩm
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-border flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <label htmlFor="product-search" className="sr-only">Tìm kiếm sản phẩm</label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <input
            id="product-search"
            type="search"
            name="search"
            placeholder="Tìm kiếm sản phẩm…"
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="category-filter" className="sr-only">Lọc theo danh mục</label>
          <select id="category-filter" className="h-10 px-4 border border-input rounded-lg bg-background text-sm focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">Tất cả danh mục</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            )) || (
              <>
                <option value="racket">Vợt cầu lông</option>
                <option value="shoes">Giày</option>
                <option value="accessories">Phụ kiện</option>
              </>
            )}
          </select>
        </div>
        <div>
          <label htmlFor="brand-filter" className="sr-only">Lọc theo thương hiệu</label>
          <select id="brand-filter" className="h-10 px-4 border border-input rounded-lg bg-background text-sm focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">Tất cả thương hiệu</option>
            {brands?.map((brand) => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            )) || (
              <>
                <option value="yonex">Yonex</option>
                <option value="victor">Victor</option>
                <option value="lining">Li-Ning</option>
              </>
            )}
          </select>
        </div>
        <button className="h-10 px-4 border border-input rounded-lg bg-background hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm focus-visible:ring-2 focus-visible:ring-ring">
          <Filter className="h-4 w-4" aria-hidden="true" />
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
                  <input type="checkbox" className="rounded" aria-label="Chọn tất cả" />
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
              {displayProducts.map((product: any) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded" aria-label={`Chọn ${product.name}`} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {(product.category === 'racket' || product.category?.slug === 'racket') ? <CircleDot className="h-6 w-6 text-gray-500" aria-hidden="true" /> :
                         (product.category === 'shoes' || product.category?.slug === 'shoes') ? <Footprints className="h-6 w-6 text-gray-500" aria-hidden="true" /> :
                         (product.category === 'shuttlecock' || product.category?.slug === 'shuttlecock') ? <Feather className="h-6 w-6 text-gray-500" aria-hidden="true" /> : <Backpack className="h-6 w-6 text-gray-500" aria-hidden="true" />}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.brand?.name || product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium capitalize">
                      {product.category?.name || 
                       (product.category === 'racket' ? 'Vợt' :
                        product.category === 'shoes' ? 'Giày' :
                        product.category === 'shuttlecock' ? 'Cầu' : 'Phụ kiện')}
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
                      (product.inStock || product.stock > 0) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {product.stock !== undefined ? `${product.stock} sản phẩm` : (product.inStock ? 'Còn hàng' : 'Hết hàng')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" aria-hidden="true" />
                      <span className="font-medium">{product.rating || 'N/A'}</span>
                      <span className="text-muted-foreground">({product.reviews || 0})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button 
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-ring" 
                        aria-label={`Xem ${product.name}`}
                      >
                        <Eye className="h-4 w-4 text-gray-600" aria-hidden="true" />
                      </button>
                      <button 
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-ring" 
                        aria-label={`Sửa ${product.name}`}
                      >
                        <Edit className="h-4 w-4 text-blue-600" aria-hidden="true" />
                      </button>
                      <button 
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-ring" 
                        aria-label={`Xóa ${product.name}`}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" aria-hidden="true" />
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
            Hiển thị 1-{displayProducts.length} / {displayProducts.length} sản phẩm
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
