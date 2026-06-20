import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('authentificated')?.value;
  let authenticated = false;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);

      if (payload) {
        authenticated = true;
      }
    } catch (error) {
      authenticated = false;
    }
  }

  if (!authenticated && pathname !== "/login") {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (authenticated && pathname === "/login") {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Protect all routes except:
     * - /api/login
     * - Next.js internals
     * - static files
     */
    '/((?!api/login|_next/static|_next/image|favicon.ico).*)',
  ],
};