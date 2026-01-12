# Flask Expense Tracker with MongoDB

A modern expense tracking application built with Flask and MongoDB, featuring a beautiful glassmorphism UI design.

## Features

- 💰 Add and track expenses with categories
- 📊 Real-time expense statistics
- 🗂️ Category-based organization (Food, Transport, Shopping, Bills, etc.)
- 📅 Date-based expense tracking
- 🗑️ Delete expenses
- 💎 Modern glassmorphism UI design
- 📱 Responsive design

## Tech Stack

- **Backend**: Python Flask
- **Database**: MongoDB
- **Frontend**: HTML, CSS, JavaScript
- **Containerization**: Docker
- **Orchestration**: Kubernetes

## Quick Start

### 1. Build Docker Image
```bash
cd "L3 Flask-expense-tracker"
docker build -t expense-tracker:latest .
```

### 2. Deploy to Kubernetes
```bash
# Apply all manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods
kubectl get services
```

### 3. Access Application
```bash
# Get minikube IP
minikube ip

# Access at: http://<minikube-ip>:30190
```

## API Endpoints

- `GET /` - Main application interface
- `GET /api/expenses` - Get all expenses with total
- `POST /api/expenses` - Add new expense
- `DELETE /api/expenses/<description>` - Delete expense
- `GET /api/stats` - Get category-wise statistics

## Database Schema

### Expense Document
```json
{
  "description": "Coffee",
  "amount": 4.50,
  "category": "Food",
  "date": "2024-01-15"
}
```

## Kubernetes Resources

- **MongoDB Deployment**: Single replica with persistent storage
- **Flask App Deployment**: 2 replicas for high availability
- **Services**: Internal MongoDB service and external NodePort
- **PersistentVolume**: 1Gi storage for MongoDB data
- **PersistentVolumeClaim**: Storage claim for data persistence

## Environment Variables

- `MONGO_HOST`: MongoDB service hostname (default: localhost)
- `MONGO_PORT`: MongoDB port (default: 27017)

## Port Configuration

- **Application**: Port 30190 (NodePort)
- **MongoDB**: Port 27017 (Internal)

## Cleanup

```bash
kubectl delete -f k8s/
```

## Development

1. Install dependencies: `pip install -r requirements.txt`
2. Run MongoDB locally: `docker run -d -p 27017:27017 mongo:5.0`
3. Start Flask app: `python app.py`
4. Access at: http://localhost:5000