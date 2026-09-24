'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { QUIZ_QUESTIONS } from '@/lib/data/quiz-questions';
import { QuizQuestion } from '@/types/database';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Award, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  RotateCcw, 
  FileText, 
  User, 
  HelpCircle,
  Trophy,
  Leaf
} from 'lucide-react';

export default function Quiz() {
  const router = useRouter();
  const [studentName, setStudentName] = useState('');
  const [tempNameInput, setTempNameInput] = useState('');
  const [isNameModalOpen, setIsNameModalOpen] = useState(true);
  const [nameError, setNameError] = useState('');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [questionId: number]: 'A' | 'B' | 'C' | 'D' }>({});

  useEffect(() => {
    // Check for existing stored name
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('kimia_student_name');
      if (savedName && savedName.trim()) {
        setStudentName(savedName.trim());
        setTempNameInput(savedName.trim());
        setIsNameModalOpen(false);
      }
    }
  }, []);

  const handleStartQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = tempNameInput.trim();
    if (!trimmed || trimmed.length < 3) {
      setNameError('الرجاء إدخال اسمكِ الكريم الثلاثي أو الثنائي بشكل صحيح للبدء');
      return;
    }
    setNameError('');
    setStudentName(trimmed);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kimia_student_name', trimmed);
    }
    setIsNameModalOpen(false);
  };

  const currentQuestion: QuizQuestion = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (optionId: 'A' | 'B' | 'C' | 'D') => {
    if (isAnswerSubmitted) return;
    setSelectedOption(optionId);
    setIsAnswerSubmitted(true);

    const isCorrect = optionId === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNextQuestion = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz finished
      setIsQuizCompleted(true);
      // Trigger festive confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#047857', '#10B981', '#F59E0B', '#34D399', '#D97706'],
        });
      } catch (err) {
        console.error('Confetti error:', err);
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsQuizCompleted(false);
    setUserAnswers({});
  };

  const progressPercent = Math.round(((currentIndex + (isAnswerSubmitted ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100);

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col justify-center">
      
      {/* Name Input Modal */}
      {isNameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl border border-emerald-100 text-center relative overflow-hidden">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6 shadow-inner">
              <User className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-saudi-dark mb-3">
              مرحباً بكِ في التحدي!
            </h2>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              يرجى كتابة اسمكِ الكريم لتسجيل إنجازكِ وتضمينه تلقائيًا في ميثاق الاستدامة وشهادة المشاركة.
            </p>

            <form onSubmit={handleStartQuiz} className="space-y-4">
              <div className="text-right">
                <label htmlFor="student_name" className="block text-sm font-bold text-slate-800 mb-1.5">
                  اسم المتسابقة <span className="text-red-500">*</span>
                </label>
                <input
                  id="student_name"
                  type="text"
                  required
                  value={tempNameInput}
                  onChange={(e) => {
                    setTempNameInput(e.target.value);
                    if (nameError) setNameError('');
                  }}
                  placeholder="مثال: ريناد محمد الشهري"
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 outline-none text-slate-800 text-base font-medium transition-all"
                  autoFocus
                />
                {nameError && (
                  <p className="text-red-600 text-xs font-semibold mt-2">{nameError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-700/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                انطلاق للتحدي 🌱
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Quiz Ongoing View */}
      {!isQuizCompleted ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-100/80 relative">
          
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                {currentQuestion.icon}
              </div>
              <div>
                <span className="text-xs font-semibold text-emerald-700">المحور المرتبط:</span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">{currentQuestion.axis}</h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-left">
                <span className="text-xs text-slate-500 block">التقدم</span>
                <span className="text-base font-black text-emerald-700">
                  {currentIndex + 1} <span className="text-slate-400 font-normal">من</span> {QUIZ_QUESTIONS.length}
                </span>
              </div>
              {studentName && (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  <User className="w-3.5 h-3.5" />
                  <span>{studentName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full my-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Question Title */}
          <div className="my-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3.5 mb-8">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOption === option.id;
              const isCorrect = option.id === currentQuestion.correctAnswer;
              
              let optionStyles = 'bg-slate-50 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-slate-800';

              if (isAnswerSubmitted) {
                if (isCorrect) {
                  optionStyles = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-400';
                } else if (isSelected && !isCorrect) {
                  optionStyles = 'bg-red-50 border-red-500 text-red-950 font-bold ring-2 ring-red-300';
                } else {
                  optionStyles = 'bg-slate-50/50 border-slate-200 opacity-60 text-slate-500';
                }
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  disabled={isAnswerSubmitted}
                  className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-right transition-all duration-200 flex items-center justify-between gap-4 ${optionStyles} ${
                    !isAnswerSubmitted ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-white border border-slate-300 flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                      {option.id}
                    </span>
                    <span className="text-base sm:text-lg">{option.text}</span>
                  </div>

                  {isAnswerSubmitted && isCorrect && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-6 h-6 text-red-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Answer Feedback & Explanation */}
          {isAnswerSubmitted && (
            <div
              className={`p-5 rounded-2xl mb-8 border animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                selectedOption === currentQuestion.correctAnswer
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50/80 border-amber-300 text-amber-950'
              }`}
            >
              <div className="flex items-center gap-2 mb-2 font-bold text-sm sm:text-base">
                {selectedOption === currentQuestion.correctAnswer ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>إجابة صحيحة! أحسنتِ ✨</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    <span>الإجابة الصحيحة هي ({currentQuestion.correctAnswer}) 💡</span>
                  </>
                )}
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
                <span className="font-semibold">التفسير العلمي: </span>
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              {!isAnswerSubmitted ? 'اختاري إجابة للمتابعة' : 'اضغطي لمتابعة السؤال التالي'}
            </span>

            <button
              onClick={handleNextQuestion}
              disabled={!isAnswerSubmitted}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base transition-all ${
                isAnswerSubmitted
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-700/20 active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>{currentIndex === QUIZ_QUESTIONS.length - 1 ? 'عرض النتيجة النهائية' : 'السؤال التالي'}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

        </div>
      ) : (
        /* Celebration Screen at Quiz End */
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-emerald-200 text-center relative overflow-hidden animate-in zoom-in-95 duration-300">
          
          {/* Decorative Celebration Glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-100 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-100 rounded-full blur-3xl pointer-events-none" />

          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-600 to-saudi-emerald text-white flex items-center justify-center shadow-xl shadow-emerald-600/30 mb-6">
            <Trophy className="w-12 h-12 text-amber-300" />
          </div>

          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold mb-4">
            🌱 أحسنتِ!
          </span>

          <h2 className="text-2xl sm:text-4xl font-black text-saudi-dark mb-3">
            أكملتِ رحلة «كيمياء وطن أخضر»
          </h2>

          <p className="text-base sm:text-lg text-slate-600 mb-8 font-medium">
            المتسابقة المتميزة: <span className="font-bold text-emerald-800 underline decoration-amber-400 underline-offset-4">{studentName}</span>
          </p>

          {/* Score Badge */}
          <div className="max-w-xs mx-auto p-6 rounded-3xl bg-gradient-to-b from-emerald-50 to-slate-50 border border-emerald-200 mb-8 shadow-inner">
            <span className="text-xs text-slate-500 font-bold block mb-1">النتيجة المحققة</span>
            <div className="text-4xl sm:text-5xl font-black text-emerald-700 tracking-tight">
              {score} <span className="text-xl text-slate-400 font-medium">من {QUIZ_QUESTIONS.length}</span>
            </div>
            <p className="text-xs text-emerald-800 mt-2 font-semibold">
              {score >= 5 ? '🌟 أداء علمي واستدامي رائع جداً!' : '🌱 بداية واعدة ومشاركة طيبة في رحلة الاستدامة'}
            </p>
          </div>

          <p className="text-lg sm:text-xl font-bold text-slate-800 mb-8">
            والآن حان وقت ترك أثركِ…
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              href="/pledge"
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-lg shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <FileText className="w-5 h-5" />
              <span>📜 ميثاق الاستدامة</span>
            </Link>

            <button
              onClick={handleRestartQuiz}
              className="w-full sm:w-auto flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة الاختبار</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <Link
              href="/participation"
              className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              <Leaf className="w-4 h-4" />
              <span>لديكِ فكرة أو مشروع؟ شاركينا إنجازكِ في المعرض الوطني</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

        </div>
      )}

    </div>
  );
}
