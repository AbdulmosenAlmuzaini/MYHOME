import { NextRequest, NextResponse } from 'next/server';
import { setAdminSessionCookie, AdminUser } from '@/lib/auth';

// Supervisor emails and password setup
// Can be customized via environment variable ADMIN_PASSWORD or default secure credentials
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'kimia2026';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' },
        { status: 400 }
      );
    }

    // Verify supervisor credentials
    // You can also add more supervisors in env or checks
    if (password === ADMIN_PASSWORD) {
      const user: AdminUser = {
        email: email.trim().toLowerCase(),
        name: 'المشرفة المعلمة',
        role: 'admin',
      };

      await setAdminSessionCookie(user);

      return NextResponse.json({
        success: true,
        user,
      });
    }

    return NextResponse.json(
      { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
      { status: 401 }
    );
  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 500 }
    );
  }
}
