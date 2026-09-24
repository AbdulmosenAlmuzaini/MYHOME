'use client';

import Link from 'next/link';
import { Award, Send, Image as ImageIcon, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function HomeActionCards() {
  const actions = [
    {
      title: 'ابدئي التحدي',
      emoji: '🧪',
      subtitle: 'اختبري معلوماتكِ الكيميائية والبيئية عبر 7 أسئلة تفاعلية ذكية واحفظي تقدمكِ.',
      href: '/quiz',
      btnText: 'خوض التحدي',
      icon: Award,
      badge: 'مسابقة تفاعلية',
      bgGradient: 'from-emerald-600 to-teal-800',
      accentColor: 'text-amber-300',
      borderHover: 'hover:border-emerald-400',
      points: ['7 أسئلة مطابقة للمحاور', 'تغذية راجعة فورية', 'شهادة ميثاق بعد الانتهاء'],
    },
    {
      title: 'مشاركتي',
      emoji: '🌱',
      subtitle: 'شاركينا إنجازكِ أو فكرتكِ المبتكرة لخدمة الاستدامة وحماية البيئة مع رفع الصور والمستندات.',
      href: '/participation',
      btnText: 'إرسال مشاركة',
      icon: Send,
      badge: 'سجلي أثركِ',
      bgGradient: 'from-saudi-dark to-emerald-900',
      accentColor: 'text-emerald-300',
      borderHover: 'hover:border-emerald-500',
      points: ['رفع الملفات والصور', 'مراجعة واعتماد المشرفات', 'عرض في المعرض الوطني'],
    },
    {
      title: 'المعرض',
      emoji: '🖼️',
      subtitle: 'تصفحي إبداعات ومشاركات زميلاتكِ المعتمدة في مجالات الكيمياء الخضراء والاستدامة.',
      href: '/gallery',
      btnText: 'تصفح المعرض',
      icon: ImageIcon,
      badge: 'معرض الإنجازات',
      bgGradient: 'from-teal-800 to-emerald-950',
      accentColor: 'text-teal-200',
      borderHover: 'hover:border-teal-400',
      points: ['مشاركات معتمدة وموثقة', 'تصفية ذكية حسب المجال', 'إلهام وتبادل أفكار'],
    },
    {
      title: 'ميثاق الاستدامة',
      emoji: '📜',
      subtitle: 'وقّعي واطبعي وثيقة العهد البيئي باسمكِ لتكوني كيميائية واعية ومسؤولة تصنع الأثر المستدام.',
      href: '/pledge',
      btnText: 'عرض وطباعة الميثاق',
      icon: FileText,
      badge: 'وثيقة التعهد',
      bgGradient: 'from-amber-700 to-emerald-900',
      accentColor: 'text-amber-200',
      borderHover: 'hover:border-amber-400',
      points: ['توليد الاسم تلقائياً', 'تصميم A4 مخصص للطباعة', 'التزام بيئي مستمر'],
    },
  ];

  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-3">
            <span>🚀 بوابتكِ للمشاركة</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-saudi-dark mb-4">
            أقسام المبادرة الرئيسية
          </h2>
          <p className="text-slate-600 text-base">
            اختاري مساركِ التفاعلي واكتشفي كيف تصنعين فارقاً حقيقياً في مستقبل بيئة وطننا الغالي
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {actions.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="group relative rounded-3xl bg-slate-900 text-white overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between p-8 sm:p-10 border border-slate-800"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-90 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Decorative glow in corner */}
                <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                      <span>{card.emoji}</span>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 border border-white/20 backdrop-blur-sm text-white">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold mb-3 text-white flex items-center gap-2">
                    <span>{card.title}</span>
                  </h3>

                  <p className="text-slate-100/90 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                    {card.subtitle}
                  </p>

                  <ul className="space-y-2.5 mb-8">
                    {card.points.map((point) => (
                      <li key={point} className="flex items-center gap-2 text-xs sm:text-sm text-emerald-100/90">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative z-10 pt-4 border-t border-white/10">
                  <Link
                    href={card.href}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-white text-slate-900 font-bold text-base hover:bg-emerald-50 hover:text-emerald-900 transition-all duration-200 shadow-md group-hover:shadow-lg active:scale-95"
                  >
                    <span>{card.btnText}</span>
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
