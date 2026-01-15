# Multi-Tier E-Commerce Application

A complete multi-tier e-commerce application with separate frontend, backend, MySQL for users, and MongoDB for products/orders.

## Architecture

```
Frontend (Node.js) → Backend API (Node.js) → MySQL (Users)
                                           → MongoDB (Products/Orders)
```

## Features

- 🛒 **Product Catalog**: Browse and view products
- 👤 **User Authentication**: JWT-based auth with MySQL
- 📦 **Order Management**: Create and track orders in MongoDB
- 🎨 **Modern UI**: Glassmorphism design
- 🔐 **Secure API**: Token-based authentication
- 📊 **Multi-Database**: MySQL for users, MongoDB for products/orders

## Tech Stack

- **Frontend**: Node.js + Express (Static file server)
- **Backend**: Node.js + Express (REST API)
- **User DB**: MySQL (StatefulSet)
- **Product DB**: MongoDB (Deployment with PV)
- **Auth**: JWT + bcrypt
- **Containerization**: Docker
- **Orchestration**: Kubernetes

## Quick Start

### 1. Build Images
```bash
cd "L4 Multitier-ecommerce"

# Build backend
cd backend
docker build -t ecommerce-backend:latest .

# Build frontend
cd ../frontend
docker build -t ecommerce-frontend:latest .
```

### 2. Deploy to Kubernetes
```bash
cd ..
kubectl apply -f k8s/
```

### 3. Access Application
```bash
minikube ip
# Frontend: http://<minikube-ip>:30240
```

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user (returns JWT token)

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (requires auth)

### Orders
- `POST /api/orders` - Create order (requires auth)
- `GET /api/orders` - Get user orders (requires auth)

### Stats
- `GET /api/stats` - Get platform statistics

## Database Schemas

### MySQL - Users
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### MongoDB - Products
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  stock: Number,
  image: String,
  created_at: Date
}
```

### MongoDB - Orders
```javascript
{
  user_id: Number,
  items: Array,
  total_amount: Number,
  status: String,
  created_at: Date
}
```

## Kubernetes Resources

- **MySQL StatefulSet**: User data persistence
- **MongoDB Deployment**: Product/order data with PV
- **Backend Deployment**: 2 replicas (API server)
- **Frontend Deployment**: 2 replicas (Web server)
- **Services**: Internal backend/DB services, external frontend NodePort

## Port Configuration

- **Frontend**: 30240 (NodePort)
- **Backend**: 5000 (Internal)
- **MySQL**: 3306 (Internal)
- **MongoDB**: 27017 (Internal)

## Usage Flow

1. **Register**: Create account (stored in MySQL)
2. **Login**: Get JWT token
3. **Browse**: View products (from MongoDB)
4. **Add to Cart**: Select products
5. **Checkout**: Create order (stored in MongoDB)

## Cleanup

```bash
kubectl delete -f k8s/
```