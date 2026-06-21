import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import morgan from 'morgan';

const app = express();
app.use(morgan('combined'));

// Health check endpoints for the router itself
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'router' });
});

app.get('/api/status/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'router' });
});

app.get('/api/status/readyz', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'router' });
});

// Dynamic proxy middleware
export const sandboxProxy = createProxyMiddleware({
  target: 'http://localhost:9999', // dummy fallback target
  router: (req) => {
    const host = req.headers.host || '';
    const parts = host.split('.');
    
    // We expect at least [<sandboxId>, 'preview', 'localhost']
    if (parts.length >= 3) {
      const sandboxId = parts[0];
      return `http://sandbox-service-${sandboxId}:80`;
    }
    return null;
  },
  changeOrigin: true,
  ws: true,
  onError: (err, req, res) => {
    console.error(`[Router] Proxy error:`, err);
    if (res.writeHead && !res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
    }
    res.end(JSON.stringify({ message: 'Error proxying to sandbox environment', error: err.message }));
  }
});

// Capture all requests that match the subdomain routing
app.use((req, res, next) => {
  const host = req.headers.host || '';
  const parts = host.split('.');
  
  if (parts.length >= 3) {
    return sandboxProxy(req, res, next);
  }
  
  return res.status(400).json({
    message: 'Bad Request: Missing sandbox ID subdomain in Host header',
    host
  });
});

export default app;