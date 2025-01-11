import { WebSocketServer } from 'ws';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage for connections
const connections = new Map();
const channelSubscriptions = new Map();

// Create WebSocket server
const wss = new WebSocketServer({ port: 8080 });

// API Gateway integration routes
app.post('/connect', (req, res) => {
  const { connectionId, userId } = req.body;
  if (!userId || !connectionId) {
    return res.status(400).json({ message: 'userId and connectionId are required' });
  }

  connections.set(connectionId, { userId });
  console.log(`Client connected: ${connectionId} (userId: ${userId})`);
  res.status(200).json({ message: 'Connected' });
});

app.post('/disconnect', (req, res) => {
  const { connectionId } = req.body;
  if (!connectionId) {
    return res.status(400).json({ message: 'connectionId is required' });
  }

  connections.delete(connectionId);
  console.log(`Client disconnected: ${connectionId}`);
  res.status(200).json({ message: 'Disconnected' });
});

app.post('/message', (req, res) => {
  const { connectionId, message } = req.body;
  if (!connectionId || !message) {
    return res.status(400).json({ message: 'connectionId and message are required' });
  }

  const connection = connections.get(connectionId);
  if (!connection) {
    return res.status(404).json({ message: 'Connection not found' });
  }

  try {
    const { channelId, messageContent } = JSON.parse(message);
    
    // Broadcast message to all connected clients in the channel
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocketServer.OPEN) {
        client.send(JSON.stringify({
          action: 'message',
          channelId,
          data: {
            message: messageContent,
            userId: connection.userId,
            connectionId
          }
        }));
      }
    });

    res.status(200).json({ message: 'Message sent' });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ message: 'Error processing message' });
  }
});

// WebSocket server connection handling
wss.on('connection', (ws, req) => {
  const userId = new URL(req.url, 'http://localhost').searchParams.get('userId');
  if (!userId) {
    ws.close(1008, 'userId is required');
    return;
  }

  const connectionId = Math.random().toString(36).substring(2);
  ws._connectionId = connectionId; // Store connectionId on the socket
  connections.set(connectionId, { ws, userId });

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      const { action, channelId, message: messageContent } = message;

      if (action === 'message' && channelId) {
        // Broadcast message to all clients in the channel
        const messageData = JSON.stringify({
          action: 'message',
          channelId,
          data: {
            message: messageContent,
            userId,
            connectionId: ws._connectionId
          }
        });

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocketServer.OPEN) {
            client.send(messageData);
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

  // Send initial connection success message
  ws.send(JSON.stringify({ action: 'connected', connectionId }));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Start HTTP server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`HTTP server listening on port ${PORT}`);
  console.log(`WebSocket server listening on port 8080`);
}); 