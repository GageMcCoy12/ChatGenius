import WebSocket from 'ws';

const wsUrl = 'ws://34.227.161.29';
const userId = 'test-user-1';

console.log('Connecting to WebSocket...');
const ws = new WebSocket(`${wsUrl}?userId=${userId}`);

ws.on('open', () => {
  console.log('Connected to WebSocket');
  
  // Send a test message
  const message = {
    action: 'message',
    channelId: 'test-channel',
    message: 'Hello, WebSocket!'
  };
  
  console.log('Sending message:', message);
  ws.send(JSON.stringify(message));
});

ws.on('message', (data) => {
  console.log('Received response:', data.toString());
  // Close the connection after receiving the response
  ws.close();
});

ws.on('close', () => {
  console.log('Disconnected from WebSocket');
  process.exit(0);
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
}); 