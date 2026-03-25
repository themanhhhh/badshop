'use client';

import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useCollections } from '@/hooks/useApi';
import type { Collection } from '@/lib/types';

export function AthleteSpotlight() {
  const { data: collections, loading } = useCollections();
  
  // Lọc chỉ lấy những collection đang active
  const activeCollections = collections?.filter((c: Collection) => c.is_active) || [];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Main Feature */}
        <div className="grid lg:grid-cols-2 gap-0 mb-16">
          {/* Image Side */}
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[500px] bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-[200px] font-black text-white/5 uppercase tracking-tighter">
                PRO
              </div>
            </div>
            
            {/* Overlay content */}
            <div className="absolute inset-0 flex items-end p-8 lg:p-12">
              <div className="text-white">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-2">
                  Featured
                </p>
                <h3 className="text-3xl lg:text-4xl font-bold uppercase tracking-tight">
                  Athlete Inspired
                </h3>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="flex items-center bg-white p-8 lg:p-16">
            <div className="max-w-md">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">
                Pro Player Collection
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold uppercase tracking-tight mb-6">
                Được lựa chọn bởi
                <br />
                <span className="font-light">các nhà vô địch</span>
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-8">
                Khám phá những cây vợt được các tay vợt hàng đầu thế giới tin dùng. 
                Công nghệ tiên tiến, thiết kế tối ưu cho hiệu suất đỉnh cao.
              </p>
              <Link
                href="/products?collection=pro"
                className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white text-xs uppercase tracking-widest font-medium hover:bg-gray-900 transition-colors"
              >
                Explore Now
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        {/* Athlete Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
             <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {activeCollections.map((athlete: Collection) => (
              <div
                key={athlete.id}
                className="group bg-white p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
              >
                {/* Avatar / Thumbnail */}
                {athlete.thumbnail ? (
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-gray-100">
                    <img 
                      src={athlete.thumbnail} 
                      alt={athlete.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center mb-4">
                    <span className="text-xl font-bold text-slate-400">
                      {athlete.name.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Info */}
                <h3 className="text-lg font-bold uppercase tracking-wide mb-1">
                  {athlete.name}
                </h3>
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-3 block min-h-[16px]">
                  {athlete.country || 'Global'} • {athlete.sport || 'Professional'}
                </p>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-black mb-2">
                    {athlete.achievement}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {athlete.description}
                  </p>
                </div>

                {/* Hover indicator */}
                <Link href={`/products?collection=${athlete.slug}`}>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-xs uppercase tracking-wider text-gray-400">
                      View Collection
                    </span>
                    <ArrowRight className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
