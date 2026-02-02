'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function HeroBanner() {
  return (
    <section className="relative bg-black overflow-hidden">
      {/* Hero Container */}
      <div className="relative h-[85vh] min-h-[600px] max-h-[900px] flex items-center justify-center">
        {/* Background Video/Image Placeholder */}
        <div className="absolute inset-0">
          {/* Animated gradient background simulating video */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Animated particles effect */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500" />
            </div>
          </div>
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <p className="text-xs uppercase tracking-[0.4em] text-white/70 mb-6 font-light">
            New Season 2026
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight uppercase mb-8 text-white">
            BADMINTON
            <br />
            <span className="font-extralight text-white/90">PRO SERIES</span>
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-lg mx-auto mb-10 leading-relaxed font-light">
            Khám phá bộ sưu tập vợt cầu lông cao cấp. 
            Thiết kế đỉnh cao, công nghệ tiên tiến.
          </p>
          
          {/* CTA Button - Yonex Style */}
          <Link
            href="/products"
            className="group inline-flex items-center gap-4 px-10 py-4 border border-white/40 text-white text-xs uppercase tracking-[0.25em] font-medium hover:bg-white hover:text-black transition-all duration-300"
          >
            Shop Now
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent animate-bounce" />
        </div>
      </div>
    </section>
  );
}
