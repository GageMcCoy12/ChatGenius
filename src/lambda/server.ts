import { WebSocket, WebSocketServer } from 'ws';
import { createServer } from 'http';

// Create HTTP server
const server = createServer();

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Store active connections
const connections = new Map<string, { ws: WebSocket; userId: string }>();

wss.on('connection', (ws, request) => {
  // Get userId from URL parameters
  const url = new URL(request.url || '', `http://${request.headers.host}`);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    ws.close(1008, 'userId is required');
    return;
  }

  // Generate a unique connectionId
  const connectionId = Math.random().toString(36).substring(2);
  connections.set(connectionId, { ws, userId });

  console.log(`Client connected: ${connectionId} (userId: ${userId})`);

  // Send connection confirmation
  ws.send(JSON.stringify({
    action: 'connected',
    connectionId,
    userId
  }));

  ws.on('message', (data) => {
    try {
      const parsedData = JSON.parse(data.toString());
      console.log('Received raw message:', parsedData);

      const { action, data: messageData } = parsedData;

      // Handle ping messages
      if (action === 'ping') {
        console.log('Received ping, sending pong');
        ws.send(JSON.stringify({
          action: 'pong',
          data: messageData
        }));
        return;
      }

      const { channelId, message, userId } = messageData;
      console.log('Processing message:', { action, channelId, message, userId });

      if (action === 'message' && channelId) {
        // Broadcast message to all clients in the channel
        const broadcastMessage = JSON.stringify({
          action: 'message',
          data: {
            channelId,
            message,
            userId
          }
        });

        console.log('Broadcasting message:', broadcastMessage);

        // Send to all connected clients
        connections.forEach(({ ws: client }) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(broadcastMessage);
          }
        });
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log(`Client disconnected: ${connectionId}`);
    connections.delete(connectionId);
  });

  ws.on('error', (error) => {
    console.error(`Error for connection ${connectionId}:`, error);
    connections.delete(connectionId);
  });
});

// Start server
const PORT = process.env.PORT || 80;
server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
}); 