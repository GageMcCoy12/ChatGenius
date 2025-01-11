"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const handler = async (event) => {
    try {
        const routeKey = event.requestContext.routeKey;
        const connectionId = event.requestContext.connectionId;
        console.log(`Route: ${routeKey}, ConnectionId: ${connectionId}`);
        // Handle different route types
        switch (routeKey) {
            case '$connect':
                const userId = event.queryStringParameters?.userId;
                if (!userId) {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({ message: 'userId is required' })
                    };
                }
                console.log(`Client connected: ${connectionId} (userId: ${userId})`);
                return { statusCode: 200, body: 'Connected' };
            case '$disconnect':
                console.log(`Client disconnected: ${connectionId}`);
                return { statusCode: 200, body: 'Disconnected' };
            case 'message':
                const body = JSON.parse(event.body || '{}');
                const { channelId, message } = body;
                if (!channelId || !message) {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({ message: 'channelId and message are required' })
                    };
                }
                // Log the message instead of trying to send it back
                console.log(`Message received in channel ${channelId}: ${message}`);
                console.log('From connection:', connectionId);
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'Message received',
                        channelId,
                        connectionId
                    })
                };
            default:
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: `Unsupported route: ${routeKey}` })
                };
        }
    }
    catch (error) {
        console.error('Error in handler:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' })
        };
    }
};
exports.handler = handler;
//# sourceMappingURL=handleMessage.js.map