import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/auth';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

function sha256(str: string) {
  return createHash('sha256').update(str).digest('hex');
}

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const storedHash = process.env.ADMIN_PASSWORD_HASH;

  if (!storedHash) {
    return NextResponse.json({ error: 'Non configuré' }, { status: 500 });
  }

  if (sha256(password) !== storedHash) {
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
  }

  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  session.isAdmin = true;
  await session.save();

  await prisma.adminActivity.create({
    data: { action: 'login', details: 'Connexion admin' },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  session.destroy();
  return NextResponse.json({ ok: true });
}
