'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMessage(err.message || 'فشل تسجيل الدخول. يرجى التحقق من صحة البيانات.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-saudi-dark via-[#046347] to-[#022f23]">
      
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-emerald-500/30 relative overflow-hidden">
        
        {/* Decorative subtle header badge */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-700 to-saudi-emerald text-white flex items-center justify-center mb-4 shadow-lg shadow-emerald-900/30">
            <ShieldCheck className="w-8 h-8 text-amber-300" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-saudi-dark mb-2">
            بوابة المشرفات
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            مبادرة كيمياء وطن أخضر — الثانوية السادسة والثلاثون
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 flex items-start gap-3 text-xs sm:text-sm font-semibold">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              البريد الإلكتروني للمشرفة
            </label>
            <div className="relative">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="supervisor@school.edu.sa"
                className="w-full pr-12 pl-4 py-3.5 rounded-2xl border border-slate-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 outline-none text-slate-800 text-sm font-medium transition-all"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pr-12 pl-4 py-3.5 rounded-2xl border border-slate-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 outline-none text-slate-800 text-sm font-medium transition-all"
                dir="ltr"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base shadow-lg shadow-emerald-900/25 transition-all duration-200 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>جاري التحقق والدخول...</span>
              </>
            ) : (
              <span>تسجيل الدخول</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة إلى الصفحة الرئيسية</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
