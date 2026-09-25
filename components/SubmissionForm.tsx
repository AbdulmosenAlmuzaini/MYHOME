'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SubmissionCategory } from '@/types/database';
import { 
  Send, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Image as ImageIcon, 
  Loader2, 
  X, 
  Sparkles,
  Info,
  RotateCcw,
  ExternalLink
} from 'lucide-react';

const CATEGORIES: SubmissionCategory[] = [
  'إعادة تدوير',
  'ترشيد المياه',
  'ترشيد الطاقة',
  'تشجير',
  'حماية البيئة',
  'مشروع كيمياء خضراء',
  'فكرة ابتكارية',
  'أخرى',
];

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
  'application/pdf',
];

export default function SubmissionForm() {
  const router = useRouter();
  const [studentName, setStudentName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<SubmissionCategory>('إعادة تدوير');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('kimia_student_name');
      if (savedName) {
        setStudentName(savedName);
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setErrorMessage('نوع الملف غير مدعوم. يرجى اختيار صورة (JPG, PNG, WEBP) أو ملف PDF.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(`حجم الملف كبير جداً. الحد الأقصى المسموح به هو ${MAX_FILE_SIZE_MB} ميجابايت.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);

    // Create preview if image
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedFile(null);
    setFilePreview(null);
    setCategory('إعادة تدوير');
    setErrorMessage('');
    setIsSuccessModalOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedName = studentName.trim();
    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    if (!trimmedName || !trimmedTitle || !trimmedDesc) {
      setErrorMessage('يرجى ملء جميع الحقول المطلوبة (اسم الطالبة، عنوان المشاركة، وصف المشاركة).');
      return;
    }

    setIsLoading(true);

    try {
      // Save name in localStorage for convenience
      if (typeof window !== 'undefined') {
        localStorage.setItem('kimia_student_name', trimmedName);
      }

      // Send multipart form data directly to /api/submissions
      const formData = new FormData();
      formData.append('student_name', trimmedName);
      formData.append('title', trimmedTitle);
      formData.append('description', trimmedDesc);
      formData.append('category', category);

      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const response = await fetch('/api/submissions', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'تعذر إرسال المشاركة، يرجى المحاولة مرة أخرى.');
      }

      // Only show success modal AFTER everything succeeds on the server
      setIsSuccessModalOpen(true);

    } catch (err: any) {
      console.error('Submission failed:', err);
      setErrorMessage(err.message || 'تعذر إرسال المشاركة، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Introduction Banner */}
      <div className="bg-gradient-to-br from-saudi-dark to-emerald-800 text-white rounded-3xl p-8 sm:p-10 shadow-xl mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-700/60 border border-emerald-400/40 text-emerald-200 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-saudi-gold" />
            <span>مشاركات كيمياء وطن أخضر</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black mb-4 leading-snug">
            لأن الاستدامة ليست مجرد معرفة… بل ممارسة وأثر 🌱
          </h1>

          <h2 className="text-lg sm:text-xl font-bold text-amber-300 mb-3">
            شاركينا إنجازكِ!
          </h2>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl font-normal">
            ارفعي صورة أو عملًا أو فكرة أو مبادرة قمتِ بها وتسهم في المحافظة على البيئة واستدامة موارد وطننا الغالي لتُعرض في المعرض الوطني المدرسي بعد اعتمادها من المشرفات.
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="bg-red-50 border-2 border-red-300 text-red-900 p-5 rounded-2xl mb-8 flex items-start gap-3 shadow-md animate-in fade-in">
          <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm font-semibold">{errorMessage}</p>
        </div>
      )}

      {/* Main Submission Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Student Name */}
          <div>
            <label htmlFor="student_name" className="block text-sm font-bold text-slate-800 mb-2">
              اسم الطالبة <span className="text-red-500">*</span>
            </label>
            <input
              id="student_name"
              type="text"
              required
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="مثال: سارة خالد العتيبي"
              className="w-full px-4 py-3.5 rounded-2xl border border-slate-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 outline-none text-slate-800 text-base font-medium transition-all"
            />
          </div>

          {/* Submission Title */}
          <div>
            <label htmlFor="submission_title" className="block text-sm font-bold text-slate-800 mb-2">
              عنوان المشاركة <span className="text-red-500">*</span>
            </label>
            <input
              id="submission_title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: إعادة تدوير العبوات البلاستيكية"
              className="w-full px-4 py-3.5 rounded-2xl border border-slate-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 outline-none text-slate-800 text-base font-medium transition-all"
            />
          </div>

          {/* Submission Category Dropdown */}
          <div>
            <label htmlFor="submission_category" className="block text-sm font-bold text-slate-800 mb-2">
              نوع المشاركة <span className="text-red-500">*</span>
            </label>
            <select
              id="submission_category"
              value={category}
              onChange={(e) => setCategory(e.target.value as SubmissionCategory)}
              className="w-full px-4 py-3.5 rounded-2xl border border-slate-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 outline-none text-slate-800 text-base font-medium bg-white transition-all cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Submission Description */}
          <div>
            <label htmlFor="submission_description" className="block text-sm font-bold text-slate-800 mb-2">
              وصف المشاركة <span className="text-red-500">*</span>
            </label>
            <textarea
              id="submission_description"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتبي وصفًا مختصرًا لما قمتِ به وكيف يسهم في الاستدامة..."
              className="w-full px-4 py-3.5 rounded-2xl border border-slate-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 outline-none text-slate-800 text-base font-medium transition-all resize-y"
            />
          </div>

          {/* File / Image Upload Box */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              رفع صورة أو ملف <span className="text-xs font-normal text-slate-500">(JPG, JPEG, PNG, WEBP, PDF - حتى 5MB)</span>
            </label>

            <div className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/30 rounded-2xl p-6 text-center transition-all">
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                onChange={handleFileChange}
                className="hidden"
                id="file_upload"
              />

              {!selectedFile ? (
                <label
                  htmlFor="file_upload"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2 py-2"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-emerald-800">
                    اضغطي هنا لاختيار صورة أو ملف PDF
                  </span>
                  <span className="text-xs text-slate-500">
                    الصيغ المدعومة: JPG, JPEG, PNG, WEBP, PDF (الحد الأقصى: 5 ميغابايت)
                  </span>
                </label>
              ) : (
                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-emerald-200 shadow-sm">
                  <div className="flex items-center gap-3 truncate">
                    {filePreview ? (
                      <img
                        src={filePreview}
                        alt="معاينة الملف"
                        className="w-12 h-12 rounded-lg object-cover border border-emerald-200 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        {selectedFile.type === 'application/pdf' ? (
                          <FileText className="w-6 h-6" />
                        ) : (
                          <ImageIcon className="w-6 h-6" />
                        )}
                      </div>
                    )}
                    <div className="text-right truncate">
                      <p className="text-sm font-bold text-slate-800 truncate">{selectedFile.name}</p>
                      <p className="text-xs text-slate-500">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={removeSelectedFile}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="إزالة الملف"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notice */}
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>تخضع جميع المشاركات لمراجعة المعلمتين المشرفتين قبل اعتمادها في المعرض.</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-lg shadow-emerald-700/25 transition-all duration-200 flex items-center justify-center gap-3 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>جارٍ إرسال المشاركة...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>🌱 إرسال للمراجعة</span>
              </>
            )}
          </button>

        </form>
      </div>

      {/* Success Modal Popup */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-lg w-full shadow-2xl border border-emerald-100 text-center relative overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header Icon */}
            <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6 shadow-inner">
              <span className="text-4xl select-none" role="img" aria-label="نبات">🌱</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-black text-saudi-dark mb-3">
              تم إرسال مشاركتكِ بنجاح!
            </h2>

            {/* Slogan */}
            <p className="text-base sm:text-lg font-bold text-amber-800 mb-3">
              شكرًا لمساهمتكِ في صنع أثر مستدام 🌱
            </p>

            {/* Details */}
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              تم استلام مشاركتكِ وسيتم مراجعتها واعتمادها من قبل المشرفات قبل ظهورها في المعرض.
            </p>

            {/* Note badge */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 mb-8 text-xs font-semibold text-emerald-800 flex items-center justify-center gap-2">
              <Info className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>ستظهر مشاركتكِ في المعرض مباشرة بعد اعتمادها.</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/gallery"
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-700/20 transition-all active:scale-95"
              >
                <span>🖼️ الانتقال إلى المعرض</span>
              </Link>

              <button
                type="button"
                onClick={handleResetForm}
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>↻ إضافة مشاركة أخرى</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
