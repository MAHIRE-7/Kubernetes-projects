# Node.js Todo App

Node.js todo application with CRUD operations.

## Port
- **NodePort**: 30080
- **Container Port**: 3000

## Quick Start
```bash
# Build image
docker build -t node-todo-app:latest .

# Deploy to Kubernetes
kubectl apply -f k8s/

# Access app
minikube service node-todo-service
```

## Developer Info
- **Framework**: Node.js/Express
- **Features**: Add, complete, delete todos with REST API
- **K8s Resources**: Deployment, Service, Namespace

## Challenge
Learn CRUD operations and stateless application patterns in containers.