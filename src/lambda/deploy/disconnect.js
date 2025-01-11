"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const handler = async (event) => {
    try {
        const connectionId = event.requestContext.connectionId;
        // Remove connection info (in production, you'd remove from database)
        console.log(`Client disconnected: ${connectionId}`);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Disconnected' })
        };
    }
    catch (error) {
        console.error('Error in $disconnect:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' })
        };
    }
};
exports.handler = handler;
//# sourceMappingURL=disconnect.js.map