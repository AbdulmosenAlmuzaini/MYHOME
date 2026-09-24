import { Metadata } from 'next';
import AdminLogin from '@/components/AdminLogin';

export const metadata: Metadata = {
  title: 'تسجيل دخول المشرفات | كيمياء وطن أخضر',
  description: 'بوابة تسجيل دخول معلمات ومشرفات مبادرة كيمياء وطن أخضر.',
};

export default function AdminLoginPage() {
  return <AdminLogin />;
}
