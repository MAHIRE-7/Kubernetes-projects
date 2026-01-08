# Restaurant Management App

Node.js restaurant management system with MySQL database for menu and orders.

## Port
- **NodePort**: 30190
- **Container Port**: 3000

## Quick Start
```bash
# Build image
docker build -t restaurant-app:latest .

# Deploy to Kubernetes
kubectl apply -f k8s/restaurant-all.yml

# Access app
minikube service restaurant-service -n restaurant-ns
```

## Features
- 🍽️ Menu management (add items by category)
- 📋 Order placement with shopping cart
- 💾 MySQL database with persistent storage
- 📊 Order history and tracking

## Developer Info
- **Framework**: Node.js/Express + MySQL
- **Features**: Restaurant operations, database integration, real-time cart
- **K8s Resources**: StatefulSet (MySQL), Deployment (App), Services, ConfigMap, Secret

## Challenge
Learn multi-tier applications with database connectivity and StatefulSet patterns.