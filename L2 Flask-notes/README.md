# Flask Notes

Flask note-taking app with persistent text file storage.

## Port
- **NodePort**: 30170
- **Container Port**: 5000

## Quick Start
```bash
# Build image
docker build -t flask-notes:latest .

# Deploy to Kubernetes
kubectl apply -f k8s/notes-all.yml

# Access app
minikube service notes-service -n notes-ns
```

## Developer Info
- **Framework**: Flask (Python)
- **Features**: Create/read/delete text notes, file-based storage
- **K8s Resources**: Deployment, Service, PV, PVC, Namespace

## Challenge
Learn text file persistence and grid-based UI layouts in containerized apps.