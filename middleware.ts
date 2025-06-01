import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get auth cookie
  const pathName: string = request.nextUrl.pathname;
  const authCookie: RequestCookie|undefined = request.cookies.get('session');

  // When we are on the dashboard redirect to auth if
  // no cookie is found
  if (pathName.startsWith('/dashboard') && !authCookie) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // When we are on the auth page and there is a
  // cookie redirect to the dashboard
  if (pathName.startsWith('/auth') && authCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Otherwise forward the request
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth']
}