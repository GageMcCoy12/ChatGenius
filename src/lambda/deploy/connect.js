"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const handler = async (event) => {
    try {
        const userId = event.queryStringParameters?.userId;
        const connectionId = event.requestContext.connectionId;
        if (!userId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'userId is required' })
            };
        }
        // Store connection info in memory (we'll use this for now since we don't have DynamoDB)
        // In a production environment, you'd want to store this in a database
        console.log(`Client connected: ${connectionId} (userId: ${userId})`);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Connected' })
        };
    }
    catch (error) {
        console.error('Error in $connect:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' })
        };
    }
};
exports.handler = handler;
//# sourceMappingURL=connect.js.map