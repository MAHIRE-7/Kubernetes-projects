# Random Quote Generator

Node.js app that displays random inspirational quotes.

## Port
- **NodePort**: 30120
- **Container Port**: 3000

## Quick Start
```bash
# Build image
docker build -t random-quote:latest .

# Deploy to Kubernetes
kubectl apply -f k8s/

# Access app
minikube service random-quote-service
```

## Developer Info
- **Framework**: Node.js/Express
- **Features**: Random quote API, gradient UI
- **K8s Resources**: Deployment, Service

## Challenge
Build a simple API service and learn container deployment basics.