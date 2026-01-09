# Smart Placement Management System

Comprehensive placement management system for colleges with student registration, company drives, and application tracking.

## Port
- **NodePort**: 30220
- **Container Port**: 3000

## Quick Start
```bash
# Build image
docker build -t placement-system:latest .

# Deploy to Kubernetes
kubectl apply -f k8s/placement-all.yml

# Access system
minikube service placement-service -n placement-ns
```

## Features
- 🎓 **Student Registration**: Profile creation with resume upload
- 🏢 **Company Management**: Drive posting with eligibility criteria
- 📋 **Application Tracking**: Status management and selection process
- 📊 **Dashboard Analytics**: Real-time statistics and insights
- 📁 **File Management**: Resume storage with persistent volumes
- 🔍 **Eligibility Filtering**: Automatic student-company matching

## Developer Info
- **Framework**: Node.js/Express + MySQL + Multer
- **Features**: File uploads, CRUD operations, eligibility matching, dashboard
- **K8s Resources**: StatefulSet (MySQL), Deployment (App), PVC (File Storage)

## Challenge
Learn enterprise application patterns, file handling, and complex database relationships in Kubernetes.