# L1 Tic-Tac-Toe Game

A simple tic-tac-toe game deployed on Kubernetes with interactive web interface.

## Features

- Two-player game (X and O)
- Win detection
- Draw detection
- Reset game functionality
- Responsive design

## Quick Start

### 1. Build Docker Image
```bash
cd "L1 Tic-tac-toe"
docker build -t tic-tac-toe:latest .
```

### 2. Deploy to Kubernetes
```bash
kubectl apply -f k8s/tic-tac-toe-deployment.yml
kubectl apply -f k8s/tic-tac-toe-service.yml
```

### 3. Access the Game
```bash
minikube ip
# Access at: http://<minikube-ip>:30110
```

## How to Play

1. Players take turns clicking empty cells
2. X goes first
3. Get 3 in a row (horizontal, vertical, or diagonal) to win
4. Click "New Game" to restart

## Clean Up

```bash
kubectl delete -f k8s/
```