"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const wsUrl = 'wss://z7p9k72wtc.execute-api.us-east-1.amazonaws.com/production';
const userId = 'test-user-1';
console.log('Connecting to WebSocket...');
const ws = new ws_1.default(`${wsUrl}?userId=${userId}`);
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
//# sourceMappingURL=test-websocket.js.map