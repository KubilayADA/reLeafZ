import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const LOCALHOST_ADMIN_PATHS = new Set([
  '/dashboard',
  '/patients',
  '/doctors',
  '/pharmacies',
  '/prescriptions',
  '/team',
  '/analytics',
  '/login',
])

export function middleware(req: NextRequest) {
  const hostname = req.headers.get('host')?.split(':')[0] ?? ''
  const pathname = req.nextUrl.pathname

  const isAdminBySubdomain = hostname.startsWith('admin.')
  const isAdminByPathPrefix = pathname.startsWith('/admin-')
  const isAdminLocalhostRoute =
    hostname === 'localhost' && LOCALHOST_ADMIN_PATHS.has(pathname)

  const isAdminRequest =
    isAdminBySubdomain || isAdminByPathPrefix || isAdminLocalhostRoute

  if (!isAdminRequest) {
    return NextResponse.next()
  }

  const adminToken = req.cookies.get('adminToken')?.value
  const isLoginPath = pathname === '/login'

  if (!adminToken && !isLoginPath) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  if (adminToken && isLoginPath) {
    const dashboardUrl = req.nextUrl.clone()
    dashboardUrl.pathname = '/dashboard'
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt|xml|woff|woff2|ttf|eot)$).*)',
  ],
}
