# 🚀 Kubernetes (K8s) Learning Projects

A comprehensive collection of **hands-on Kubernetes projects** for learning container orchestration, microservices, and cloud-native development. Perfect for DevOps engineers, developers, and students.

## 📚 Learning Path

### **Level 1 (L1)** - Kubernetes Fundamentals
- Basic deployments and services
- Pod management and networking
- Simple web applications

### **Level 2 (L2)** - Intermediate Concepts
- ConfigMaps and Secrets
- Persistent storage (PVC)
- StatefulSets and data persistence

### **Level 3 (L3)** - Advanced Patterns
- Multi-service applications
- Database integration
- Complex networking

### **Level 4 (L4)** - Production Ready
- Resource management
- Health checks and monitoring
- Security best practices

### **Level 5 (L5)** - Enterprise Architecture
- Microservices platforms
- Auto-scaling (HPA)
- Production deployment patterns

## 🗂️ Project Structure

```
K8s/
├── 📁 L1 Projects (Fundamentals)
│   ├── Simple-nginx-app/         # Basic nginx deployment
│   ├── Simple-webpage/           # Static HTML serving
│   ├── Node-todo-app/            # CRUD operations
│   ├── Flask-calculator/         # Python web app
│   ├── weather-app/              # API integration
│   ├── Tic-tac-toe/              # Interactive game
│   └── Random-quote/             # Dynamic content
│
├── 📁 L2 Projects (Intermediate)
│   ├── Flask-file-manager/       # File upload/download
│   ├── Flask-image-gallery/      # Image management
│   ├── Flask-notes/              # Note-taking app
│   ├── Flask-portfolio/          # Portfolio website
│   ├── Node-blog/                # Blogging platform
│   └── Mysql-Statefulsets/       # Database persistence
│
├── 📁 L3 Projects (Advanced)
│   ├── Flask-expense-tracker/    # Financial tracking
│   ├── Node-dual-db-app/         # Multi-database
│   ├── Node-inventory-app/       # Inventory management
│   ├── Node-restaurant-app/      # Restaurant system
│   └── Node-workers-management/  # HR management
│
├── 📁 L4 Projects (Production)
│   ├── Flask-word-pdf-converter/ # Document processing
│   ├── Node-event-management/    # Event planning
│   ├── Node-hospital-management/ # Healthcare system
│   └── Node-tourism-management/  # Travel booking
│
└── 📁 L5 Projects (Enterprise)
    ├── JioHotstar-microservices/ # Streaming platform (3 services)
    ├── Voting-app/               # Microservices voting system
    └── Multitier-ecommerce/      # Full e-commerce platform
```

## 🎯 Featured Projects

### 🎬 **JioHotstar Microservices** (L5)
**Enterprise streaming platform with 3 microservices + 2 databases**
- **User Service**: Authentication & profiles (MongoDB)
- **Content Service**: Movies & shows management (PostgreSQL) 
- **Streaming Service**: Video streaming & watch history
- **Tech Stack**: Node.js, MongoDB, PostgreSQL, Docker, K8s
- **Features**: JWT auth, service discovery, persistent storage

### 🗳️ **Voting App** (L5)
**Real-time voting system with microservices architecture**
- **Vote Frontend**: Python Flask voting interface
- **Redis Queue**: Vote collection and processing
- **Worker**: Python background processor
- **Results**: Node.js real-time dashboard
- **Database**: PostgreSQL with persistent volumes
- **Features**: Queue-based processing, real-time updates

### 🛒 **Multi-tier E-commerce** (L5)
**Full-stack e-commerce platform**
- **Frontend**: React/Angular user interface
- **Backend**: Node.js/Python API services
- **Database**: Multi-database architecture
- **Features**: Shopping cart, payment integration, inventory

## 🚀 Quick Start Guide

### Prerequisites
```bash
# Install required tools
- Kubernetes cluster (minikube/kind/Docker Desktop)
- kubectl CLI
- Docker
- Node.js (for Node.js projects)
- Python (for Flask projects)
```

### 1. Choose Your Level
```bash
# Beginners start here
cd "L1 Simple-nginx-app"

# Advanced users try
cd "L5 JioHotstar-microservices"
```

### 2. Build & Deploy
```bash
# Build Docker image
docker build -t <project-name>:latest .

# Deploy to Kubernetes
kubectl apply -f k8s/

# Check deployment
kubectl get pods,svc
```

