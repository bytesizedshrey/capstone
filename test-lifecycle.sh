#!/bin/bash
set -e

echo "=== DELETING EXISTING SANDBOXES ==="
kubectl delete pods -l app=sandbox
kubectl get svc | grep sandbox-service- | awk '{print $1}' | xargs -r kubectl delete svc

echo "=== CREATING NEW SANDBOX ==="
RESPONSE=$(curl -s -X POST http://localhost/api/sandbox/start -H "Content-Type: application/json")
echo $RESPONSE
SANDBOX_ID=$(echo $RESPONSE | grep -o '"sandboxId":"[^"]*' | cut -d'"' -f4)

echo "Created sandbox: $SANDBOX_ID"
echo "Waiting 15 seconds for pod to be ready..."
sleep 15

echo "=== VERIFYING ENDPOINTS ==="
echo "1. List files:"
curl -s -H "Host: ${SANDBOX_ID}.agent.localhost" http://localhost/list-files | head -c 100
echo "..."

echo "2. Preview:"
curl -s -I -H "Host: ${SANDBOX_ID}.preview.localhost" http://localhost/ | head -n 1

echo "=== CHECKING REDIS TTL ==="
kubectl exec deployment/router-deployment -- node -e "const Redis = require('ioredis'); const r = new Redis(process.env.REDIS_URL); r.ttl('sandbox:${SANDBOX_ID}').then(ttl => { console.log('TTL is: ' + ttl); process.exit(0); });"

echo "=== FORCING EXPIRY ==="
kubectl exec deployment/router-deployment -- node -e "const Redis = require('ioredis'); const r = new Redis(process.env.REDIS_URL); r.expire('sandbox:${SANDBOX_ID}', 5).then(() => { console.log('Set TTL to 5 seconds'); process.exit(0); });"

echo "Waiting 10 seconds for cleanup..."
sleep 10

echo "=== VERIFYING CLEANUP ==="
echo "Pods:"
kubectl get pods -l sandboxId=${SANDBOX_ID}
echo "Services:"
kubectl get svc sandbox-service-${SANDBOX_ID} || echo "Service deleted successfully"

