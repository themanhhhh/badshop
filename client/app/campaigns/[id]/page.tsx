'use client';

import { use } from 'react';
import Link from 'next/link';
import { Calendar, ChevronLeft, Loader2, Package, Tag, Zap } from 'lucide-react';
import { Header } from '@/components/shop/Header';
import { Footer } from '@/components/shop/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { Button } from '@/components/ui/button';
import { useCampaign } from '@/hooks/useApi';
import { mapCampaignProductsForDisplay } from '@/lib/productMapper';

const typeLabels: Record<string, string> = {
  collection: 'Bộ sưu tập',
  flash_sale: 'Flash Sale',
  promotion: 'Khuyến mãi',
  seasonal: 'Theo mùa',
};

const typeIcons: Record<string, typeof Tag> = {
  collection: Package,
  flash_sale: Zap,
  promotion: Tag,
  seasonal: Calendar,
};

function formatDate(value?: string) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('vi-VN');
}

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: campaign, loading, error } = useCampaign(id);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">Đang tải chiến dịch...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !campaign) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold mb-2">Không tìm thấy chiến dịch</h1>
            <p className="text-muted-foreground mb-6">Chiến dịch này không tồn tại hoặc đã ngừng hiển thị.</p>
            
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const Icon = typeIcons[campaign.type] || Tag;
  const products = mapCampaignProductsForDisplay(campaign.products || [], campaign);
  const dateRange = [formatDate(campaign.start_date), formatDate(campaign.end_date)].filter(Boolean).join(' - ');

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="border-b border-gray-100">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">Trang chủ</Link>
              <span>/</span>
              <span className="text-foreground font-medium truncate">{campaign.title || campaign.name}</span>
            </nav>
          </div>
        </div>

        <section className="relative overflow-hidden bg-gray-950 text-white">
          {campaign.image_url && (
            <img
              src={campaign.image_url}
              alt={campaign.title || campaign.name}
              className="absolute inset-0 h-full w-full object-cover opacity-45"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/25" />
          <div className="container relative mx-auto px-4 py-16 sm:py-20 lg:py-28">
           

            <div className="max-w-3xl">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black">
                  <Icon className="h-4 w-4" />
                  {typeLabels[campaign.type] || 'Chiến dịch'}
                </span>
                {campaign.discount_value > 0 && (
                  <span className="rounded-full bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
                    Giảm {campaign.discount_type === 'percentage' ? `${campaign.discount_value}%` : `${Number(campaign.discount_value).toLocaleString('vi-VN')}đ`}
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                {campaign.title || campaign.name}
              </h1>
              {campaign.description && (
                <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                  {campaign.description}
                </p>
              )}
              {dateRange && (
                <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/85 backdrop-blur">
                  <Calendar className="h-4 w-4" />
                  {dateRange}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">Sản phẩm chiến dịch</p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">{products.length} sản phẩm</h2>
            </div>
            <Button variant="outline" asChild>
              <Link href="/products">Xem tất cả sản phẩm</Link>
            </Button>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
              <Package className="mx-auto h-10 w-10 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold">Chưa có sản phẩm trong chiến dịch</h3>
              <p className="mt-2 text-sm text-muted-foreground">Vui lòng quay lại sau hoặc xem thêm các sản phẩm khác của cửa hàng.</p>
              <Button className="mt-6" asChild>
                <Link href="/products">Khám phá sản phẩm</Link>
              </Button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
