import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

// Debug environment variables
console.log('Environment Variables Check:', {
  PUSHER_APP_ID: process.env.PUSHER_APP_ID,
  PUSHER_KEY: process.env.PUSHER_KEY,
  PUSHER_SECRET: process.env.PUSHER_SECRET,
  PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,
  NEXT_PUBLIC_PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY,
  NEXT_PUBLIC_PUSHER_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
});

// Validate server-side Pusher configuration
const pusherServerConfig = {
  appId: process.env.PUSHER_APP_ID || '',
  key: process.env.PUSHER_KEY || '',
  secret: process.env.PUSHER_SECRET || '',
  cluster: process.env.PUSHER_CLUSTER || '',
  useTLS: true,
};

// Validate client-side Pusher configuration
const pusherClientConfig = {
  key: process.env.NEXT_PUBLIC_PUSHER_KEY || '',
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || '',
};

console.log('Pusher Server Config:', pusherServerConfig);
console.log('Pusher Client Config:', pusherClientConfig);

// Check if all required server-side variables are present
if (!pusherServerConfig.appId || !pusherServerConfig.key || !pusherServerConfig.secret || !pusherServerConfig.cluster) {
  console.error('Missing Pusher server configuration:', {
    hasAppId: !!pusherServerConfig.appId,
    hasKey: !!pusherServerConfig.key,
    hasSecret: !!pusherServerConfig.secret,
    hasCluster: !!pusherServerConfig.cluster,
  });
  throw new Error('Missing Pusher server configuration');
}

// Check if all required client-side variables are present
if (!pusherClientConfig.key || !pusherClientConfig.cluster) {
  console.error('Missing Pusher client configuration:', {
    hasKey: !!pusherClientConfig.key,
    hasCluster: !!pusherClientConfig.cluster,
  });
  throw new Error('Missing Pusher client configuration');
}

export const pusherServer = new PusherServer(pusherServerConfig);

export const pusherClient = new PusherClient(pusherClientConfig.key, {
  cluster: pusherClientConfig.cluster,
}); 