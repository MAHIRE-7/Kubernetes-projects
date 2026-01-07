# Flask Portfolio

Beautiful developer portfolio with project management and persistent storage.

## Port
- **NodePort**: 30180
- **Container Port**: 5000

## Quick Start
```bash
# Build image
docker build -t flask-portfolio:latest .

# Deploy to Kubernetes
kubectl apply -f k8s/portfolio-all.yml

# Access app
minikube service portfolio-service -n portfolio-ns
```

## Features
- 🎨 Modern gradient design with animations
- 📱 Responsive grid layout
- ⚙️ Admin panel for project management
- 💾 Persistent JSON storage
- 🔗 GitHub and demo links

## Developer Info
- **Framework**: Flask (Python)
- **Features**: Portfolio showcase, project CRUD, modern UI
- **K8s Resources**: Deployment, Service, PV, PVC, Namespace

## Challenge
Build attractive UIs with advanced CSS and learn JSON-based data persistence.