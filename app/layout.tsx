import type { Metadata } from 'next'
import { Geist, Azeret_Mono as Geist_Mono } from 'next/font/google'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { HeaderWrapper } from '@/components/HeaderWrapper'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})
const geistMono = Geist_Mono({
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
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
  )
}



import './globals.css'