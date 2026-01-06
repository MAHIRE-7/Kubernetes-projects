# Rock Paper Scissors Game

Interactive web-based Rock Paper Scissors game.

## Port
- **NodePort**: 30130
- **Container Port**: 3000

## Quick Start
```bash
# Build image
docker build -t rock-paper-scissors:latest .

# Deploy to Kubernetes
kubectl apply -f k8s/

# Access app
minikube service rock-paper-scissors-service
```

## Developer Info
- **Framework**: Node.js/Express
- **Features**: Interactive gameplay, score tracking
- **K8s Resources**: Deployment, Service

## Challenge
Create interactive web games and understand stateless application deployment.