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
    href: '/products?category=vot-cau-long',
    submenu: [
      { label: 'Tất cả vợt', href: '/products?category=vot-cau-long' },
      { label: 'Yonex', href: '/products?category=vot-cau-long&brand=yonex' },
      { label: 'Victor', href: '/products?category=vot-cau-long&brand=victor' },
      { label: 'Li-Ning', href: '/products?category=vot-cau-long&brand=lining' },
      { label: 'Mizuno', href: '/products?category=vot-cau-long&brand=mizuno' },
    ]
  },
  {
    label: 'GIÀY CẦU LÔNG',
    href: '/products?category=giay-cau-long',
    submenu: [
      { label: 'Tất cả giày', href: '/products?category=giay-cau-long' },
      { label: 'Yonex', href: '/products?category=giay-cau-long&brand=yonex' },
      { label: 'Victor', href: '/products?category=giay-cau-long&brand=victor' },
      { label: 'Li-Ning', href: '/products?category=giay-cau-long&brand=lining' },
      { label: 'Mizuno', href: '/products?category=giay-cau-long&brand=mizuno' },
    ]
  },
  {
    label: 'PHỤ KIỆN',
    href: '/products?category=phu-kien',
    submenu: [
      { label: 'Tất cả phụ kiện', href: '/products?category=phu-kien' },
      { label: 'Yonex', href: '/products?category=phu-kien&brand=yonex' },
      { label: 'Victor', href: '/products?category=phu-kien&brand=victor' },
      { label: 'Li-Ning', href: '/products?category=phu-kien&brand=lining' },
      { label: 'Mizuno', href: '/products?category=phu-kien&brand=mizuno' },
    ]
  },
  {
    label: 'TÚI ĐỰNG VỢT',
    href: '/products?category=tui-dung-vot',
    submenu: [
      { label: 'Tất cả túi', href: '/products?category=tui-dung-vot' },
      { label: 'Yonex', href: '/products?category=tui-dung-vot&brand=yonex' },
      { label: 'Victor', href: '/products?category=tui-dung-vot&brand=victor' },
      { label: 'Li-Ning', href: '/products?category=tui-dung-vot&brand=lining' },
    ]
  },
  {
    label: 'CẦU LÔNG',
    href: '/products?category=cau-long',
    submenu: [
      { label: 'Tất cả cầu lông', href: '/products?category=cau-long' },
      { label: 'Yonex', href: '/products?category=cau-long&brand=yonex' },
      { label: 'Victor', href: '/products?category=cau-long&brand=victor' },
      { label: 'Li-Ning', href: '/products?category=cau-long&brand=lining' },
    ]
  },
  {
    label: 'ÁO CẦU LÔNG',
    href: '/products?category=ao-cau-long',
  },
  {
    label: 'XEM BLOG',
    href: '/blog',
  },
  {
    label: 'SALE OFF',
    href: '/products?sale=true',
    highlight: true,
  },
];

const bottomLinks = [
  { label: 'Blog', href: '/blog' },
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
      {/* Backdrop with blur */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 left-0 h-full w-[300px] max-w-[85vw] bg-white z-50 flex flex-col shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng"
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-gray-100 shrink-0">
          {activeSubmenu ? (
            <>
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 text-sm font-medium hover:opacity-60 transition-opacity min-h-[44px] min-w-[44px] -ml-2 px-2"
                aria-label="Quay lại"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm font-semibold uppercase tracking-widest truncate px-2">
                {activeSubmenu.label}
              </span>
              <button 
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px]"
                aria-label="Đóng menu"
              >
                <X className="h-5 w-5" />
              </button>
            </>
          ) : (
            <>
              <span className="text-sm font-semibold uppercase tracking-widest">
                Danh mục
              </span>
              <button 
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px]"
                aria-label="Đóng menu"
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
                  className={`flex items-center justify-between px-5 py-4 text-sm uppercase tracking-widest transition-colors hover:bg-gray-50 min-h-[52px] ${
                    item.highlight ? 'text-red-600 font-semibold' : 'font-medium text-gray-800'
                  }`}
                >
                  {item.label}
                  {item.submenu && <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />}
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
                    className="block px-5 py-4 text-sm uppercase tracking-widest font-medium transition-colors hover:bg-gray-50 min-h-[52px] text-gray-700"
                  >
                    {subItem.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </div>

      </div>
    </>
  );
}
