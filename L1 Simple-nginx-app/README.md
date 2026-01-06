# Simple Nginx App

Basic nginx web server deployment.

## Port
- **NodePort**: 30080
- **Container Port**: 80

## Quick Start
```bash
# Deploy to Kubernetes
kubectl apply -f namespace.yml
kubectl apply -f nginx-deployment.yml
kubectl apply -f nginx-service.yml

# Access app
minikube service nginx-service
```

## Developer Info
- **Framework**: Nginx
- **Features**: Static web serving
- **K8s Resources**: Deployment, Service, Namespace

## Challenge
Learn basic Kubernetes concepts: pods, deployments, and services with nginx.