import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = request.nextUrl;

    // Authenticated users should not access auth pages
    if (token && (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up'))) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Unauthenticated users cannot access protected pages
    if (!token && pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/sign-in', '/sign-up', '/dashboard/:path*'],
};
