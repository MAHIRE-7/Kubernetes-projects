# Workers Management System

Comprehensive workers management system with MongoDB for employee tracking, attendance, and task management.

## Port
- **NodePort**: 30230
- **Container Port**: 3000

## Quick Start
```bash
# Build image
docker build -t workers-management:latest .

# Deploy to Kubernetes
kubectl apply -f k8s/workers-all.yml

# Access system
minikube service workers-service -n workers-ns
```

## Features
- 👷 **Worker Management**: Employee registration with detailed profiles
- 📅 **Attendance Tracking**: Daily attendance with check-in/out times
- 📋 **Task Assignment**: Create and assign tasks with priority levels
- 📊 **Dashboard Analytics**: Real-time statistics and insights
- 🏢 **Department Management**: Organize workers by departments
- 💰 **Salary Tracking**: Employee salary information
- 📱 **Modern UI**: Responsive design with glassmorphism effects

## Database Schema
- **Workers**: Employee profiles with skills and department info
- **Attendance**: Daily attendance records with timestamps
- **Tasks**: Task assignments with priority and status tracking

## Developer Info
- **Framework**: Node.js/Express + MongoDB + Mongoose
- **Features**: CRUD operations, attendance tracking, task management
- **K8s Resources**: Deployment (MongoDB), Deployment (App), PVC (Data Storage)

## Challenge
Learn NoSQL database patterns, document relationships, and employee management systems in Kubernetes.