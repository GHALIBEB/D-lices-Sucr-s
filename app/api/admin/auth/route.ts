export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/auth';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json({ error: 'Non configuré' }, { status: 500 });
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
  }

  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    session.isAdmin = true;
    await session.save();
  } catch (e: any) {
    return NextResponse.json({ error: `Session error: ${e.message}` }, { status: 500 });
  }

  await prisma.adminActivity.create({
    data: { action: 'login', details: 'Connexion admin' },
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  session.destroy();
  return NextResponse.json({ ok: true });
}
