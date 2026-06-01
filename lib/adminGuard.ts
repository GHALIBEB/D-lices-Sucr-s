import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from './auth';
import { cookies } from 'next/headers';

export async function requireAdmin(): Promise<boolean> {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  return session.isAdmin === true;
}
