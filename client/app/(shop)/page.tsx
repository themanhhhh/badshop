import Link from 'next/link';
import { ArrowRight, Truck, Shield, Headphones, CreditCard, Flame, CircleDot, Footprints, Feather, Backpack } from 'lucide-react';
import { HeroBanner } from '@/components/shop/HeroBanner';
import { ProductCard } from '@/components/shop/ProductCard';
import { products, categories } from '@/lib/mockData';

// Category icon renderer
function CategoryIcon({ iconName, className }: { iconName: string; className?: string }) {
  switch (iconName) {
    case 'circle-dot':
      return <CircleDot className={className} />;
    case 'footprints':
      return <Footprints className={className} />;
    case 'feather':
      return <Feather className={className} />;
    case 'backpack':
      return <Backpack className={className} />;
    default:
      return <CircleDot className={className} />;
  }
}

export default function HomePage() {
  const featuredProducts = products.slice(0, 4);
  const hotProducts = products.filter(p => p.badge === 'hot' || p.badge === 'sale');

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Benefits */}
      <section className="py-8 bg-gradient-to-r from-blue-50 to-orange-50 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-sm">Miễn phí vận chuyển</div>
                <div className="text-xs text-muted-foreground">Đơn từ 500K</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-sm">Hàng chính hãng</div>
                <div className="text-xs text-muted-foreground">100% authentic</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Headphones className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="font-semibold text-sm">Hỗ trợ 24/7</div>
                <div className="text-xs text-muted-foreground">Tư vấn nhiệt tình</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="font-semibold text-sm">Thanh toán an toàn</div>
                <div className="text-xs text-muted-foreground">Đa dạng hình thức</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Danh mục sản phẩm</h2>
            <p className="text-muted-foreground">Khám phá các sản phẩm chất lượng cao</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="group p-6 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 rounded-2xl text-center transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="mb-4 group-hover:scale-110 transition-transform flex justify-center">
                  <CategoryIcon iconName={category.icon} className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.count} sản phẩm</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Sản phẩm nổi bật</h2>
              <p className="text-muted-foreground">Được yêu thích nhất</p>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Xem tất cả
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Link
            href="/products"
            className="mt-8 sm:hidden flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Xem tất cả sản phẩm
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Hot Deals Banner */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-4">
                <Flame className="h-4 w-4" /> Flash Sale - Kết thúc sau 12:00:00
              </div>
              <h2 className="text-4xl font-bold mb-4">Giảm giá đến 50%</h2>
              <p className="text-orange-100 mb-6 max-w-md">
                Săn ngay những deal hot nhất trong tháng. Số lượng có hạn!
              </p>
              <Link
                href="/products?sale=true"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 font-semibold rounded-full hover:bg-gray-100 transition-colors"
              >
                Mua ngay
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <CircleDot className="h-32 w-32 text-white/80" />
          </div>
        </div>
      </section>

      {/* Sale Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Đang giảm giá</h2>
              <p className="text-muted-foreground">Tiết kiệm đến 30%</p>
            </div>
            <Link
              href="/products?sale=true"
              className="hidden sm:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Xem tất cả
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Thương hiệu đối tác</h2>
            <p className="text-muted-foreground">Chỉ bán hàng chính hãng từ các thương hiệu hàng đầu</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {['YONEX', 'VICTOR', 'LI-NING', 'MIZUNO', 'KAWASAKI'].map((brand) => (
              <div
                key={brand}
                className="px-8 py-4 bg-white rounded-xl shadow-sm text-2xl font-bold text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
