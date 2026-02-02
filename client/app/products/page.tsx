'use client';

import Link from 'next/link';
import { ArrowRight, SlidersHorizontal, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import { Header } from '@/components/shop/Header';
import { Footer } from '@/components/shop/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProducts } from '@/hooks/useApi';
import { mapProductsForDisplay } from '@/lib/productMapper';

export default function ProductsPage() {
  const { data: apiProducts, loading, error, refetch } = useProducts();

  // Map API products to display format
  const displayProducts = apiProducts ? mapProductsForDisplay(apiProducts) : [];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="border-b border-gray-100">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">Trang chủ</Link>
              <span>/</span>
              <span className="text-foreground">Tất cả sản phẩm</span>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold uppercase tracking-wide text-center mb-2">
            Tất cả sản phẩm
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            {loading ? 'Đang tải...' : `${displayProducts.length} sản phẩm`}
          </p>
        </div>

        {/* Filter Bar */}
        <div className="border-y border-gray-100 sticky top-[105px] bg-white z-30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              <Button variant="ghost" className="text-xs uppercase tracking-widest font-medium">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Bộ lọc
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-xs uppercase tracking-widest font-medium">
                    Sắp xếp
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Mới nhất</DropdownMenuItem>
                  <DropdownMenuItem>Giá: Thấp đến cao</DropdownMenuItem>
                  <DropdownMenuItem>Giá: Cao đến thấp</DropdownMenuItem>
                  <DropdownMenuItem>Bán chạy nhất</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container mx-auto px-4 py-10">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-3 text-muted-foreground">Đang tải sản phẩm...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-red-500 mb-4">Không thể tải sản phẩm. Vui lòng thử lại.</p>
              <Button onClick={() => refetch()} variant="outline">
                Thử lại
              </Button>
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Chưa có sản phẩm nào.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Load More */}
          {displayProducts.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" className="h-12 px-10">
                Xem thêm
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
