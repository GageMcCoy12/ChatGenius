import { clerkMiddleware } from '@clerk/nextjs/server'
import { getOrCreateUser } from '@/lib/user'

// Debug log to check if env is loaded
console.log('CLERK_SECRET_KEY exists:', !!process.env.CLERK_SECRET_KEY);

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}