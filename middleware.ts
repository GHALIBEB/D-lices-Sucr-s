import { NextRequest, NextResponse } from 'next/server';

const PROTECTED = [
  '/admin/dashboard',
  '/admin/products',
  '/admin/orders',
  '/admin/activity',
  '/admin/settings',
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));

  if (!isProtected) return NextResponse.next();

  const sessionCookie = req.cookies.get('delice_sucre_session');
  if (!sessionCookie?.value) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
