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

    // If this is the first request after sign-in, trigger user creation
    if (request.nextUrl.pathname === '/') {
      console.log('📝 First request after sign-in, triggering user creation...');
      try {
        const response = await fetch(`${request.nextUrl.origin}/api/auth/sign-in`, {
          method: 'POST',
          headers: {
            'Authorization': request.headers.get('Authorization') || '',
          }
        });
        console.log('✅ User creation response:', await response.text());
      } catch (error) {
        console.error('❌ Error creating user:', error);
      }
    }
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