const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { ApiGatewayManagementApiClient, PostToConnectionCommand } = require('@aws-sdk/client-apigatewaymanagementapi');

const dynamodb = new DynamoDBClient({ region: process.env.AWS_REGION });
const connections = new Map();

exports.handler = async (event) => {
  const { requestContext: { connectionId, routeKey }, body } = event;

  try {
    switch (routeKey) {
      case '$connect':
        // Store connection
        connections.set(connectionId, {
          timestamp: Date.now(),
        });
        return { statusCode: 200, body: 'Connected.' };

      case '$disconnect':
        // Remove connection
        connections.delete(connectionId);
        return { statusCode: 200, body: 'Disconnected.' };

      case 'message':
        const messageData = JSON.parse(body);
        const apiGateway = new ApiGatewayManagementApiClient({
          endpoint: process.env.WEBSOCKET_API_ENDPOINT,
        });

        // Broadcast to all connections except sender
        const sendPromises = Array.from(connections.keys())
          .filter(id => id !== connectionId)
          .map(async (id) => {
            try {
              await apiGateway.send(
                new PostToConnectionCommand({
                  ConnectionId: id,
                  Data: Buffer.from(JSON.stringify({
                    action: 'message',
                    data: messageData,
                  })),
                })
              );
            } catch (error) {
              if (error.statusCode === 410) {
                connections.delete(id);
              }
              console.error(`Error sending message to ${id}:`, error);
            }
          });

        await Promise.all(sendPromises);
        return { statusCode: 200, body: 'Message sent.' };

      default:
        return { statusCode: 400, body: 'Unknown route.' };
    }
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: 'Internal server error.' };
  }
}; 