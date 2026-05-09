'use server';

import { redirect } from 'next/navigation';
import { clearSessionCookie } from '@/shared/lib/auth';

export async function logout() {
  await clearSessionCookie();
  redirect('/login');
}
