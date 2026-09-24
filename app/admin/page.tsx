import { Metadata } from 'next';
import AdminDashboard from '@/components/AdminDashboard';

export const metadata: Metadata = {
  title: 'لوحة تحكم المشرفة | كيمياء وطن أخضر',
  description: 'إدارة ومراجعة واعتماد مشاركات الطالبات في مبادرة كيمياء وطن أخضر.',
};

export default function AdminPage() {
  return <AdminDashboard />;
}
