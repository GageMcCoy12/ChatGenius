'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';
import { WebSocketService } from '@/lib/websocket';

interface WebSocketEvent {
  action: string;
  data: any;
}

type EventHandler = (event: WebSocketEvent) => void;

export interface UseWebSocketReturn {
  subscribe: (action: string, handler: EventHandler) => () => void;
  send: (channelId: string, action: string, data: any) => void;
  isConnected: boolean;
}

export function useWebSocket(): UseWebSocketReturn {
  const { userId } = useAuth();
  const wsService = useRef<WebSocketService>(WebSocketService.getInstance());

  useEffect(() => {
    if (!userId) return;

    // Connect to WebSocket when component mounts
    wsService.current.connect(userId).catch(error => {
      console.error('Failed to connect to WebSocket:', error);
    });

    // Cleanup on unmount
    return () => {
      wsService.current.disconnect();
    };
  }, [userId]);

  const subscribe = useCallback((action: string, handler: EventHandler) => {
    return wsService.current.subscribe(action, handler);
  }, []);

  const send = useCallback((channelId: string, action: string, data: any) => {
    wsService.current.send(action, {
      channelId,
      message: data,
      userId,
    });
  }, [userId]);

  return {
    subscribe,
    send,
    isConnected: wsService.current.isConnected,
  };
} 