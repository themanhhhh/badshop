'use client';

import { AppSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';

function AdminContent({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar();
  
  return (
    <div
      className="flex-1 flex flex-col min-h-screen transition-[margin-left] duration-200 ease-linear"
      style={{
        marginLeft: state === 'collapsed' ? 'calc(var(--sidebar-width-icon) - 1.5rem)' : 'calc(var(--sidebar-width) - 1.5rem)',
      }}
    >
      <AdminHeader />
      <main className="flex-1 p-6 bg-muted/30">{children}</main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <AdminContent>{children}</AdminContent>
    </SidebarProvider>
  );
}
