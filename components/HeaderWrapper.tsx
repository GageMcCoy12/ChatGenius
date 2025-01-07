'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'

export function HeaderWrapper() {
  const pathname = usePathname()
  
  let channelName = 'ChatGenius'
  if (pathname === '/general') {
    channelName = 'General Channel'
  } else if (pathname === '/social') {
    channelName = 'Social Channel'
  } else if (pathname === '/help') {
    channelName = 'Help Channel'
  } else if (pathname.startsWith('/dm/')) {
    const dmName = pathname.split('/').pop()
    channelName = `Chat with ${dmName}`
  }

  return <Header channelName={channelName} />
}

