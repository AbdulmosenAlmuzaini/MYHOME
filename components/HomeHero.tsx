'use client';

import Link from 'next/link';
import { Sparkles, Award, Send, Image as ImageIcon, FileText, ArrowLeft, Atom, Droplets, Sun, Trees } from 'lucide-react';

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-saudi-dark via-[#046347] to-[#023b2c] text-white py-20 sm:py-28 lg:py-32">
      
      {/* Animated SVG Chemistry & Nature Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        {/* Floating Molecule 1 */}
        <div className="absolute top-12 left-10 animate-float-slow">
          <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="14" fill="#10B981" />
            <circle cx="20" cy="25" r="9" fill="#F59E0B" />
            <circle cx="80" cy="25" r="9" fill="#34D399" />
            <circle cx="50" cy="85" r="9" fill="#6EE7B7" />
            <line x1="50" y1="50" x2="20" y2="25" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="3 3" />
            <line x1="50" y1="50" x2="80" y2="25" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="3 3" />
            <line x1="50" y1="50" x2="50" y2="85" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="3 3" />
          </svg>
        </div>

        {/* Floating Atom 2 */}
        <div className="absolute bottom-16 right-12 animate-spin-slow">
          <svg width="140" height="140" viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-emerald-300/40">
            <ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(30 50 50)" strokeWidth="1.5" />
            <ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(90 50 50)" strokeWidth="1.5" />
            <ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(150 50 50)" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="7" fill="#F59E0B" />
          </svg>
        </div>

        {/* Floating Organic Leaves Particles */}
        <div className="absolute top-1/3 right-1/4 animate-float-medium">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="1.5">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
        </div>

        <div className="absolute bottom-1/4 left-1/4 animate-float-slow">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.5">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        </div>
      </div>

      {/* Decorative Blur Orbs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-800/80 border border-emerald-400/40 text-emerald-200 text-sm font-semibold mb-6 shadow-inner animate-pulse-slow">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>مبادرة مدرسية تفاعلية لطالبات المرحلة الثانوية</span>
          <Sparkles className="w-4 h-4 text-saudi-gold" />
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 drop-shadow-sm leading-tight">
          <span>🇸🇦 </span>
          <span className="bg-gradient-to-r from-emerald-100 via-white to-emerald-200 bg-clip-text text-transparent">
            كيمياء وطن أخضر
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-300 mb-8 max-w-3xl mx-auto tracking-wide">
          كيمياء اليوم… استدامة الغد 🌱
        </p>

        {/* Brief Intro */}
        <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          رحلة علمية شيقة تربط أسرار التفاعلات الكيميائية ومفاهيم الطاقة والمادة بحماية بيئة وطننا واستدامة موارده الطبيعية نحو مستقبل أخضر مشرق.
        </p>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-12">
          <div className="bg-emerald-900/40 border border-emerald-700/50 rounded-2xl p-3 backdrop-blur-sm flex flex-col items-center">
            <Atom className="w-6 h-6 text-emerald-300 mb-1" />
            <span className="text-xs font-semibold text-emerald-100">كيمياء تطبيقية</span>
          </div>
          <div className="bg-emerald-900/40 border border-emerald-700/50 rounded-2xl p-3 backdrop-blur-sm flex flex-col items-center">
            <Trees className="w-6 h-6 text-emerald-300 mb-1" />
            <span className="text-xs font-semibold text-emerald-100">استدامة بيئية</span>
          </div>
          <div className="bg-emerald-900/40 border border-emerald-700/50 rounded-2xl p-3 backdrop-blur-sm flex flex-col items-center">
            <Droplets className="w-6 h-6 text-emerald-300 mb-1" />
            <span className="text-xs font-semibold text-emerald-100">ترشيد الموارد</span>
          </div>
          <div className="bg-emerald-900/40 border border-emerald-700/50 rounded-2xl p-3 backdrop-blur-sm flex flex-col items-center">
            <Sun className="w-6 h-6 text-saudi-gold mb-1" />
            <span className="text-xs font-semibold text-emerald-100">طاقة متجددة</span>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/quiz"
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-lg shadow-lg shadow-amber-500/30 transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0"
          >
            <Award className="w-6 h-6 text-slate-950" />
            <span>ابدئي التحدي الآن</span>
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <Link
            href="/participation"
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-emerald-600/80 hover:bg-emerald-600 text-white font-bold text-lg border border-emerald-400/50 backdrop-blur-md shadow-lg shadow-emerald-900/30 transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0"
          >
            <Send className="w-6 h-6 text-emerald-200" />
            <span>شاركينا إنجازكِ</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
