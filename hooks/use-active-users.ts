'use client';

import { useEffect, useState } from 'react';
import { WebSocketService } from '../src/lib/websocket';

export function useActiveUsers() {
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const ws = WebSocketService.getInstance();

  useEffect(() => {
    const handleUserOnline = (userId: string) => {
      setActiveUsers((prev) => Array.from(new Set([...prev, userId])));
    };

    const handleUserOffline = (userId: string) => {
      setActiveUsers((prev) => prev.filter((id) => id !== userId));
    };

    ws.subscribe('user-online', handleUserOnline);
    ws.subscribe('user-offline', handleUserOffline);

    // Initial fetch of active users could be done through an API call
    fetch('/api/active-users')
      .then((res) => res.json())
      .then((data) => setActiveUsers(data.users))
      .catch(console.error);

    return () => {
      ws.unsubscribe('user-online', handleUserOnline);
      ws.unsubscribe('user-offline', handleUserOffline);
    };
  }, []);

  return activeUsers;
} 