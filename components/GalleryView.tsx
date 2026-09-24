'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Submission, SubmissionCategory } from '@/types/database';
import { INITIAL_APPROVED_SUBMISSIONS } from '@/lib/mock-submissions';
import GalleryCard from '@/components/GalleryCard';
import { 
  Sparkles, 
  Send, 
  Filter, 
  Image as ImageIcon, 
  Search, 
  RefreshCw 
} from 'lucide-react';

const FILTER_CATEGORIES: string[] = [
  'الكل',
  'إعادة تدوير',
  'ترشيد المياه',
  'ترشيد الطاقة',
  'تشجير',
  'حماية البيئة',
  'مشروع كيمياء خضراء',
  'فكرة ابتكارية',
  'أخرى',
];

export default function GalleryView() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchApprovedSubmissions = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('submissions')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Supabase fetch note:', error.message);
          setSubmissions(INITIAL_APPROVED_SUBMISSIONS);
        } else if (data && data.length > 0) {
          setSubmissions(data as Submission[]);
        } else {
          // If Supabase table is empty, show initial sample projects
          setSubmissions(INITIAL_APPROVED_SUBMISSIONS);
        }
      } else {
        // Fallback for local demo
        const local = JSON.parse(localStorage.getItem('kimia_local_submissions') || '[]');
        const approvedLocal = local.filter((s: any) => s.status === 'approved');
        const combined = [...approvedLocal, ...INITIAL_APPROVED_SUBMISSIONS];
        setSubmissions(combined);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setSubmissions(INITIAL_APPROVED_SUBMISSIONS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedSubmissions();
  }, []);

  const filteredSubmissions = submissions.filter((item) => {
    const matchesCategory =
      selectedCategory === 'الكل' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-saudi-gold" />
          <span>إبداعات كيميائية مستدامة</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-saudi-dark mb-4">
          معرض المشاركات المعتمدة 🖼️
        </h1>

        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          استكشفي المبادرات والأعمال المبتكرة التي قدمتها طالباتنا لربط أسرار الكيمياء باستدامة بيئة وطننا الحبيب.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-emerald-100 shadow-sm mb-10 space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحثي عن مشاركة بالاسم، العنوان، أو الوصف..."
            className="w-full pr-12 pl-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 outline-none text-slate-800 text-sm font-medium transition-all"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
          <span className="text-xs font-bold text-slate-500 shrink-0 flex items-center gap-1 ml-2">
            <Filter className="w-3.5 h-3.5" />
            <span>المجال:</span>
          </span>
          {FILTER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 select-none ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20'
                  : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Grid Content */}
      {isLoading ? (
        /* Skeleton Loaders */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 p-6 space-y-4 animate-pulse"
            >
              <div className="h-44 bg-slate-200 rounded-2xl w-full" />
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-6 bg-slate-200 rounded w-3/4" />
              <div className="h-16 bg-slate-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : filteredSubmissions.length > 0 ? (
        /* Gallery Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredSubmissions.map((submission) => (
            <GalleryCard key={submission.id} submission={submission} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center bg-white rounded-3xl p-12 sm:p-16 border border-emerald-100 max-w-lg mx-auto shadow-sm">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
            <span className="text-4xl">🌱</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-saudi-dark mb-2">
            لا توجد مشاركات معتمدة حتى الآن
          </h3>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
            كوني أول من يترك أثرًا مستدامًا ويشاركنا مبادرة كيميائية متميزة!
          </p>

          <Link
            href="/participation"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-700/20 transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>شاركينا مشاركتكِ الأولى الآن</span>
          </Link>
        </div>
      )}

    </div>
  );
}
