import type { Metadata, Viewport } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#047857',
};

export const metadata: Metadata = {
  title: 'كيمياء وطن أخضر | كيمياء اليوم… استدامة الغد',
  description: 'مبادرة تعليمية تفاعلية تربط الكيمياء بالاستدامة والمحافظة على البيئة وموارد الوطن.',
  keywords: [
    'كيمياء وطن أخضر',
    'الاستدامة',
    'السعودية الخضراء',
    'كيمياء',
    'تعليم ثانوي',
    'إعادة التدوير',
    'الطاقة المتجددة',
  ],
  authors: [{ name: 'جميلة الصاعدي و صباح الأحمدي' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="min-h-screen flex flex-col font-cairo bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
