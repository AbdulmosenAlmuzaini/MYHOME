import { Metadata } from 'next';
import SubmissionForm from '@/components/SubmissionForm';

export const metadata: Metadata = {
  title: 'مشاركتي | كيمياء وطن أخضر',
  description: 'شاركينا عملكِ أو مبادرتكِ الكيميائية في خدمة البيئة والاستدامة الوطنية.',
};

export default function ParticipationPage() {
  return (
    <div className="bg-gradient-to-b from-emerald-50/50 via-slate-50 to-emerald-50/30 min-h-[calc(100vh-80px)]">
      <SubmissionForm />
    </div>
  );
}
