# Weather App

Node.js weather information app with city-based lookup.

## Port
- **NodePort**: 30091
- **Container Port**: 3000

## Quick Start
```bash
# Build image
docker build -t weather-app:latest .

# Deploy to Kubernetes
kubectl apply -f k8s/

# Access app
minikube service weather-app-service
```

## Developer Info
- **Framework**: Node.js/Express
- **Features**: Mock weather data, city lookup API
- **K8s Resources**: Deployment, Service, Namespace

## Challenge
Build REST APIs and learn data handling in containerized applications.