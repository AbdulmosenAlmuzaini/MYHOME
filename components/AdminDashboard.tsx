'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Submission, SubmissionStatus } from '@/types/database';
import { INITIAL_APPROVED_SUBMISSIONS } from '@/lib/mock-submissions';
import { 
  Shield, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertTriangle, 
  Search, 
  Eye, 
  User, 
  Tag, 
  RefreshCw
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  const fetchAllSubmissions = async () => {
    setIsLoading(true);
    try {
      // 1. Verify session
      const meRes = await fetch('/api/admin/me');
      if (!meRes.ok) {
        router.push('/admin/login');
        return;
      }
      const meData = await meRes.json();
      setAdminEmail(meData.user?.email || null);

      // 2. Fetch all submissions
      const response = await fetch('/api/submissions?all=true');
      if (response.ok) {
        const data = await response.json();
        if (data.submissions) {
          setSubmissions(data.submissions);
        } else {
          setSubmissions(INITIAL_APPROVED_SUBMISSIONS);
        }
      } else {
        setSubmissions(INITIAL_APPROVED_SUBMISSIONS);
      }
    } catch (err) {
      console.error('Error loading submissions:', err);
      setSubmissions(INITIAL_APPROVED_SUBMISSIONS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSubmissions();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Calculate statistics
  const totalCount = submissions.length;
  const pendingCount = submissions.filter((s) => s.status === 'pending').length;
  const approvedCount = submissions.filter((s) => s.status === 'approved').length;
  const rejectedCount = submissions.filter((s) => s.status === 'rejected').length;
  const needsEditCount = submissions.filter((s) => s.status === 'needs_edit').length;

  const filteredSubmissions = submissions.filter((item) => {
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>معتمدة</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold animate-pulse">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>قيد المراجعة</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            <span>مرفوضة</span>
          </span>
        );
      case 'needs_edit':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-blue-600" />
            <span>تحتاج تعديل</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Admin Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-800 to-saudi-emerald text-white flex items-center justify-center shadow-lg shadow-emerald-950/20">
              <Shield className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-saudi-dark">
                  لوحة تحكم المشرفة
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  إدارة المبادرة
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                إشراف المعلمتين: <span className="font-bold text-slate-700">جميلة الصاعدي ، صباح الأحمدي</span> | الثانوية 36
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={fetchAllSubmissions}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="تحديث البيانات"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            <Link
              href="/"
              target="_blank"
              className="px-4 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs sm:text-sm transition-colors"
            >
              عرض الموقع العام ↗
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs sm:text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل خروج</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          
          {/* Total */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-500 mb-2">إجمالي المشاركات</span>
            <span className="text-3xl font-black text-slate-900">{totalCount}</span>
          </div>

          {/* Pending */}
          <div className="bg-amber-50/70 p-5 rounded-3xl border border-amber-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-800">قيد المراجعة</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-3xl font-black text-amber-700">{pendingCount}</span>
          </div>

          {/* Approved */}
          <div className="bg-emerald-50/70 p-5 rounded-3xl border border-emerald-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-800">المعتمدة</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-3xl font-black text-emerald-700">{approvedCount}</span>
          </div>

          {/* Needs Edit */}
          <div className="bg-blue-50/70 p-5 rounded-3xl border border-blue-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-800">تحتاج تعديل</span>
              <AlertTriangle className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-3xl font-black text-blue-700">{needsEditCount}</span>
          </div>

          {/* Rejected */}
          <div className="bg-red-50/70 p-5 rounded-3xl border border-red-200 shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-red-800">المرفوضة</span>
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-3xl font-black text-red-700">{rejectedCount}</span>
          </div>

        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحثي باسم الطالبة أو عنوان المشاركة..."
                className="w-full pr-12 pl-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 outline-none text-slate-800 text-sm font-medium transition-all"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'pending', label: 'قيد المراجعة' },
                { id: 'approved', label: 'المعتمدة' },
                { id: 'needs_edit', label: 'تحتاج تعديل' },
                { id: 'rejected', label: 'المرفوضة' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    statusFilter === tab.id
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

          </div>

        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-black uppercase">
                  <th className="p-4 sm:p-5">اسم الطالبة</th>
                  <th className="p-4 sm:p-5">عنوان المشاركة</th>
                  <th className="p-4 sm:p-5">الفئة</th>
                  <th className="p-4 sm:p-5">تاريخ الإرسال</th>
                  <th className="p-4 sm:p-5">الحالة</th>
                  <th className="p-4 sm:p-5 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">
                      جاري تحميل المشاركات...
                    </td>
                  </tr>
                ) : filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Student Name */}
                      <td className="p-4 sm:p-5 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>{item.student_name}</span>
                        </div>
                      </td>

                      {/* Title */}
                      <td className="p-4 sm:p-5 font-medium text-slate-800 max-w-xs truncate">
                        {item.title}
                      </td>

                      {/* Category */}
                      <td className="p-4 sm:p-5">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                          <Tag className="w-3 h-3 text-slate-400" />
                          <span>{item.category}</span>
                        </span>
                      </td>

                      {/* Date */}
                      <td className="p-4 sm:p-5 text-xs text-slate-500">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString('ar-SA', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>

                      {/* Status */}
                      <td className="p-4 sm:p-5">
                        {getStatusBadge(item.status)}
                      </td>

                      {/* Action */}
                      <td className="p-4 sm:p-5 text-center">
                        <Link
                          href={`/admin/submissions/${item.id}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>مراجعة وتعديل</span>
                        </Link>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400 font-medium">
                      لا توجد مشاركات تطابق الفلتر الحالي.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}
