'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag, Search, Menu, User } from 'lucide-react';
import { Sidebar } from './Sidebar';

export function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cartCount] = useState(2);

  const navLinks = [
    { href: '/products', label: 'ALL PRODUCT' },
    { href: '/products?category=racket', label: 'VỢT CẦU LÔNG' },
    { href: '/products?category=grip', label: 'QUẤN CÁN' },
    { href: '/products?category=string', label: 'CƯỚC' },
    { href: '/products?category=backpack', label: 'BALO' },
    { href: '/products?category=bag', label: 'TÚI' },
    { href: '/products?sale=true', label: 'SALE OFF' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white">
        {/* Announcement Bar */}
        <div className="bg-black text-white text-xs py-2.5 text-center tracking-widest uppercase">
          Miễn phí vận chuyển cho đơn hàng từ 500.000đ | Hotline: 1900 1234
        </div>

        {/* Main Header */}
        <div className="border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              {/* Left - Menu */}
              <div className="flex items-center gap-4">
                <button
                  className="p-2 hover:opacity-60 transition-opacity focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                  onClick={() => setIsSidebarOpen(true)}
                  aria-label="Mở menu"
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </button>
                <button 
                  className="p-2 hover:opacity-60 transition-opacity hidden sm:block focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                  aria-label="Tìm kiếm"
                >
                  <Search className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {/* Center - Logo */}
              <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                <h1 className="text-2xl font-bold tracking-[0.3em] uppercase">
                  BadmintonPro
                </h1>
              </Link>

              {/* Right - Actions */}
              <div className="flex items-center gap-2">
                <button 
                  className="p-2 hover:opacity-60 transition-opacity sm:hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                  aria-label="Tìm kiếm"
                >
                  <Search className="h-5 w-5" aria-hidden="true" />
                </button>
                <Link 
                  href="/account" 
                  className="p-2 hover:opacity-60 transition-opacity hidden sm:block focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                  aria-label="Tài khoản"
                >
                  <User className="h-5 w-5" aria-hidden="true" />
                </Link>
                <Link 
                  href="/cart" 
                  className="relative p-2 hover:opacity-60 transition-opacity focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                  aria-label={`Giỏ hàng${cartCount > 0 ? `, ${cartCount} sản phẩm` : ''}`}
                >
                  <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-black text-white text-[10px] rounded-full flex items-center justify-center" aria-hidden="true">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex justify-center gap-10 py-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs font-medium tracking-widest uppercase text-gray-800 hover:text-black transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}
