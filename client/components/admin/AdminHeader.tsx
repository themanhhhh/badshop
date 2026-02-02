'use client';

import { Bell, Search } from 'lucide-react';
import { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

export function AdminHeader() {
  const [notifications] = useState(5);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background px-6">
      {/* Sidebar trigger */}
      <SidebarTrigger className="-ml-2" />
      <Separator orientation="vertical" className="h-6" />

      {/* Title */}
      <div className="hidden sm:block flex-1">
        <h1 className="text-lg font-semibold text-foreground">Xin chào, Admin! 👋</h1>
        <p className="text-sm text-muted-foreground">Đây là tổng quan cửa hàng của bạn</p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Search */}
        <div className="relative hidden md:block">
          <label htmlFor="admin-search" className="sr-only">Tìm kiếm</label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <input
            id="admin-search"
            type="search"
            name="search"
            autoComplete="off"
            placeholder="Tìm kiếm…"
            className="w-64 h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent transition-all"
          />
        </div>

        {/* Notifications */}
        <button 
          className="relative p-2 hover:bg-accent rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={`Thông báo${notifications > 0 ? `, ${notifications} thông báo mới` : ''}`}
        >
          <Bell className="h-5 w-5 text-foreground" aria-hidden="true" />
          {notifications > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-medium" aria-hidden="true">
              {notifications}
            </span>
          )}
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-3 border-l border-border">
          <div className="hidden sm:block text-right">
            <div className="text-sm font-medium">Admin User</div>
            <div className="text-xs text-muted-foreground">Super Admin</div>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
