import { NextRequest, NextResponse } from 'next/server'
import { getCookie, STORAGE_KEYS } from './helper'

// Public paths always accessible
const PUBLIC_PATHS = new Set<string>(['/signin'])

// Role names must match values set in cookie (see STORAGE_KEYS.USER_ROLE)
const ROLE_TO_ALLOWED_PREFIXES: Record<string, string[]> = {
  // SO Admin
  'SO Admin': ['/manage-organizations'],
  // Org Admin
  'Org Admin': ['/manage-organizations-details'],
  // SO System Admin
  'SO System Admin': ['/manage-applications', '/manage-roles-and-users'],
  // Standard/User/Read Only can access only general routes ("/")
  'Standard User': ['/'],
  'Read Only': ['/'],
}

function startsWithAny(pathname: string, prefixes: string[]): boolean {
  return prefixes.some(
    prefix => pathname === prefix || pathname.startsWith(prefix + '/')
  )
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAuthenticated = Boolean(await getCookie(STORAGE_KEYS.SO_AUTH))
  const userRole = await getCookie(STORAGE_KEYS.USER_ROLE)

  const isPublic = Array.from(PUBLIC_PATHS).some(p => pathname.startsWith(p))

  // If authenticated and trying to access a public auth page, redirect to home
  if (isAuthenticated && pathname.startsWith('/signin')) {
    const url = new URL('/', request.url)
    return NextResponse.redirect(url)
  }

  // If not authenticated and the path is protected, redirect to signin
  if (!isAuthenticated && !isPublic) {
    const url = new URL('/signin', request.url)
    return NextResponse.redirect(url)
  }

  // Authenticated users: enforce role-based access for protected routes
  if (isAuthenticated && !isPublic) {
    // Root path "/" is allowed for any authenticated user
    if (pathname === '/') {
      return NextResponse.next()
    }

    // If no role cookie, treat as unauthorized for role-protected paths
    if (!userRole) {
      const url = new URL('/', request.url)
      return NextResponse.redirect(url)
    }

    const allowedPrefixes = ROLE_TO_ALLOWED_PREFIXES[userRole]

    // If role not mapped, default to only allowing "/"
    if (!allowedPrefixes) {
      const url = new URL('/', request.url)
      return NextResponse.redirect(url)
    }

    // If the requested path does not fall under any allowed prefix, redirect to home
    if (
      // Allow general pages under root when role allows '/'
      !(allowedPrefixes.includes('/') && pathname === '/') &&
      !startsWithAny(
        pathname,
        allowedPrefixes.filter(p => p !== '/')
      )
    ) {
      const url = new URL('/', request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|images|svgs|_next/image|favicon.ico|auth/callback).*)',
  ],
}
