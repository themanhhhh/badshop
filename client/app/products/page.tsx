import Link from 'next/link';
import { ArrowRight, SlidersHorizontal, ChevronDown } from 'lucide-react';
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
import { products } from '@/lib/mockData';

export default function ProductsPage() {
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
            {products.length} sản phẩm
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" className="h-12 px-10">
              Xem thêm
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
