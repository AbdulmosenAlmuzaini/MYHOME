import { Metadata } from 'next';
import AdminSubmissionReview from '@/components/AdminSubmissionReview';

export const metadata: Metadata = {
  title: 'مراجعة المشاركة | كيمياء وطن أخضر',
  description: 'تفاصيل ومراجعة مشاركة الطالبة واعتمادها في المعرض.',
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function SubmissionDetailPage({ params }: PageProps) {
  return <AdminSubmissionReview id={params.id} />;
}
