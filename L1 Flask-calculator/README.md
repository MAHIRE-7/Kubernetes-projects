# Flask Calculator

Flask calculator app with basic arithmetic operations.

## Port
- **NodePort**: 30100
- **Container Port**: 5000

## Quick Start
```bash
# Build image
docker build -t flask-calculator:latest .

# Deploy to Kubernetes
kubectl apply -f k8s/

# Access app
minikube service flask-calculator-service
```

## Developer Info
- **Framework**: Flask (Python)
- **Features**: Add, subtract, multiply, divide operations
- **K8s Resources**: Deployment, Service, Namespace

## Challenge
Build REST APIs and learn error handling in web applications.