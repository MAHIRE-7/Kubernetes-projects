# Simple Webpage

Basic HTML/CSS webpage for Kubernetes deployment.

## Port
- **NodePort**: 30085
- **Container Port**: 80

## Quick Start
```bash
# Build image
docker build -t simple-webpage:latest .

# Deploy to Kubernetes
kubectl apply -f k8s/

# Access app
minikube service simple-webpage-service
```

## Developer Info
- **Framework**: HTML/CSS/Nginx
- **Features**: Static webpage, responsive design
- **K8s Resources**: Deployment, Service, Namespace

## Challenge
Learn containerizing static websites and basic Kubernetes deployment.