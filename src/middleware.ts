import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export default async function middleware(request: NextRequest) {
  const session = await auth()
  
  // Define protected routes (paths that require authentication)
  const protectedPaths = [
    '/api',
    '/Dashboard',
    '/Studio',
    '/Profile'
  ]
  
  // Define excluded paths (paths that should not be protected)
  const excludedPaths = [
    '/api/auth',  // Exclude all auth-related routes
    '/api/youtube/auth',  // Exclude YouTube auth
    '/api/youtube/callback',  // Exclude YouTube callback
    '/api/instagram/auth',  // Exclude Instagram auth
    '/api/instagram/callback',  // Exclude Instagram callback
    '/api/revalidate' // 👈 Add this line
  ]
  
  // Check if the current path is excluded
  const isExcluded = excludedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )
  
  // Check if the current path starts with any protected path
  const isProtectedRoute = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )
  
  // If it's a protected route, not excluded, and there's no session, redirect to login
  if (isProtectedRoute && !isExcluded && !session) {
    const loginUrl = new URL('/Login', request.url)
    loginUrl.searchParams.set('callbackUrl', request.url)
    return NextResponse.redirect(loginUrl)
  }
  
  return NextResponse.next()
}

// Configure which paths this middleware will run on
export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/studio/:path*',
    '/profile/:path*'
  ]
}