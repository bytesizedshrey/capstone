#!/bin/bash
set -e

echo "=== CREATING NEW SANDBOX ==="
RESPONSE=$(curl -s -X POST http://localhost/api/sandbox/start -H "Content-Type: application/json")
SANDBOX_ID=$(echo $RESPONSE | grep -o '"sandboxId":"[^"]*' | cut -d'"' -f4)

echo "Created sandbox: $SANDBOX_ID"
echo "Waiting 15 seconds for pod to be ready..."
sleep 15

echo "=== FIXING VITE CONFIG IN POD ==="
kubectl exec -c sandbox-container sandbox-pod-${SANDBOX_ID} -- sh -c 'cat << "INNER_EOF" > /workspace/vite.config.js
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
export default defineConfig({
  plugins: [react()],
  server:{
    host: true,
    port: 5174,
    hmr : {clientPort: 80, protocol: "ws"},
    watch:{ usePolling : true, interval : 300, ignored : ["node_modules"] }
  }
})
INNER_EOF'

echo "Waiting 5 seconds for Vite to restart..."
sleep 5

echo "=== VERIFYING ENDPOINTS ==="
echo "1. List files (Agent):"
curl -s -I -H "Host: ${SANDBOX_ID}.agent.localhost" http://localhost/list-files | head -n 1
echo "2. Preview (Vite):"
curl -s -I -H "Host: ${SANDBOX_ID}.preview.localhost" http://localhost/ | head -n 1

echo "=== VERIFYING CLEANUP ==="
kubectl exec deployment/router-deployment -- node -e "const Redis = require('ioredis'); const r = new Redis(process.env.REDIS_URL); r.expire('sandbox:${SANDBOX_ID}', 5);"
sleep 10
kubectl get pods -l sandboxId=${SANDBOX_ID} || echo "Pod deleted!"
kubectl get svc sandbox-service-${SANDBOX_ID} || echo "Service deleted!"

