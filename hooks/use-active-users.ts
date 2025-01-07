'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { pusherClient } from '@/lib/pusher';

export function useActiveUsers() {
  const { user } = useUser();
  const [activeUsers, setActiveUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;

    // Mark user as active
    fetch('/api/presence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, status: 'online' }),
    });

    // Subscribe to presence events
    const channel = pusherClient.subscribe('presence');

    channel.bind('user-online', (userId: string) => {
      setActiveUsers((prev) => Array.from(new Set([...prev, userId])));
    });

    channel.bind('user-offline', (userId: string) => {
      setActiveUsers((prev) => prev.filter(id => id !== userId));
    });

    // Get initial active users
    fetch('/api/presence')
      .then(res => res.json())
      .then(data => setActiveUsers(data.activeUsers));

    // Cleanup
    return () => {
      if (user) {
        fetch('/api/presence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, status: 'offline' }),
        });
      }
      channel.unbind('user-online');
      channel.unbind('user-offline');
      pusherClient.unsubscribe('presence');
    };
  }, [user]);

  return { activeUsers };
} 