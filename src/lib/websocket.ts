import { useAuth } from '@clerk/nextjs';

type WebSocketMessage = {
  action: string;
  data: any;
};

export class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private messageQueue: WebSocketMessage[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private messageHandlers: Map<string, Set<(data: any) => void>> = new Map();
  private pingInterval: NodeJS.Timeout | null = null;
  private visibilityHandler: (() => void) | null = null;
  public isConnected: boolean = false;

  private constructor() {
    // Set up visibility change handler
    if (typeof document !== 'undefined') {
      this.visibilityHandler = () => {
        if (document.visibilityState === 'visible') {
          console.log('Page became visible, processing any pending messages');
          this.processQueue();
        }
      };
      document.addEventListener('visibilitychange', this.visibilityHandler);
    }
  }

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  private setupPingPong() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
    
    // Send a ping every 30 seconds to keep the connection alive
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send('ping', { timestamp: Date.now() });
      }
    }, 30000);
  }

  async connect(userId: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    const wsUrl = process.env.NEXT_PUBLIC_AWS_WSS_URL;
    if (!wsUrl) {
      throw new Error('WebSocket URL not configured');
    }

    console.log('Connecting to WebSocket:', wsUrl);
    return new Promise<void>((resolve, reject) => {
      try {
        this.ws = new WebSocket(`${wsUrl}?userId=${userId}`);

        this.ws.onopen = () => {
          console.log('WebSocket connected successfully');
          this.reconnectAttempts = 0;
          this.reconnectDelay = 1000;
          this.isConnected = true;
          
          // Setup ping/pong
          this.setupPingPong();
          
          // Process any messages that were queued while disconnected
          this.processQueue();
          
          resolve();
        };

        this.ws.onmessage = this.handleMessage.bind(this);

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.attemptReconnect(userId);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.isConnected = false;
          this.ws = null;
          if (this.pingInterval) {
            clearInterval(this.pingInterval);
          }
          this.attemptReconnect(userId);
        };
      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        reject(error);
      }
    });
  }

  private handleMessage(event: MessageEvent) {
    console.log('Raw WebSocket message received:', event.data);
    try {
      const message = JSON.parse(event.data);
      console.log('Parsed WebSocket message:', message);
      
      // Handle pong response
      if (message.action === 'pong') {
        console.log('Received pong:', message.data);
        return;
      }
      
      // Process message immediately regardless of visibility state
      this.processMessage(message);
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  }

  private processMessage(message: any) {
    const handlers = this.messageHandlers.get(message.action);
    if (handlers) {
      console.log('Found handlers for action:', message.action);
      handlers.forEach((handler) => {
        try {
          handler(message.data);
          console.log('Handler executed successfully for action:', message.action);
        } catch (error) {
          console.error('Error in message handler:', error);
        }
      });
    } else {
      console.log('No handlers found for action:', message.action);
    }
  }

  private processQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        console.log('Processing queued message:', message);
        this.send(message.action, message.data);
      }
    }
  }

  private attemptReconnect(userId: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect in ${delay}ms...`);
      setTimeout(() => this.connect(userId), delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  subscribe(action: string, handler: (data: any) => void) {
    console.log('Subscribing to action:', action);
    if (!this.messageHandlers.has(action)) {
      this.messageHandlers.set(action, new Set());
    }
    this.messageHandlers.get(action)?.add(handler);
    console.log('Current handlers for action:', action, this.messageHandlers.get(action)?.size);

    return () => {
      console.log('Unsubscribing from action:', action);
      this.messageHandlers.get(action)?.delete(handler);
    };
  }

  send(action: string, data: any) {
    console.log('Attempting to send message:', { action, data });
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.log('WebSocket not ready, queueing message');
      this.messageQueue.push({ action, data });
      return;
    }

    try {
      const message = JSON.stringify({ action, data });
      console.log('Sending WebSocket message:', message);
      this.ws.send(message);
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      this.messageQueue.push({ action, data });
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.messageQueue = [];
      this.messageHandlers.clear();
      this.reconnectAttempts = 0;
      
      // Clean up visibility handler
      if (this.visibilityHandler && typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', this.visibilityHandler);
      }
    }
  }
} 