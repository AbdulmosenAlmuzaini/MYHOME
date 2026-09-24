'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Submission, SubmissionStatus } from '@/types/database';
import { INITIAL_APPROVED_SUBMISSIONS } from '@/lib/mock-submissions';
import { 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  ExternalLink, 
  User, 
  Tag, 
  Calendar, 
  Loader2, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';

interface AdminSubmissionReviewProps {
  id: string;
}

export default function AdminSubmissionReview({ id }: AdminSubmissionReviewProps) {
  const router = useRouter();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      setIsLoading(true);
      try {
        const supabase = createClient();
        if (supabase) {
          const { data, error } = await supabase
            .from('submissions')
            .select('*')
            .eq('id', id)
            .single();

          if (error) {
            console.warn('Fetch submission note:', error.message);
            loadFallback();
          } else if (data) {
            setSubmission(data as Submission);
            setAdminNote(data.admin_note || '');
          }
        } else {
          loadFallback();
        }
      } catch (err) {
        console.error('Error fetching submission:', err);
        loadFallback();
      } finally {
        setIsLoading(false);
      }
    };

    const loadFallback = () => {
      if (typeof window !== 'undefined') {
        const local = JSON.parse(localStorage.getItem('kimia_local_submissions') || '[]');
        const all = [...local, ...INITIAL_APPROVED_SUBMISSIONS];
        const found = all.find((item) => item.id === id);
        if (found) {
          setSubmission(found);
          setAdminNote(found.admin_note || '');
        }
      }
    };

    fetchSubmission();
  }, [id]);

  const handleUpdateStatus = async (newStatus: SubmissionStatus) => {
    if (!submission) return;
    setIsUpdating(true);
    setFeedbackMessage(null);

    try {
      const supabase = createClient();
      if (supabase) {
        const { error } = await supabase
          .from('submissions')
          .update({
            status: newStatus,
            admin_note: adminNote.trim() || null,
            reviewed_at: new Date().toISOString(),
          })
          .eq('id', submission.id);

        if (error) {
          throw new Error(error.message);
        }
      } else {
        // Update local mock
        const local = JSON.parse(localStorage.getItem('kimia_local_submissions') || '[]');
        const updatedLocal = local.map((s: Submission) => {
          if (s.id === submission.id) {
            return {
              ...s,
              status: newStatus,
              admin_note: adminNote.trim() || null,
              reviewed_at: new Date().toISOString(),
            };
          }
          return s;
        });
        localStorage.setItem('kimia_local_submissions', JSON.stringify(updatedLocal));
      }

      setSubmission((prev) => (prev ? { ...prev, status: newStatus, admin_note: adminNote.trim() || null } : null));
      setShowRejectConfirm(false);

      const statusLabels: Record<SubmissionStatus, string> = {
        approved: 'تم اعتماد المشاركة بنجاح وستظهر في المعرض العام ✨',
        needs_edit: 'تم تغيير الحالة إلى "تحتاج تعديل" وحفظ الملاحظة ✍️',
        rejected: 'تم رفض المشاركة وتحديث السجل ❌',
        pending: 'تم تعيين الحالة كقيد المراجعة ⏳',
      };

      setFeedbackMessage({
        type: 'success',
        text: statusLabels[newStatus],
      });

    } catch (err: any) {
      console.error('Update status error:', err);
      setFeedbackMessage({
        type: 'error',
        text: 'فشل تحديث حالة المشاركة. يرجى المحاولة مرة أخرى.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="flex items-center gap-3 text-slate-600 font-bold">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          <span>جاري تحميل تفاصيل المشاركة...</span>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-4">المشاركة غير موجودة</h2>
        <Link
          href="/admin"
          className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm"
        >
          العودة للوحة التحكم
        </Link>
      </div>
    );
  }

  const isPdf = submission.file_url?.toLowerCase().endsWith('.pdf');

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-900 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لقائمة المشاركات</span>
          </Link>

          <span className="text-xs text-slate-500 font-mono">
            ID: {submission.id.slice(0, 8)}...
          </span>
        </div>

        {/* Feedback Alert */}
        {feedbackMessage && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold shadow-sm animate-in fade-in ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
                : 'bg-red-50 border border-red-300 text-red-900'
            }`}
          >
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
        )}

        {/* Main Details Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          
          {/* Metadata Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs text-slate-400 font-bold block mb-1">اسم الطالبة</span>
              <div className="flex items-center gap-2 text-lg sm:text-xl font-black text-slate-900">
                <User className="w-5 h-5 text-emerald-600" />
                <span>{submission.student_name}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700">
                <Tag className="w-3.5 h-3.5" />
                <span>{submission.category}</span>
              </span>

              <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(submission.created_at).toLocaleDateString('ar-SA')}</span>
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-1">عنوان المشاركة</span>
              <h1 className="text-xl sm:text-2xl font-black text-saudi-dark">
                {submission.title}
              </h1>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 block mb-1">وصف العمل والمبادرة</span>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-slate-800 text-base leading-relaxed whitespace-pre-line">
                {submission.description}
              </div>
            </div>
          </div>

          {/* Media / File Preview */}
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-2">الملف أو الصورة المرفقة</span>
            {submission.file_url ? (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {!isPdf ? (
                  <div className="space-y-3">
                    <img
                      src={submission.file_url}
                      alt={submission.title}
                      className="max-h-96 w-auto rounded-xl object-contain border border-slate-200"
                    />
                    <a
                      href={submission.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>فتح الصورة بالحجم الكامل ↗</span>
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-amber-600" />
                      <div>
                        <p className="text-sm font-bold text-slate-800">مستند توثيق PDF</p>
                        <p className="text-xs text-slate-400">انقري لعرض أو تحميل الملف</p>
                      </div>
                    </div>
                    <a
                      href={submission.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
                    >
                      <span>فتح المستند</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl">
                لم يتم إرفاق ملف مع هذه المشاركة.
              </p>
            )}
          </div>

          {/* Admin Note Box */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-600">
              ملاحظة المشرفة الإدارية (تظهر للطالبة أو للأرشيف)
            </label>
            <div className="relative">
              <MessageSquare className="absolute right-4 top-3.5 w-5 h-5 text-slate-400" />
              <textarea
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="اكتبي سبب الرفض، أو التوجيهات المطلوبة للتعديل، أو عبارة تشجيعية..."
                className="w-full pr-12 pl-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 outline-none text-slate-800 text-sm font-medium transition-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">الحالة الحالية:</span>
              <span className="font-bold text-sm text-slate-800 px-3 py-1 rounded-xl bg-slate-100">
                {submission.status === 'approved' && '✅ معتمدة'}
                {submission.status === 'pending' && '⏳ قيد المراجعة'}
                {submission.status === 'needs_edit' && '✍️ تحتاج تعديل'}
                {submission.status === 'rejected' && '❌ مرفوضة'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Approve */}
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleUpdateStatus('approved')}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-700/20 transition-all active:scale-95 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>✅ اعتماد وعرض</span>
              </button>

              {/* Needs Edit */}
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleUpdateStatus('needs_edit')}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-700/20 transition-all active:scale-95 disabled:opacity-50"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>↩️ طلب تعديل</span>
              </button>

              {/* Reject */}
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => setShowRejectConfirm(true)}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-700/20 transition-all active:scale-95 disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                <span>❌ رفض المشاركة</span>
              </button>
            </div>

          </div>

        </div>

        {/* Reject Confirmation Dialog */}
        {showRejectConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-red-100 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-2">
                تأكيد رفض المشاركة
              </h3>

              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                هل أنتِ متأكدة من رفض مشاركة الطالبة <span className="font-bold text-slate-900">{submission.student_name}</span>؟ لن تظهر المشاركة في المعرض العام.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus('rejected')}
                  className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors"
                >
                  {isUpdating ? 'جاري الرفض...' : 'نعم، رفض المشاركة'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRejectConfirm(false)}
                  className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
