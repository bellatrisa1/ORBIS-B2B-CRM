import { NextResponse } from 'next/server';
import { db } from '@/shared/lib/db';
import { createSessionCookie } from '@/shared/lib/auth';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
    };

    const firstName = body.firstName?.trim() ?? '';
    const lastName = body.lastName?.trim() ?? '';
    const email = body.email?.trim().toLowerCase() ?? '';
    const password = body.password?.trim() ?? '';

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: 'Имя, фамилия, email и пароль обязательны.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Пароль должен быть не короче 6 символов.' },
        { status: 400 }
      );
    }

    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'Пользователь с таким email уже существует.' },
        { status: 409 }
      );
    }

    const user = await db.createUser({
      email,
      password,
      firstName,
      lastName,
    });

    await createSessionCookie({
      userId: user.user_id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: 'admin',
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('REGISTER ROUTE ERROR:', error);

    return NextResponse.json(
      { message: 'Ошибка регистрации.' },
      { status: 500 }
    );
  }
}
