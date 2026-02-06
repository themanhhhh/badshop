'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  LogOut,
  Megaphone,
  ChevronRight,
  ChevronDown,
  Tags,
  Boxes,
  FileText,
  Image,
  Store,
  Languages,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';

interface MenuItem {
  icon: any;
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Bảng điều khiển', href: '/admin' },
  { icon: Users, label: 'Khách hàng', href: '/admin/customers' },
  { 
    icon: ShoppingCart, 
    label: 'Bán hàng', 
    children: [
      { label: 'Đơn hàng', href: '/admin/orders' },
      { label: 'Giỏ hàng', href: '/admin/carts' },
    ]
  },
  { 
    icon: Package, 
    label: 'Sản phẩm', 
    children: [
      { label: 'Tất cả sản phẩm', href: '/admin/products' },
      { label: 'Thêm sản phẩm', href: '/admin/products/new' },
      { label: 'Danh mục', href: '/admin/categories' },
      { label: 'Thương hiệu', href: '/admin/brands' },
    ]
  },
  { icon: Megaphone, label: 'Chiến dịch', href: '/admin/campaigns' },
  { icon: BarChart3, label: 'Báo cáo', href: '/admin/reports' },
];

const settingsItems: MenuItem[] = [
  { icon: Settings, label: 'Cài đặt', href: '/admin/settings' },
  { icon: Languages, label: 'Tiếng Việt', href: '#' },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Sản phẩm']);

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isItemActive = (item: MenuItem): boolean => {
    if (item.href) {
      return pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
    }
    if (item.children) {
      return item.children.some(child => pathname === child.href || pathname.startsWith(child.href));
    }
    return false;
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200 bg-white sticky top-0 h-screen" {...props}>
      {/* Header */}
      <SidebarHeader className="px-4 py-5 border-b border-gray-100">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 font-bold text-sm text-white">
            BP
          </div>
          <span className="text-lg font-semibold text-gray-900 group-data-[collapsible=icon]:hidden">
            Admin Portal
          </span>
        </Link>
      </SidebarHeader>

      {/* Main Menu */}
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 mb-1">
            General
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = isItemActive(item);
                const isExpanded = expandedItems.includes(item.label);
                const hasChildren = item.children && item.children.length > 0;

                return (
                  <SidebarMenuItem key={item.label}>
                    {hasChildren ? (
                      <>
                        <SidebarMenuButton
                          onClick={() => toggleExpand(item.label)}
                          isActive={isActive}
                          className="justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="h-5 w-5" aria-hidden="true" />
                            <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                          </div>
                          <ChevronRight 
                            className={`h-4 w-4 text-gray-400 transition-transform group-data-[collapsible=icon]:hidden ${isExpanded ? 'rotate-90' : ''}`} 
                          />
                        </SidebarMenuButton>
                        {isExpanded && (
                          <div className="ml-8 mt-1 space-y-1 group-data-[collapsible=icon]:hidden">
                            {item.children?.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                                  pathname === child.href || pathname.startsWith(child.href)
                                    ? 'bg-gray-100 text-gray-900 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                        <Link href={item.href!}>
                          <item.icon className="h-5 w-5" aria-hidden="true" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Group */}
        <SidebarGroup className="mt-4">
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <Link href={item.href!}>
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with User Info */}
      <SidebarFooter className="border-t border-gray-100 p-3">
        <div className="flex items-center gap-3 px-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-rose-500 font-semibold text-white text-sm">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="font-medium text-gray-900 truncate text-sm">
              {user?.name || 'Admin User'}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {user?.email || 'admin@example.com'}
            </div>
          </div>
          <button 
            onClick={() => logout()}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded group-data-[collapsible=icon]:hidden"
            title="Đăng xuất"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
