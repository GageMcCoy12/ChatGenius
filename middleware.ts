import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks/(.*)'
])

export default clerkMiddleware(async (auth, request) => {
  // Log all requests to see what's hitting the middleware
  console.log('🔒 Middleware processing:', request.method, request.url);

  if (!isPublicRoute(request)) {
    const { userId } = await auth.protect()
    console.log('👤 Protected route accessed by:', userId);
  } else {
    console.log('🔓 Public route accessed');
  }
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - webhooks (webhook endpoints)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|webhooks).*)',
  ],
}