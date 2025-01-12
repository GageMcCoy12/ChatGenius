import PusherServer from 'pusher';

if (!process.env.PUSHER_APP_ID) throw new Error('PUSHER_APP_ID is required');
if (!process.env.PUSHER_KEY) throw new Error('PUSHER_KEY is required');
if (!process.env.PUSHER_SECRET) throw new Error('PUSHER_SECRET is required');
if (!process.env.PUSHER_CLUSTER) throw new Error('PUSHER_CLUSTER is required');

export const pusher = new PusherServer({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

export async function broadcastMessage(channelId: string, message: any) {
  try {
    await pusher.trigger(`presence-channel-${channelId}`, 'message', message);
    console.log('Message broadcasted:', { channelId, message });
  } catch (error) {
    console.error('Failed to broadcast message:', error);
    throw error;
  }
}

export async function broadcastChannelCreated(channelId: string, channel: any) {
  try {
    await pusher.trigger(`presence-channel-${channelId}`, 'channel-created', channel);
    console.log('Channel created event broadcasted:', { channelId, channel });
  } catch (error) {
    console.error('Failed to broadcast channel created event:', error);
    throw error;
  }
}

export async function broadcastChannelUpdated(channelId: string, channel: any) {
  try {
    await pusher.trigger(`presence-channel-${channelId}`, 'channel-updated', channel);
    console.log('Channel updated event broadcasted:', { channelId, channel });
  } catch (error) {
    console.error('Failed to broadcast channel updated event:', error);
    throw error;
  }
} 