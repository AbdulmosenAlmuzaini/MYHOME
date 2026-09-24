'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Sparkles, Menu, X, Award, FileText, Image as ImageIcon, Send } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide public navbar on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { href: '/', label: 'الرئيسية', icon: Sparkles },
    { href: '/quiz', label: 'ابدئي التحدي', icon: Award },
    { href: '/participation', label: 'مشاركتي', icon: Send },
    { href: '/gallery', label: 'المعرض', icon: ImageIcon },
    { href: '/pledge', label: 'ميثاق الاستدامة', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-emerald-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo / Brand */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group transition-transform active:scale-95"
            aria-label="الرئيسية - كيمياء وطن أخضر"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-saudi-dark flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform duration-300">
              <span className="text-2xl select-none" role="img" aria-label="شعار نبات">🌱</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg sm:text-xl text-saudi-dark tracking-tight leading-snug">
                كيمياء وطن أخضر
              </span>
              <span className="text-xs text-emerald-700 font-medium">
                كيمياء اليوم… استدامة الغد
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20'
                      : 'text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-100' : 'text-emerald-600'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2.5 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="فتح القائمة الرئيسية"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-100 bg-white/95 backdrop-blur-lg px-4 pt-3 pb-5 space-y-1.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                    : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
