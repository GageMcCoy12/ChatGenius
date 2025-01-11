"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_sdk_1 = require("aws-sdk");
const handler = async (event) => {
    try {
        const domain = event.requestContext.domainName;
        const stage = event.requestContext.stage;
        const connectionId = event.requestContext.connectionId;
        if (!connectionId) {
            throw new Error('ConnectionId is required');
        }
        // Create API Gateway Management API client
        const apigwManagementApi = new aws_sdk_1.ApiGatewayManagementApi({
            apiVersion: '2018-11-29',
            endpoint: `${domain}/${stage}`
        });
        // Parse the message from the event body
        const body = JSON.parse(event.body || '{}');
        const { channelId, message } = body;
        if (!channelId || !message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'channelId and message are required' })
            };
        }
        // For now, we'll just echo the message back to the sender
        try {
            await apigwManagementApi.postToConnection({
                ConnectionId: connectionId,
                Data: Buffer.from(JSON.stringify({
                    action: 'message',
                    channelId,
                    data: {
                        message,
                        connectionId
                    }
                }))
            }).promise();
        }
        catch (error) {
            if (error.statusCode === 410) {
                // Connection is stale
                console.log(`Stale connection: ${connectionId}`);
            }
            else {
                throw error;
            }
        }
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Message sent' })
        };
    }
    catch (error) {
        console.error('Error in message handler:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' })
        };
    }
};
exports.handler = handler;
//# sourceMappingURL=message.js.map