# Flask File Manager

Flask app for file upload, download, and management with persistent storage.

## Port
- **NodePort**: 30150
- **Container Port**: 5000

## Quick Start
```bash
# Build image
docker build -t file-manager:latest .

# Deploy to Kubernetes
kubectl apply -f k8s/

# Access app
minikube service file-manager-service -n file-manager-ns
```

## Developer Info
- **Framework**: Flask (Python)
- **Features**: File upload/download/delete, persistent storage
- **K8s Resources**: Deployment, Service, PV, PVC, Namespace

## Challenge
Learn file operations, persistent volumes, and data persistence in Kubernetes.