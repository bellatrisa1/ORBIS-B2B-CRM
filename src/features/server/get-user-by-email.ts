import 'server-only';
import { db } from '@/shared/lib/db';

export type UserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
};

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const user = await db.getUserByEmail(email);
  if (!user) return null;

  return {
    id: user.user_id,
    email: user.email,
    passwordHash: user.password_hash,
    firstName: user.first_name,
    lastName: user.last_name,
    role: 'admin',
    status: user.is_active ? 'active' : 'inactive',
  };
}