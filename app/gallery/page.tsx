import { Metadata } from 'next';
import GalleryView from '@/components/GalleryView';

export const metadata: Metadata = {
  title: 'المعرض | كيمياء وطن أخضر',
  description: 'معرض المشاركات المعتمدة في مبادرة كيمياء وطن أخضر - إبداعات طالباتنا في الكيمياء والاستدامة.',
};

export default function GalleryPage() {
  return (
    <div className="bg-gradient-to-b from-emerald-50/40 via-slate-50 to-emerald-50/20 min-h-[calc(100vh-80px)]">
      <GalleryView />
    </div>
  );
}
