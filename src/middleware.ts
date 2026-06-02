import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('cedar_session')?.value;
  const path = request.nextUrl.pathname;

  // Paths that don't require authentication
  if (path === '/login' || path === '/signup' || path === '/forgot-password' || path === '/' || path === '/pending') {
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const payload = await decrypt(session);
    const userRole = payload.user.role;

    // Role-based access control
    if (path.startsWith('/student') && userRole !== 'student') {
      return NextResponse.redirect(new URL(userRole === 'admin' ? '/admin' : '/educator', request.url));
    }
    if (path.startsWith('/educator') && userRole !== 'educator') {
      return NextResponse.redirect(new URL(userRole === 'admin' ? '/admin' : '/student', request.url));
    }
    if (path.startsWith('/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL(userRole === 'educator' ? '/educator' : '/student', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/student/:path*', '/educator/:path*', '/admin/:path*', '/api/users/:path*', '/api/lessons/:path*', '/api/submissions/:path*', '/api/support/:path*'],
};
