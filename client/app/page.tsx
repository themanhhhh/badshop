'use client';

import { Header } from '@/components/shop/Header';
import { Footer } from '@/components/shop/Footer';
import { HeroBanner } from '@/components/shop/HeroBanner';
import { CategoryGrid } from '@/components/shop/CategoryGrid';
import { AthleteSpotlight } from '@/components/shop/AthleteSpotlight';
import { TechShowcase } from '@/components/shop/TechShowcase';
import { ProductCarousel } from '@/components/shop/ProductCarousel';
import { products } from '@/lib/mockData';

export default function HomePage() {
  const newProducts = products.filter(p => p.badge === 'new' || !p.badge).slice(0, 8);
  const bestProducts = products.filter(p => p.badge === 'hot' || p.rating >= 4.7).slice(0, 8);
  const saleProducts = products.filter(p => p.badge === 'sale' || p.originalPrice).slice(0, 8);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Banner - Full screen video/image style */}
        <HeroBanner />

        {/* Shop by Category - 3 column grid */}
        <CategoryGrid />

        {/* New Arrivals Carousel */}
        <ProductCarousel 
          products={newProducts}
          title="New Arrivals"
          subtitle="Mới nhất"
          viewAllHref="/products"
        />

        {/* Pro Player / Athlete Spotlight */}
        <AthleteSpotlight />

        {/* Technology Showcase */}
        <TechShowcase />

        {/* Best Sellers Carousel */}
        <ProductCarousel 
          products={bestProducts}
          title="Best Sellers"
          subtitle="Bán chạy nhất"
          viewAllHref="/products?sort=bestselling"
        />

        {/* Sale Section */}
        {saleProducts.length > 0 && (
          <section className="py-20 bg-white border-t border-gray-100">
            <div className="container mx-auto px-4">
              <div className="text-center mb-4">
                <span className="inline-block px-4 py-1 bg-black text-white text-xs uppercase tracking-widest font-medium mb-4">
                  Limited Time
                </span>
              </div>
              <ProductCarousel 
                products={saleProducts}
                title="Sale Off"
                subtitle="Đang giảm giá"
                viewAllHref="/products?sale=true"
              />
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}