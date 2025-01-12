import { useEffect, useRef } from 'react';
import { PusherService, PusherMessageType, PusherMessage } from '@/lib/services/pusher-service';

let pusherInstance: PusherService | null = null;

export function usePusher() {
  const pusherRef = useRef<PusherService | null>(null);

  useEffect(() => {
    if (!pusherInstance) {
      pusherInstance = new PusherService();
    }
    pusherRef.current = pusherInstance;

    return () => {
      // Only disconnect if this is the last component using Pusher
      if (pusherInstance) {
        pusherInstance.disconnect();
        pusherInstance = null;
      }
    };
  }, []);

  return {
    isConnected: !!pusherRef.current,
    subscribe: (type: PusherMessageType, handler: (message: PusherMessage) => void) => 
      pusherRef.current?.subscribe(type, handler) || (() => {}),
    subscribeToChannel: (channelId: string) => 
      pusherRef.current?.subscribeToChannel(channelId),
    unsubscribeFromChannel: (channelId: string) => 
      pusherRef.current?.unsubscribeFromChannel(channelId),
  };
} 