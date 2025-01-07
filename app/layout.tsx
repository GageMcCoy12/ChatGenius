import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner'
import { QueryProvider } from '@/providers/query-provider'
import { AppSidebar } from '@/components/Sidebar'
import { HeaderWrapper } from '@/components/HeaderWrapper'
import { SidebarProvider } from '@/components/ui/sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ChatGenius',
  description: 'A modern chat application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <QueryProvider>
        <html lang="en">
          <body className={inter.className}>
            <SidebarProvider>
              <div className="flex min-h-svh">
                <AppSidebar />
                <div className="flex-1">
                  <HeaderWrapper />
                  {children}
                </div>
              </div>
            </SidebarProvider>
            <Toaster />
          </body>
        </html>
      </QueryProvider>
    </ClerkProvider>
  )
}



import './globals.css'