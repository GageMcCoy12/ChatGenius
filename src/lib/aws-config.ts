import { S3Client } from '@aws-sdk/client-s3';
import { ApiGatewayManagementApiClient } from '@aws-sdk/client-apigatewaymanagementapi';

const awsConfig = {
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  websocketUrl: process.env.NEXT_PUBLIC_WEBSOCKET_URL,
  bucketName: process.env.NEXT_PUBLIC_AWS_S3_BUCKET,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  }
} as const;

// Required for file uploads
if (!awsConfig.region) throw new Error('Missing NEXT_PUBLIC_AWS_REGION');
if (!awsConfig.credentials.accessKeyId) throw new Error('Missing NEXT_PUBLIC_AWS_ACCESS_KEY_ID');
if (!awsConfig.credentials.secretAccessKey) throw new Error('Missing NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY');
if (!awsConfig.bucketName) throw new Error('Missing NEXT_PUBLIC_AWS_S3_BUCKET');

// Optional for websocket (only required for real-time features)
const hasWebSocket = !!awsConfig.websocketUrl;

const credentials = {
  accessKeyId: awsConfig.credentials.accessKeyId,
  secretAccessKey: awsConfig.credentials.secretAccessKey
};

// Initialize S3 client for file uploads
export const s3Client = new S3Client({
  region: awsConfig.region,
  credentials,
});

// Initialize WebSocket client if URL is provided
export const wsClient = hasWebSocket 
  ? new ApiGatewayManagementApiClient({
      endpoint: awsConfig.websocketUrl,
      region: awsConfig.region,
      credentials,
    })
  : null;

export const AWS_S3_BUCKET = awsConfig.bucketName; 