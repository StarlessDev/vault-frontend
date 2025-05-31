import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if requesting dashboard pages
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Check for auth cookie
    const authCookie = request.cookies.get('session')  // replace 'session' with your actual cookie name
    
    if (!authCookie) {
      // Redirect to login if no auth cookie found
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  }

  // Check if accessing auth page while logged in
  if (request.nextUrl.pathname.startsWith('/auth')) {
    const authCookie = request.cookies.get('session')
    
    if (authCookie) {
      // Redirect to dashboard if already authenticated
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth']
}