import server from './src/app.js';

const PORT = process.env.PORT || 80;

// let the router cook on this port
server.listen(PORT, () => {
  console.log(`Router service is running on port ${PORT}`);
});
