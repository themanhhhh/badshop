import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BadmintonPro - Cửa hàng cầu lông chính hãng",
  description: "Mua sắm vợt cầu lông, giày, phụ kiện cầu lông chính hãng từ các thương hiệu hàng đầu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              <Toaster
                position="top-right"
                closeButton
                toastOptions={{
                  unstyled: false,
                  classNames: {
                    toast:
                      'group border border-black/10 bg-white text-black shadow-lg dark:border-white/10 dark:bg-black dark:text-white',
                    title: 'text-sm font-medium text-black dark:text-white',
                    description: 'text-sm text-black/70 dark:text-white/70',
                    actionButton:
                      'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-slate-200',
                    cancelButton:
                      'border border-black/10 bg-white text-black hover:bg-gray-100 dark:border-white/10 dark:bg-black dark:text-white dark:hover:bg-slate-900',
                    closeButton:
                      'border border-black/10 bg-white text-black hover:bg-gray-100 dark:border-white/10 dark:bg-black dark:text-white dark:hover:bg-slate-900',
                    success: '!border-black/10 !bg-white !text-black dark:!border-white/10 dark:!bg-black dark:!text-white',
                    error: '!border-black/10 !bg-white !text-black dark:!border-white/10 dark:!bg-black dark:!text-white',
                    warning: '!border-black/10 !bg-white !text-black dark:!border-white/10 dark:!bg-black dark:!text-white',
                    info: '!border-black/10 !bg-white !text-black dark:!border-white/10 dark:!bg-black dark:!text-white',
                  },
                }}
              />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
