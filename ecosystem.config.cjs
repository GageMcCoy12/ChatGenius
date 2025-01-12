module.exports = {
  apps: [{
    name: 'websocket-server',
    script: 'websocket-server.cjs',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: 'logs/websocket-error.log',
    out_file: 'logs/websocket-out.log',
    merge_logs: true,
    time: true
  }]
}; 