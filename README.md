# Kubernetes (K8s) Projects

This repository contains various Kubernetes projects and configurations for learning and practice purposes.

## Repository Structure

```
K8s/
├── L1 Simple-nginx-app/         # Basic nginx application deployment
├── L1 Simple-webpage/           # Static HTML webpage deployment
├── L1 Node-todo-app/            # Node.js todo application with CRUD operations
├── L1 Flask-calculator/         # Python Flask calculator app
├── L1 weather-app/              # Node.js weather information app
├── L1 Tic-tac-toe/              # Interactive tic-tac-toe game
├── L1 Random-quote/             # Random quote generator app
└── minikube-installation && node/  # Minikube setup and configurations
```

## Projects

### L1 Simple-nginx-app
Basic nginx application deployment demonstrating:
- Pod creation and management
- Deployment configurations
- Service exposure with NodePort

### L1 Simple-webpage
Static HTML webpage deployment showing:
- Custom Docker image creation
- Basic web content serving
- Kubernetes deployment basics

### L1 Node-todo-app
Node.js todo application featuring:
- CRUD operations (Create, Read, Update, Delete)
- RESTful API endpoints
- Interactive web interface
- Express.js server

### L1 Flask-calculator
Python Flask calculator application with:
- Basic arithmetic operations (+, -, ×, ÷)
- Clean web interface
- Error handling (division by zero)
- RESTful API endpoint

### L1 weather-app
Node.js weather information app providing:
- Mock weather data for multiple cities
- City-based weather lookup
- Simple API endpoints
- Interactive web interface

### L1 Tic-tac-toe
Interactive tic-tac-toe game featuring:
- Two-player gameplay (X and O)
- Win/draw detection
- Game reset functionality
- Responsive web design

### L1 Random-quote
Random quote generator app with:
- Collection of inspirational quotes
- Beautiful gradient design
- Random quote API
- Auto-load functionality

## Quick Start Guide

For any project:

1. **Build Docker Image:**
   ```bash
   cd "L1 <project-name>"
   docker build -t <project-name>:latest .
   ```

2. **Deploy to Kubernetes:**
   ```bash
   kubectl apply -f k8s/
   ```

3. **Access Application:**
   ```bash
   minikube ip
   # Access at: http://<minikube-ip>:<nodeport>
   ```

## Port Assignments

- Simple-nginx-app: 30080
- Node-todo-app: 30080
- Flask-calculator: 30100
- weather-app: 30090
- Tic-tac-toe: 30110
- Random-quote: 30120

## Prerequisites

- Kubernetes cluster (minikube, kind, or cloud provider)
- kubectl CLI tool
- Docker (for local development)
- Node.js (for Node.js projects)
- Python (for Flask projects)

## Getting Started

1. Clone this repository
2. Start minikube: `minikube start`
3. Navigate to desired project folder
4. Build Docker image
5. Apply Kubernetes manifests
6. Access via minikube service or NodePort

## Verification Commands

```bash
# Check pods
kubectl get pods

# Check services
kubectl get services

# Check deployments
kubectl get deployments

# View logs
kubectl logs deployment/<deployment-name>

# Access service
minikube service <service-name>
```

## Clean Up

```bash
# Delete specific project
kubectl delete -f k8s/

# Delete all resources
kubectl delete all --all
```

## Contributing

Feel free to add new projects and configurations. Follow the naming convention:
- `L<number>` for learning levels
- Descriptive folder names
- Include all necessary files (Dockerfile, k8s manifests, README)

## Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Minikube Documentation](https://minikube.sigs.k8s.io/docs/)
- [Docker Documentation](https://docs.docker.com/)