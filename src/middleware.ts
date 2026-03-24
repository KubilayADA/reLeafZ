import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const hostname = req.headers.get('host')?.split(':')[0] ?? ''
  const pathname = req.nextUrl.pathname

  const isAdminBySubdomain = hostname.startsWith('admin.')
  const isAdminPath = pathname === '/admin' || pathname.startsWith('/admin/')
  const isAdminRequest = isAdminBySubdomain || isAdminPath

  if (!isAdminRequest) {
    return NextResponse.next()
  }

  // Force admin subdomain on production
  if (isAdminRequest && !isAdminBySubdomain && hostname !== 'localhost') {
    const adminUrl = req.nextUrl.clone()
    adminUrl.host = 'admin.releafz.de'
    return NextResponse.redirect(adminUrl)
  }

  const adminToken = req.cookies.get('adminToken')?.value
  const isLoginPath = pathname === '/admin/login'

  if (!adminToken && !isLoginPath) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    return NextResponse.redirect(loginUrl)
  }

  if (adminToken && isLoginPath) {
    const dashboardUrl = req.nextUrl.clone()
    dashboardUrl.pathname = '/admin/dashboard'
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt|xml|woff|woff2|ttf|eot)$).*)',
  ],
}
