'use client';

import { CurrentSidebar } from '../../components/ui/current-sidebar'

export default function ChannelsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh">
      <CurrentSidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
} 