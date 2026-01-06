# Flask Image Gallery

Flask app for uploading and displaying images with persistent storage.

## Port
- **NodePort**: 30140
- **Container Port**: 5000

## Quick Start
```bash
# Build image
docker build -t image-gallery:latest .

# Deploy to Kubernetes
kubectl apply -f k8s/

# Access app
minikube service gallery-app-service
```

## Developer Info
- **Framework**: Flask (Python)
- **Features**: File upload, image gallery, persistent storage
- **K8s Resources**: Deployment, Service, PV, PVC, Namespace

## Challenge
Learn persistent volumes, file handling, and stateful applications in Kubernetes.