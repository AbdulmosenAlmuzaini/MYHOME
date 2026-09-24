import { Metadata } from 'next';
import Pledge from '@/components/Pledge';

export const metadata: Metadata = {
  title: 'ميثاق الاستدامة | كيمياء وطن أخضر',
  description: 'ميثاق العهد البيئي لطالبات الكيمياء والاستدامة - قابل للطباعة والحفظ.',
};

export default function PledgePage() {
  return (
    <div className="bg-gradient-to-b from-emerald-50/60 via-slate-50 to-emerald-50/40 min-h-[calc(100vh-80px)]">
      <Pledge />
    </div>
  );
}