### 3. Access Application
```bash
# Get access URL
kubectl get nodes -o wide
# Access: http://<node-ip>:<nodeport>
```

## 📊 Port Assignments

| Project | Port | Level | Technology |
|---------|------|-------|------------|
| Simple-nginx | 30080 | L1 | Nginx |
| Todo-app | 30080 | L1 | Node.js |
| Calculator | 30100 | L1 | Python Flask |
| Weather-app | 30090 | L1 | Node.js |
| Tic-tac-toe | 30110 | L1 | JavaScript |
| JioHotstar User | 30001 | L5 | Node.js + MongoDB |
| JioHotstar Content | 30002 | L5 | Node.js + PostgreSQL |
| JioHotstar Streaming | 30003 | L5 | Node.js |
| Voting App | 30080 | L5 | Python Flask |
| Voting Results | 30090 | L5 | Node.js |

## 🛠️ Kubernetes Concepts Covered

### **Core Resources**
- ✅ Pods & Containers
- ✅ Deployments & ReplicaSets
- ✅ Services (ClusterIP, NodePort, LoadBalancer)
- ✅ Namespaces

### **Storage & Configuration**
- ✅ ConfigMaps & Secrets
- ✅ PersistentVolumes & PersistentVolumeClaims
- ✅ StatefulSets
- ✅ Volume Mounts

### **Advanced Features**
- ✅ Horizontal Pod Autoscaler (HPA)
- ✅ Ingress Controllers
- ✅ Network Policies
- ✅ Resource Limits & Requests
- ✅ Health Checks (Liveness/Readiness Probes)

### **Production Patterns**
- ✅ Microservices Architecture
- ✅ Service Discovery
- ✅ Database Integration
- ✅ Multi-tier Applications
- ✅ CI/CD Integration

## 🎓 Learning Outcomes

After completing these projects, you'll master:

- **Container Orchestration** - Deploy and manage containerized applications
- **Microservices Design** - Build scalable, distributed systems
- **Service Networking** - Configure inter-service communication
- **Data Persistence** - Manage stateful applications and databases
- **Auto-scaling** - Implement dynamic scaling based on load
- **Production Deployment** - Deploy applications with best practices
- **Troubleshooting** - Debug and monitor Kubernetes applications

## 🔧 Essential Commands

```bash
# Cluster Management
kubectl cluster-info
kubectl get nodes

# Application Deployment
kubectl apply -f k8s/
kubectl get pods,svc,deploy

# Debugging
kubectl logs <pod-name>
kubectl describe pod <pod-name>
kubectl exec -it <pod-name> -- /bin/bash

# Scaling
kubectl scale deployment <name> --replicas=3

# Cleanup
kubectl delete -f k8s/
kubectl delete all --all
```

## 🌟 Best Practices Implemented

- **Resource Limits** - CPU and memory constraints
- **Health Checks** - Liveness and readiness probes
- **Security** - Non-root containers, secrets management
- **Monitoring** - Structured logging and metrics
- **Documentation** - Comprehensive README files
- **Version Control** - Git-friendly project structure

## 🤝 Contributing

We welcome contributions! To add a new project:

1. Follow naming convention: `L<level> <project-name>/`
2. Include: `Dockerfile`, `k8s/` manifests, `README.md`
3. Add project description to main README
4. Test deployment on local cluster
5. Submit pull request

## 📖 Additional Resources

- 📚 [Kubernetes Documentation](https://kubernetes.io/docs/)
- 🛠️ [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- 🔧 [Minikube Guide](https://minikube.sigs.k8s.io/docs/)
- 🐳 [Docker Documentation](https://docs.docker.com/)
- ☁️ [Cloud Provider K8s Services](https://kubernetes.io/docs/setup/production-environment/)

## 📈 Skill Progression

```
Beginner (L1) → Intermediate (L2) → Advanced (L3) → Production (L4) → Enterprise (L5)
     ↓               ↓                  ↓              ↓               ↓
  Basic Pods    ConfigMaps &      Multi-service    Resource Mgmt   Microservices
  Services      Secrets           Apps             Health Checks   Auto-scaling
  Deployments   Persistent        Databases        Security        Production
                Storage           Networking       Monitoring      Patterns
```

---

### 🏷️ Tags
`#Kubernetes` `#Docker` `#Microservices` `#DevOps` `#CloudNative` `#ContainerOrchestration` `#Learning` `#HandsOn` `#Projects`

**⭐ Star this repository if it helps you learn Kubernetes!**