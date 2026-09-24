'use client';

import { usePathname } from 'next/navigation';
import { Heart, Leaf, FlaskConical, Globe } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="relative bg-gradient-to-b from-saudi-dark to-[#032e23] text-white pt-16 pb-12 overflow-hidden border-t-4 border-emerald-500/40">
      {/* Subtle decorative background circles */}
      <div className="absolute top-0 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-saudi-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-emerald-800/60">
          
          {/* Initiative Identity */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-emerald-100">كيمياء وطن أخضر</h3>
                <p className="text-xs text-emerald-300/90 font-medium">كيمياء اليوم… استدامة الغد 🌱</p>
              </div>
            </div>
            <p className="text-sm text-emerald-100/80 leading-relaxed max-w-lg">
              مبادرة تعليمية تفاعلية تربط مفاهيم الكيمياء بالحفاظ على البيئة والثروات الطبيعية في وطننا الغالي، وتعزز الوعي البيئي والمسؤولية المجتمعية لدى طالبات المرحلة الثانوية.
            </p>
            <div className="flex items-center gap-4 text-xs text-emerald-300/80 pt-1">
              <span className="inline-flex items-center gap-1 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-700/50">
                <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
                كيمياء خضراء
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-700/50">
                <Globe className="w-3.5 h-3.5 text-saudi-gold" />
                استدامة وطنية
              </span>
            </div>
          </div>

          {/* Acknowledgments & Supervision */}
          <div className="md:col-span-6 bg-emerald-950/50 p-6 rounded-2xl border border-emerald-700/40 backdrop-blur-sm space-y-5">
            <h4 className="text-base font-bold text-amber-300 flex items-center gap-2">
              <span>✨</span>
              <span>فريق الإشراف والقيادة</span>
            </h4>
            
            <div className="space-y-4 text-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-emerald-800/50">
                <span className="text-emerald-200 font-semibold">إعداد المعلمتين:</span>
                <span className="text-white font-bold tracking-wide">جميلة الصاعدي ، صباح الأحمدي</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-emerald-200 font-semibold">مديرة الثانوية السادسة والثلاثون:</span>
                <span className="text-amber-200 font-bold">زينب الأمين</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200/70 text-center sm:text-right">
          <p>
            جميع الحقوق محفوظة © مبادرة كيمياء وطن أخضر {new Date().getFullYear()}
          </p>
          <p className="flex items-center justify-center gap-1.5 font-medium text-emerald-300">
            <span>وطننا أمانة… واستدامته مسؤوليتنا</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
}
