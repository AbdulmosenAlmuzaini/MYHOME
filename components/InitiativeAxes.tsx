'use client';

import { Trees, Droplet, Recycle, Sun, Waves, Mountain, Wind, Sparkles } from 'lucide-react';

export default function InitiativeAxes() {
  const axes = [
    {
      id: 1,
      title: 'التشجير ودورة الكربون',
      icon: Trees,
      emoji: '🌳',
      color: 'from-emerald-500 to-green-700',
      border: 'border-emerald-200',
      description: 'دور البناء الضوئي والتفاعلات الكيميائية الحيوية في امتصاص غاز ثاني أكسيد الكربون وإطلاق الأكسجين وتثبيت الكربون في التربة.',
    },
    {
      id: 2,
      title: 'استدامة المياه',
      icon: Droplet,
      emoji: '💧',
      color: 'from-sky-500 to-blue-700',
      border: 'border-sky-200',
      description: 'كيمياء تنقية المياه ومعالجة مياه الصرف الصحي وتحلية مياه البحر بتقنيات الأغشية وتخفيض الهدر المائي الوطني.',
    },
    {
      id: 3,
      title: 'إعادة التدوير والاقتصاد الدائري',
      icon: Recycle,
      emoji: '♻️',
      color: 'from-teal-500 to-emerald-700',
      border: 'border-teal-200',
      description: 'التحلل والتركيب الكيميائي للبوليمرات والبلاستيك والمعادن، واسترجاع المواد الخام لتقليل النفايات وإغلاق دورة الموارد.',
    },
    {
      id: 4,
      title: 'الطاقة النظيفة',
      icon: Sun,
      emoji: '☀️',
      color: 'from-amber-500 to-orange-600',
      border: 'border-amber-200',
      description: 'الخلايا الكهروضوئية، وتخزين الطاقة الكهروكيميائية في البطاريات، وإنتاج الهيدروجين الأخضر كوقود مستقبلي واعد.',
    },
    {
      id: 5,
      title: 'حماية البحار',
      icon: Waves,
      emoji: '🌊',
      color: 'from-cyan-500 to-blue-800',
      border: 'border-cyan-200',
      description: 'الاتزان الكيميائي لملوحة مياه البحر وحماية الشعب المرجانية في البحر الأحمر والخليج العربي من التلوث والتغير المناخي.',
    },
    {
      id: 6,
      title: 'مكافحة التصحر',
      icon: Mountain,
      emoji: '🏜️',
      color: 'from-yellow-600 to-amber-800',
      border: 'border-yellow-200',
      description: 'كيمياء التربة، وحفظ الرطوبة واستصلاح الأراضي الجافة بزراعة النباتات البرية المحلية وتثبيت الرمال المتحركة.',
    },
    {
      id: 7,
      title: 'خفض الانبعاثات',
      icon: Wind,
      emoji: '🌍',
      color: 'from-emerald-600 to-teal-800',
      border: 'border-emerald-300',
      description: 'تقنيات احتجاز الكربون واستخدامه وتخزينه (CCUS)، ورفع كفاءة الطاقة للوصول إلى الحياد الصفري للانبعاثات.',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 via-emerald-50/40 to-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Concept Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>رؤية ورسالة المبادرة</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-saudi-dark mb-6 tracking-tight">
            فكرة المبادرة
          </h2>
          
          <div className="p-6 sm:p-8 rounded-3xl bg-white shadow-xl shadow-emerald-950/5 border border-emerald-100/80 relative">
            <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-emerald-600 text-white p-2 rounded-2xl shadow-md">
              <span className="text-xl">🌿</span>
            </div>
            <p className="text-lg sm:text-xl text-slate-700 leading-relaxed font-medium mt-2">
              مبادرة تعليمية تفاعلية تربط مفاهيم الكيمياء بالحفاظ على البيئة والثروات الطبيعية في وطني، وتعرّف الطالبات بالجهود الوطنية في الاستدامة من خلال تحديات وأسئلة تفاعلية ومشاركات حياتية.
            </p>
          </div>
        </div>

        {/* Axes Title */}
        <div className="text-center mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">
            محاور المبادرة السبعة 🌱
          </h3>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            سبعة مسارات تكاملية تجمع بين العلم الكيميائي والتطبيق الميداني لحماية موارد الوطن
          </p>
        </div>

        {/* 7 Axes Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {axes.map((axis, index) => {
            const Icon = axis.icon;
            return (
              <div
                key={axis.id}
                className={`glass-card p-6 rounded-3xl border ${axis.border} shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${
                  index === 6 ? 'md:col-span-2 lg:col-span-3 xl:col-span-1' : ''
                }`}
              >
                {/* Decorative Top Gradient Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${axis.color}`} />
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl filter drop-shadow-sm">{axis.emoji}</span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      محور {axis.id}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">
                    {axis.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {axis.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  <Icon className="w-4 h-4 text-emerald-600" />
                  <span>تطبيق كيميائي وميداني</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
