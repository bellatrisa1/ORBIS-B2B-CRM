import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/shared/lib/db';

export const SESSION_COOKIE_NAME = 'orbis_session';

export type SessionUser = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
};

function encodeSession(session: SessionUser): string {
  return Buffer.from(JSON.stringify(session), 'utf-8').toString('base64');
}

function decodeSession(value: string): SessionUser | null {
  try {
    const json = Buffer.from(value, 'base64').toString('utf-8');
    return JSON.parse(json) as SessionUser;
  } catch {
    return null;
  }
}

export async function createSessionCookie(session: SessionUser) {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, encodeSession(session), {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 0,
  });
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!cookieValue) {
    return null;
  }

  return decodeSession(cookieValue);
}

export async function requireSessionUser(): Promise<SessionUser> {
  const session = await getSessionUser();

  if (!session) {
    redirect('/login');
  }

  // Проверяем что пользователь существует в JSON-базе
  const user = await db.getUserById(session.userId);

  if (!user) {
    redirect('/login');
  }

  return {
    userId: user.user_id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    role: 'admin',
  };
}
