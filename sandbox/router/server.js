import app, { sandboxProxy } from './src/app.js';

const PORT = process.env.PORT || 80;

const server = app.listen(PORT, () => {
  console.log(`Router service is running on port ${PORT}`);
});

// Handle WebSocket upgrade manually to support Vite HMR
server.on('upgrade', sandboxProxy.upgrade);
