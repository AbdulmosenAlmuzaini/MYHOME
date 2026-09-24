import { Metadata } from 'next';
import Quiz from '@/components/Quiz';

export const metadata: Metadata = {
  title: 'تحدي كيمياء وطن أخضر | اختبري معلوماتكِ في الاستدامة',
  description: '7 أسئلة تفاعلية تربط مفاهيم الكيمياء بالاستدامة ومحاور مبادرة السعودية الخضراء.',
};

export default function QuizPage() {
  return (
    <div className="bg-gradient-to-b from-emerald-50/50 via-slate-50 to-emerald-50/30 min-h-[calc(100vh-80px)]">
      <Quiz />
    </div>
  );
}
