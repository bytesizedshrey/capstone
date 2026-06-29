# Hateable

![Hateable Landing Screen](screenshot.png)

## overview
Hateable is a secure, isolated sandbox playground that allows you to yap your dream frontend applications into existence before the climate collapses. We do the heavy labor while you sit there, rethink every single life choice, and slowly disassociate. 

loveable on a low budget? Sure. Perfect? Absolutely not. It is what it is.

## features
- **zero-config sandboxes:** Boot up isolated environments in seconds, or whenever our Kubernetes cluster decides it wants to cooperate.
- **neo-brutalist ui:** Hard borders, sharp shadows, and vibrant colors. Because who needs rounded corners in a world this harsh?
- **ai-powered code generation:** A dryly cynical, emoji-free AI assistant who writes React code while secretly judging your business model.
- **tactile interactions:** Knobs, sliders, active scaling, and buttons that respond to your desperate clicks.

## running locally (if you must)
We utilize a Kubernetes-based microservice architecture because keeping things simple is too mainstream.

### 1. prerequisites
- Docker Desktop with Kubernetes enabled (give it all your RAM; it's hungry).
- Skaffold (to orchestrate the microservice chaos).

### 2. startup
Boot up the local services:
```bash
skaffold dev
```
Wait for it to build and deploy. If it remains in `Pending` due to `Insufficient memory`, delete your other Docker containers and contemplate why you didn't buy a computer with 64GB of RAM.

Once all pods are running (it actually works now, we patched the S3 regions), head to your local ingress domain and start yapping.

## architecture
It's a full microservices stack:
- **router:** Proxies traffic to dynamic sandboxes. Usually returns 504 when things are going downhill.
- **auth:** Handles Google OAuth so big tech can track your failed SaaS startups.
- **ai-orchestration:** Translates your prompts into code.
- **sandbox-api:** Provisioning pipeline that spins up custom pods for your preview, terminal, and code workspace.
- **sync-agent:** Synchronizes your code with S3 (now correctly pointing to `ap-south-1` without crash-looping).

## license
MIT. Or whatever. Copy it if you want, it's not like the economy is recovering anyway.
