import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/features/server/get-user-by-email';
import { createSessionCookie } from '@/shared/lib/auth';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const email = body.email?.trim() ?? '';
    const password = body.password?.trim() ?? '';

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email и пароль обязательны.' },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { message: 'Неверный email или пароль.' },
        { status: 401 }
      );
    }

    if (user.status !== 'active') {
      return NextResponse.json(
        { message: 'Пользователь недоступен.' },
        { status: 403 }
      );
    }

    if (password !== user.passwordHash) {
      return NextResponse.json(
        { message: 'Неверный email или пароль.' },
        { status: 401 }
      );
    }

    await createSessionCookie({
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[LOGIN] ROUTE ERROR:', error);

    return NextResponse.json(
      { message: 'Ошибка авторизации.' },
      { status: 500 }
    );
  }
}
