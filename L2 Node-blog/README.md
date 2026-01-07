# Node Blog

Node.js blog application with persistent storage for posts.

## Port
- **NodePort**: 30160
- **Container Port**: 3000

## Quick Start
```bash
# Build image
docker build -t node-blog:latest .

# Deploy to Kubernetes
kubectl apply -f k8s/

# Access app
minikube service blog-service -n blog-ns
```

## Developer Info
- **Framework**: Node.js/Express
- **Features**: Create/read/delete blog posts, JSON file storage
- **K8s Resources**: Deployment, Service, PV, PVC, Namespace

## Challenge
Learn file-based data persistence and JSON storage patterns in Kubernetes.