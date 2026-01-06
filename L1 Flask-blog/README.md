# Flask Blog App

Simple Flask blog application for Kubernetes deployment.

## Port
- **NodePort**: 30105
- **Container Port**: 5000

## Quick Start
```bash
# Build image
docker build -t flask-blog:latest .

# Deploy to Kubernetes
kubectl apply -f k8s/

# Access app
minikube service flask-blog-service
```

## Developer Info
- **Framework**: Flask (Python)
- **Features**: Blog posts, simple UI
- **K8s Resources**: Deployment, Service, Namespace

## Challenge
Learn basic Flask web development and Kubernetes deployment patterns with namespaces.