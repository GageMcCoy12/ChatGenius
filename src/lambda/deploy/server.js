"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const http_1 = require("http");
// Create HTTP server
const server = (0, http_1.createServer)();
// Create WebSocket server
const wss = new ws_1.WebSocketServer({ server });
// Store active connections
const connections = new Map();
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
            const message = JSON.parse(data.toString());
            const { action, channelId, message: messageContent } = message;
            console.log(`Received message from ${connectionId}:`, message);
            if (action === 'message' && channelId) {
                // Broadcast message to all clients in the channel
                const broadcastMessage = JSON.stringify({
                    action: 'message',
                    channelId,
                    data: {
                        message: messageContent,
                        userId,
                        connectionId
                    }
                });
                // Send to all connected clients
                connections.forEach(({ ws: client }) => {
                    if (client.readyState === ws_1.WebSocket.OPEN) {
                        client.send(broadcastMessage);
                    }
                });
            }
        }
        catch (error) {
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
//# sourceMappingURL=server.js.map