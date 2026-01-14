'use client';

import Link from 'next/link';
import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Instagram, Facebook, Youtube } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  label: string;
  href: string;
  highlight?: boolean;
  submenu?: { label: string; href: string }[];
}

const menuItems: MenuItem[] = [
  { 
    label: 'ALL PRODUCT', 
    href: '/products',
  },
  { 
    label: 'VỢT CẦU LÔNG', 
    href: '/products?category=racket',
    submenu: [
      { label: 'Tất cả vợt', href: '/products?category=racket' },
      { label: 'Yonex', href: '/products?category=racket&brand=yonex' },
      { label: 'Victor', href: '/products?category=racket&brand=victor' },
      { label: 'Li-Ning', href: '/products?category=racket&brand=lining' },
      { label: 'Mizuno', href: '/products?category=racket&brand=mizuno' },
    ]
  },
  { 
    label: 'QUẤN CÁN', 
    href: '/products?category=grip',
    submenu: [
      { label: 'Tất cả quấn cán', href: '/products?category=grip' },
      { label: 'Yonex', href: '/products?category=grip&brand=yonex' },
      { label: 'Victor', href: '/products?category=grip&brand=victor' },
      { label: 'Li-Ning', href: '/products?category=grip&brand=lining' },
      { label: 'Kawasaki', href: '/products?category=grip&brand=kawasaki' },
    ]
  },
  { 
    label: 'CƯỚC', 
    href: '/products?category=string',
    submenu: [
      { label: 'Tất cả cước', href: '/products?category=string' },
      { label: 'Yonex', href: '/products?category=string&brand=yonex' },
      { label: 'Victor', href: '/products?category=string&brand=victor' },
      { label: 'Li-Ning', href: '/products?category=string&brand=lining' },
      { label: 'Mizuno', href: '/products?category=string&brand=mizuno' },
    ]
  },
  { 
    label: 'BALO', 
    href: '/products?category=backpack',
    submenu: [
      { label: 'Tất cả balo', href: '/products?category=backpack' },
      { label: 'Yonex', href: '/products?category=backpack&brand=yonex' },
      { label: 'Victor', href: '/products?category=backpack&brand=victor' },
      { label: 'Li-Ning', href: '/products?category=backpack&brand=lining' },
    ]
  },
  { 
    label: 'TÚI', 
    href: '/products?category=bag',
    submenu: [
      { label: 'Tất cả túi', href: '/products?category=bag' },
      { label: 'Yonex', href: '/products?category=bag&brand=yonex' },
      { label: 'Victor', href: '/products?category=bag&brand=victor' },
      { label: 'Li-Ning', href: '/products?category=bag&brand=lining' },
    ]
  },
  { 
    label: 'SALE OFF', 
    href: '/products?sale=true',
    highlight: true,
  },
];

const bottomLinks = [
  { label: 'Về chúng tôi', href: '/about' },
  { label: 'Liên hệ', href: '/contact' },
  { label: 'Chính sách đổi trả', href: '/policy' },
  { label: 'Câu hỏi thường gặp', href: '/faq' },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [activeSubmenu, setActiveSubmenu] = useState<MenuItem | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleMenuClick = (item: MenuItem, e: React.MouseEvent) => {
    if (item.submenu) {
      e.preventDefault();
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveSubmenu(item);
        setIsTransitioning(false);
      }, 150);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSubmenu(null);
      setIsTransitioning(false);
    }, 150);
  };

  const handleClose = () => {
    setActiveSubmenu(null);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
      />

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-[400px] bg-white z-50 flex flex-col transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-5 border-b border-gray-100 shrink-0">
          {activeSubmenu ? (
            <>
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 text-sm hover:opacity-60 transition-opacity"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm font-medium uppercase tracking-widest">
                {activeSubmenu.label}
              </span>
              <button 
                onClick={handleClose}
                className="p-1 hover:opacity-60 transition-opacity"
              >
                <X className="h-5 w-5" />
              </button>
            </>
          ) : (
            <>
              <span className="text-sm font-medium uppercase tracking-widest">
                Danh mục
              </span>
              <button 
                onClick={handleClose}
                className="p-1 hover:opacity-60 transition-opacity"
              >
                <X className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Menu Content - scrollable middle area */}
        <div className="relative flex-1 overflow-hidden">
          {/* Main Menu */}
          <div 
            className={`absolute inset-0 transition-transform duration-200 ease-out overflow-y-auto ${
              activeSubmenu 
                ? '-translate-x-full' 
                : isTransitioning 
                  ? '-translate-x-4 opacity-80' 
                  : 'translate-x-0'
            }`}
          >
            <nav className="py-2">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleMenuClick(item, e)}
                  className={`flex items-center justify-between px-5 py-4 text-sm uppercase tracking-widest transition-colors hover:bg-gray-50 ${
                    item.highlight ? 'text-red-600 font-semibold' : 'font-medium'
                  }`}
                >
                  {item.label}
                  {item.submenu && <ChevronRight className="h-4 w-4 text-gray-400" />}
                </Link>
              ))}
            </nav>
          </div>

          {/* Submenu (Drill-down) */}
          <div 
            className={`absolute inset-0 transition-transform duration-200 ease-out overflow-y-auto ${
              activeSubmenu 
                ? 'translate-x-0' 
                : isTransitioning 
                  ? 'translate-x-4 opacity-80' 
                  : 'translate-x-full'
            }`}
          >
            {activeSubmenu && (
              <nav className="py-2">
                {activeSubmenu.submenu?.map((subItem) => (
                  <Link
                    key={subItem.label}
                    href={subItem.href}
                    onClick={handleClose}
                    className="block px-5 py-4 text-sm uppercase tracking-widest font-medium transition-colors hover:bg-gray-50"
                  >
                    {subItem.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </div>

        {/* Bottom Links - Fixed at bottom */}
        <div className="shrink-0 border-t border-gray-100 bg-gray-50">
          {bottomLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={handleClose}
              className="block px-5 py-3 text-xs text-gray-500 hover:text-black transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {/* Social Links */}
          <div className="flex gap-5 px-5 py-4 border-t border-gray-100">
            <a href="#" className="text-gray-400 hover:text-black transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-black transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-black transition-colors">
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
