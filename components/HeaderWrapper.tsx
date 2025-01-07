'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { useUser } from '@clerk/nextjs'
import { useUsers } from '@/hooks/use-users'

export function HeaderWrapper() {
  const pathname = usePathname()
  const { data: users } = useUsers()
  
  let channelName = 'ChatGenius'
  if (pathname === '/general') {
    channelName = 'General Channel'
  } else if (pathname.startsWith('/dm/')) {
    const userId = pathname.split('/').pop()
    const dmUser = users?.find(user => user.id === userId)
    if (dmUser) {
      channelName = `Chat with ${dmUser.username}`
    }
  }

  return <Header channelName={channelName} />
}

