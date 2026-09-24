'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Printer, Home, Sparkles, Check, FileCheck, Edit3, Eraser } from 'lucide-react';

export default function Pledge() {
  const [studentName, setStudentName] = useState('طالبة واعية ومستدامة');
  const [isEditingName, setIsEditingName] = useState(false);
  const [todayDate, setTodayDate] = useState('');
  
  // Interactive pledges checkboxes
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
  });

  const pledgeCommitments = [
    'أحافظ على الماء وأتجنب هدره.',
    'أساهم في تقليل النفايات وإعادة استخدام ما يمكن منها.',
    'أحرص على فرز المخلفات وإعادة التدوير.',
    'أعتني بالنباتات والمساحات الخضراء.',
    'أستخدم الطاقة والموارد بمسؤولية.',
  ];

  // Signature canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    // Load student name from local storage
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('kimia_student_name');
      if (savedName && savedName.trim()) {
        setStudentName(savedName.trim());
      }

      // Format Arabic date
      const date = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      setTodayDate(date.toLocaleDateString('ar-SA', options));
    }
  }, []);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleNameSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingName(false);
    if (typeof window !== 'undefined' && studentName.trim()) {
      localStorage.setItem('kimia_student_name', studentName.trim());
    }
  };

  const toggleCheck = (index: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasSignature(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#064e3b';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Screen Action Bar (Hidden in Print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <FileCheck className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-semibold">وثيقة رسمية قابلة للطباعة والتوقيع</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-700/20 transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>🖨️ طباعة الميثاق</span>
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>↻ العودة إلى الرئيسية</span>
          </Link>
        </div>
      </div>

      {/* Main A4 Pledge Certificate Container */}
      <div className="print-only-container bg-white rounded-3xl p-8 sm:p-14 shadow-2xl border-4 border-emerald-800/80 relative overflow-hidden">
        
        {/* Certificate Decorative Border */}
        <div className="absolute inset-2 border-2 border-dashed border-emerald-600/40 rounded-2xl pointer-events-none" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-saudi-gold pointer-events-none" />
        <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-saudi-gold pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-saudi-gold pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-saudi-gold pointer-events-none" />

        {/* Certificate Header */}
        <div className="text-center relative z-10 mb-8 pt-2">
          
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-black mb-3">
            <Sparkles className="w-4 h-4 text-saudi-gold" />
            <span>«كيمياء وطن أخضر» 🌱</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-emerald-800 mb-1">
            كيمياء اليوم… استدامة الغد
          </h2>

          <h1 className="text-3xl sm:text-4xl font-black text-saudi-dark tracking-tight mt-3 mb-6 flex items-center justify-center gap-2">
            <span>📜 ميثاق الاستدامة</span>
          </h1>

          {/* Student Declaration */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 p-6 rounded-2xl max-w-2xl mx-auto shadow-inner text-center my-6">
            
            <div className="text-xl sm:text-2xl font-black text-emerald-950 mb-2 flex items-center justify-center gap-2 flex-wrap">
              <span>أنا الطالبة:</span>
              
              {!isEditingName ? (
                <span className="text-emerald-800 underline decoration-amber-500 underline-offset-8 px-2 py-0.5 rounded flex items-center gap-1.5 font-extrabold">
                  {studentName}
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="no-print p-1 rounded-full text-slate-400 hover:text-emerald-700 hover:bg-emerald-100 transition-colors"
                    title="تعديل الاسم"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </span>
              ) : (
                <form onSubmit={handleNameSave} className="no-print inline-flex items-center gap-2">
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="px-3 py-1 rounded-lg border-2 border-emerald-500 font-bold text-lg text-emerald-900 bg-white"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-sm font-bold"
                  >
                    حفظ
                  </button>
                </form>
              )}
            </div>

            <p className="text-base sm:text-lg font-bold text-amber-800 mb-4">
              كيميائية من أجل وطني
            </p>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
              أتعهد أن أكون واعيةً بأهمية المحافظة على البيئة وموارد وطني، وأن أجعل من معرفتي بالكيمياء وسيلةً لصناعة أثر إيجابي ومستدام.
            </p>
          </div>
        </div>

        {/* Pledge Commitments List */}
        <div className="relative z-10 max-w-2xl mx-auto mb-10">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span>وألتزم بأن:</span>
          </h3>

          <div className="space-y-3.5">
            {pledgeCommitments.map((item, index) => {
              const isChecked = checkedItems[index];
              return (
                <div
                  key={item}
                  onClick={() => toggleCheck(index)}
                  className="flex items-center gap-3 p-3 sm:p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer select-none"
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isChecked
                        ? 'bg-emerald-600 text-white border border-emerald-600 shadow-sm'
                        : 'bg-white border-2 border-slate-300 text-transparent'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-slate-800">
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Signatures & Footer Info Grid */}
        <div className="relative z-10 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t-2 border-slate-200">
          
          {/* Name */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-right">
            <span className="text-xs text-slate-500 font-bold block mb-1">الاسم:</span>
            <span className="text-sm sm:text-base font-black text-emerald-900 block truncate">
              {studentName}
            </span>
          </div>

          {/* Date */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-right">
            <span className="text-xs text-slate-500 font-bold block mb-1">التاريخ:</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 block">
              {todayDate || 'اليوم'}
            </span>
          </div>

          {/* Signature Box */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 relative flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500 font-bold">التوقيع:</span>
              {hasSignature && (
                <button
                  onClick={clearSignature}
                  className="no-print text-xs text-red-500 hover:text-red-700 flex items-center gap-0.5"
                  title="مسح التوقيع"
                >
                  <Eraser className="w-3 h-3" />
                  <span>مسح</span>
                </button>
              )}
            </div>

            <div className="relative border border-dashed border-emerald-300 bg-white rounded-lg h-16 flex items-center justify-center overflow-hidden">
              <canvas
                ref={canvasRef}
                width={200}
                height={64}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-full cursor-crosshair touch-none"
              />
              {!hasSignature && (
                <span className="no-print absolute text-[11px] text-slate-400 pointer-events-none">
                  وقّعي هنا بلمسكِ أو الفأرة
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Certificate Bottom Motto */}
        <div className="text-center mt-10 pt-4 border-t border-emerald-100">
          <p className="text-base sm:text-lg font-black text-saudi-dark tracking-wide">
            «وطننا أمانة… واستدامته مسؤوليتنا»
          </p>
          <p className="text-xs text-slate-500 mt-1">
            الثانوية السادسة والثلاثون — مبادرة كيمياء وطن أخضر
          </p>
        </div>

      </div>

    </div>
  );
}
