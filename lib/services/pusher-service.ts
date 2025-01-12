import Pusher, { Channel } from 'pusher-js';

/**
 * Message types that can be received
 */
export type PusherMessageType = 
  | 'message' 
  | 'channel-created' 
  | 'channel-updated';

/**
 * Message structure
 */
export interface PusherMessage {
  type: PusherMessageType;
  channelId: string;
  message: any;
}

/**
 * Message handler type
 */
type MessageHandler = (message: PusherMessage) => void;

/**
 * Pusher service for handling real-time communication
 */
export class PusherService {
  private pusher: Pusher;
  private channels = new Map<string, Channel>();
  private messageHandlers = new Map<PusherMessageType, Set<MessageHandler>>();

  constructor() {
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY || !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
      throw new Error('Pusher configuration missing');
    }

    this.pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });
  }

  /**
   * Subscribe to a specific channel
   */
  public subscribeToChannel(channelId: string): void {
    if (this.channels.has(channelId)) {
      console.log(`Already subscribed to channel: ${channelId}`);
      return;
    }

    console.log(`📡 Subscribing to channel: ${channelId}`);
    const channel = this.pusher.subscribe(`presence-channel-${channelId}`);
    this.channels.set(channelId, channel);

    // Bind to message events
    channel.bind('message', (data: any) => {
      console.log('📥 Received message:', data);
      this.handleMessage({
        type: 'message',
        channelId,
        message: data
      });
    });

    // Bind to channel events
    channel.bind('channel-created', (data: any) => {
      this.handleMessage({
        type: 'channel-created',
        channelId,
        message: data
      });
    });

    channel.bind('channel-updated', (data: any) => {
      this.handleMessage({
        type: 'channel-updated',
        channelId,
        message: data
      });
    });
  }

  /**
   * Unsubscribe from a specific channel
   */
  public unsubscribeFromChannel(channelId: string): void {
    const channel = this.channels.get(channelId);
    if (channel) {
      console.log(`Unsubscribing from channel: ${channelId}`);
      this.pusher.unsubscribe(`presence-channel-${channelId}`);
      this.channels.delete(channelId);
    }
  }

  /**
   * Subscribe to a specific message type
   */
  public subscribe(type: PusherMessageType, handler: MessageHandler): () => void {
    console.log(`Registering handler for type: ${type}`);
    
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set());
    }
    
    const handlers = this.messageHandlers.get(type)!;
    handlers.add(handler);
    
    return () => {
      console.log(`Unregistering handler for type: ${type}`);
      const handlers = this.messageHandlers.get(type);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.messageHandlers.delete(type);
        }
      }
    };
  }

  /**
   * Handle incoming messages
   */
  private handleMessage(message: PusherMessage): void {
    const handlers = this.messageHandlers.get(message.type);
    
    console.log(`Looking for handlers of type: ${message.type}`, {
      handlersFound: !!handlers,
      handlersCount: handlers?.size || 0,
      availableTypes: Array.from(this.messageHandlers.keys())
    });

    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(message);
        } catch (error) {
          console.error('❌ Error in message handler:', error);
        }
      });
    }
  }

  /**
   * Disconnect from Pusher
   */
  public disconnect(): void {
    this.channels.forEach((_, channelId) => {
      this.unsubscribeFromChannel(channelId);
    });
    this.pusher.disconnect();
  }
} 