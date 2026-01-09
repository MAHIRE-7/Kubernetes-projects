# Inventory Management System

Node.js inventory management app with MySQL for stock tracking and alerts.

## Port
- **NodePort**: 30200
- **Container Port**: 3000

## Quick Start
```bash
# Build image
docker build -t inventory-app:latest .

# Deploy to Kubernetes
kubectl apply -f k8s/inventory-all.yml

# Access app
minikube service inventory-service -n inventory-ns
```

## Features
- 📦 Product management with SKU tracking
- 📊 Stock in/out movements with reasons
- ⚠️ Low stock alerts and notifications
- 📈 Dashboard with inventory statistics
- 💰 Total inventory value calculation

## Developer Info
- **Framework**: Node.js/Express + MySQL
- **Features**: Inventory tracking, stock movements, alerts, dashboard
- **K8s Resources**: StatefulSet (MySQL), Deployment (App), Services, ConfigMap

## Challenge
Learn complex database relationships, business logic, and advanced inventory management patterns.