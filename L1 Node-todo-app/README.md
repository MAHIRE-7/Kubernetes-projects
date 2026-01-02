# L1 Node.js Todo App

A simple Node.js todo application deployed on Kubernetes demonstrating basic CRUD operations and container orchestration.

## Features

- Add new todos
- Mark todos as complete/incomplete
- Delete todos
- RESTful API endpoints
- Simple web interface

## Project Structure

```
L1 Node-todo-app/
├── app.js                    # Main Node.js application
├── package.json              # Node.js dependencies
├── Dockerfile               # Container configuration
├── public/
│   └── index.html           # Frontend interface
└── k8s/
    ├── node-todo-deployment.yml  # Kubernetes deployment
    └── node-todo-service.yml     # Kubernetes service
```

## Quick Start

### 1. Build Docker Image
```bash
cd "L1 Node-todo-app"
docker build -t node-todo-app:latest .
```

### 2. Deploy to Kubernetes
```bash
kubectl apply -f k8s/node-todo-deployment.yml
kubectl apply -f k8s/node-todo-service.yml
```

### 3. Access the Application
```bash
# Get minikube IP
minikube ip

# Access at: http://<minikube-ip>:30080
```

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

## Verify Deployment

```bash
kubectl get pods
kubectl get services
kubectl logs deployment/node-todo-deployment
```

## Clean Up

```bash
kubectl delete -f k8s/
```