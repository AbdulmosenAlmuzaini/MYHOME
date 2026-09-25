'use client';

import { Submission } from '@/types/database';
import { User, CheckCircle, Tag, FileText, ExternalLink, Calendar } from 'lucide-react';

interface GalleryCardProps {
  submission: Submission;
}

export default function GalleryCard({ submission }: GalleryCardProps) {
  const isPdf = 
    submission.file_url?.toLowerCase().endsWith('.pdf') || 
    submission.file_path?.toLowerCase().endsWith('.pdf') ||
    submission.file_url?.startsWith('data:application/pdf');

  const formattedDate = submission.created_at
    ? new Date(submission.created_at).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  return (
    <article className="glass-card rounded-3xl overflow-hidden border border-emerald-100/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between bg-white group">
      
      <div>
        {/* Card Image / Media Preview Header */}
        {submission.file_url && !isPdf ? (
          <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-emerald-950">
            <img
              src={submission.file_url}
              alt={submission.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/90 backdrop-blur-md text-white text-xs font-bold shadow-sm">
              <Tag className="w-3 h-3 text-amber-300" />
              <span>{submission.category}</span>
            </span>
          </div>
        ) : (
          <div className="relative h-32 sm:h-36 w-full bg-gradient-to-br from-emerald-800 to-saudi-dark p-6 flex items-center justify-between text-white">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold">
                <Tag className="w-3 h-3 text-amber-300" />
                <span>{submission.category}</span>
              </span>
            </div>

            {isPdf && submission.file_url ? (
              <a
                href={submission.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-colors"
                title="عرض ملف المشاركة"
              >
                <FileText className="w-4 h-4" />
                <span>📄 عرض ملف المشاركة</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-200">
                <span className="text-2xl">🌱</span>
              </div>
            )}
          </div>
        )}

        {/* Card Body */}
        <div className="p-6">
          
          {/* Student Name & Date */}
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-3">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>{submission.student_name}</span>
            </div>
            {formattedDate && (
              <div className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-3 h-3" />
                <span>{formattedDate}</span>
              </div>
            )}
          </div>

          {/* Submission Title */}
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-3 leading-snug">
            {submission.title}
          </h3>

          {/* Submission Description */}
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">
            {submission.description}
          </p>

          {/* PDF Button if PDF and no top preview */}
          {isPdf && submission.file_url && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <a
                href={submission.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>📄 عرض ملف المشاركة في تبويب جديد ↗</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Badge */}
      <div className="px-6 py-3.5 bg-emerald-50/70 border-t border-emerald-100 flex items-center justify-between text-xs font-bold text-emerald-800">
        <div className="flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
          <span>✅ مشاركة معتمدة — كيمياء وطن أخضر</span>
        </div>
      </div>

    </article>
  );
}
