'use client';

import { useState } from 'react';
import { Submission } from '@/types/database';
import { User, CheckCircle, Tag, FileText, ExternalLink, Calendar, Maximize2, X, ImageOff } from 'lucide-react';

interface GalleryCardProps {
  submission: Submission;
}

export default function GalleryCard({ submission }: GalleryCardProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Check if the uploaded file is a PDF
  const isPdf = Boolean(
    submission.file_url?.toLowerCase().endsWith('.pdf') || 
    submission.file_path?.toLowerCase().endsWith('.pdf') ||
    submission.file_url?.includes('application/pdf') ||
    submission.file_url?.startsWith('data:application/pdf')
  );

  const hasImage = Boolean(submission.file_url && !isPdf);

  // Format Arabic Date
  const formattedDate = submission.created_at
    ? new Date(submission.created_at).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const handleImageError = () => {
    console.warn('Image load error for submission ID:', submission.id, 'URL:', submission.file_url);
    setImageError(true);
  };

  return (
    <>
      <article className="glass-card rounded-3xl overflow-hidden border border-emerald-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between bg-white group">
        
        <div>
          {/* 1. Image Header (Full width at the top, only if student uploaded an image) */}
          {hasImage && submission.file_url && (
            <div className="relative w-full h-[250px] overflow-hidden bg-slate-100">
              {!imageError ? (
                <div 
                  className="w-full h-full cursor-pointer group/img relative"
                  onClick={() => setIsImageModalOpen(true)}
                >
                  <img
                    src={submission.file_url}
                    alt={submission.title}
                    onError={handleImageError}
                    className="w-full h-[250px] object-cover group-hover/img:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Overlay hover hint */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-900 shadow-md flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>تكبير الصورة</span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-100 text-slate-400">
                  <ImageOff className="w-8 h-8 mb-2 text-slate-300" />
                  <span className="text-xs font-bold">تعذر تحميل الصورة</span>
                </div>
              )}
            </div>
          )}

          {/* 2. PDF Attachment Header (If uploaded file is PDF) */}
          {isPdf && submission.file_url && (
            <div className="p-4 bg-emerald-50/80 border-b border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <FileText className="w-5 h-5 text-emerald-700" />
                <span>📄 ملف مرفق</span>
              </div>
              <a
                href={submission.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
              >
                <span>عرض الملف</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* 3. Card Information Details */}
          <div className="p-6 space-y-4">
            
            {/* Student Name */}
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-0.5">اسم الطالبة:</span>
              <div className="flex items-center gap-2 text-base sm:text-lg font-black text-emerald-900">
                <User className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{submission.student_name}</span>
              </div>
            </div>

            {/* Submission Title */}
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-0.5">عنوان المشاركة:</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {submission.title}
              </h3>
            </div>

            {/* Submission Category */}
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-1">نوع المشاركة:</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <Tag className="w-3 h-3 text-emerald-600" />
                <span>{submission.category}</span>
              </span>
            </div>

            {/* Submission Description */}
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-1">وصف المشاركة:</span>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
                {submission.description}
              </p>
            </div>

            {/* Submission Date */}
            {formattedDate && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium">تاريخ المشاركة: {formattedDate}</span>
              </div>
            )}

          </div>
        </div>

        {/* 4. Footer Badge */}
        <div className="px-6 py-3.5 bg-emerald-50/90 border-t border-emerald-100 flex items-center justify-between text-xs font-bold text-emerald-800">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
            <span>✅ مشاركة معتمدة — كيمياء وطن أخضر</span>
          </div>
        </div>

      </article>

      {/* Image Preview Modal (Lightbox) */}
      {isImageModalOpen && hasImage && submission.file_url && !imageError && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 left-4 z-10 p-2.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors shadow-lg"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={submission.file_url}
              alt={submission.title}
              className="max-h-[80vh] w-auto object-contain rounded-2xl mx-auto"
            />
            <div className="p-4 text-center">
              <h4 className="font-bold text-slate-900 text-base">{submission.title}</h4>
              <p className="text-xs text-slate-500 mt-1">مشاركة الطالبة: {submission.student_name}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
