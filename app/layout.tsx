import './globals.css'
import type { Metadata } from 'next'
import { Inter, Azeret_Mono } from 'next/font/google'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { HeaderWrapper } from '@/components/HeaderWrapper'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})
const geistMono = Azeret_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'ChatGenius',
  description: 'A next-generation chat application',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}
        >
          <SidebarProvider>
            <div className="flex h-screen">
              <AppSidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <HeaderWrapper />
                <main className="flex-1 overflow-auto">
                  {children}
                </main>
              </div>
            </div>
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}



import './globals.css'