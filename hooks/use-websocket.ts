'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useAuth } from '@clerk/nextjs';

interface WebSocketEvent {
  action: string;
  channelId?: string;
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
  const wsRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<Map<string, Set<EventHandler>>>(new Map());
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    if (!process.env.NEXT_PUBLIC_AWS_WSS_URL) {
      console.error('WebSocket URL not configured');
      return;
    }

    const wsUrl = `${process.env.NEXT_PUBLIC_AWS_WSS_URL}?userId=${userId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data: WebSocketEvent = JSON.parse(event.data);
        if (data.channelId) {
          const channelHandlers = handlersRef.current.get(data.channelId);
          if (channelHandlers) {
            channelHandlers.forEach(handler => handler(data));
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      setTimeout(() => {
        if (wsRef.current?.readyState === WebSocket.CLOSED) {
          connect();
        }
      }, 5000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current = ws;
  }, [userId]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const subscribe = useCallback((channelId: string, handler: EventHandler) => {
    if (!handlersRef.current.has(channelId)) {
      handlersRef.current.set(channelId, new Set());
    }
    handlersRef.current.get(channelId)?.add(handler);

    return () => {
      handlersRef.current.get(channelId)?.delete(handler);
      if (handlersRef.current.get(channelId)?.size === 0) {
        handlersRef.current.delete(channelId);
      }
    };
  }, []);

  const send = useCallback((channelId: string, action: string, data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        action,
        channelId,
        data
      }));
    } else {
      console.error('WebSocket is not connected');
    }
  }, []);

  useEffect(() => {
    if (userId) {
      connect();
      return () => disconnect();
    }
  }, [userId, connect, disconnect]);

  return {
    subscribe,
    send,
    isConnected
  };
} 