# Tourism Management Platform

A comprehensive tourism management system built with Node.js, featuring dual database architecture - MySQL for user management and MongoDB for tourism data.

## Features

- 🌍 **Destination Management**: Browse and explore destinations worldwide
- 👤 **User Authentication**: Secure registration and login with MySQL
- 🎫 **Booking System**: Book destinations with date range and traveler count
- ⭐ **Review System**: Rate and review destinations
- 📊 **Dashboard**: Tourism statistics and featured destinations
- 🏷️ **Categories**: Organized destination categories
- 💰 **Pricing**: Dynamic pricing based on duration and travelers
- 📱 **Responsive Design**: Modern glassmorphism UI

## Architecture

- **User Management**: MySQL database with secure authentication
- **Tourism Data**: MongoDB for destinations, bookings, and reviews
- **Dual Database**: Optimized storage for different data types
- **Session Management**: Secure user sessions

## Tech Stack

- **Backend**: Node.js with Express
- **User DB**: MySQL (StatefulSet)
- **Tourism DB**: MongoDB (Deployment with PV)
- **Authentication**: bcrypt + express-session
- **Frontend**: EJS templates with modern CSS
- **Containerization**: Docker
- **Orchestration**: Kubernetes

## Quick Start

### 1. Build Docker Image
```bash
cd "L3 Node-tourism-management"
docker build -t tourism-management:latest .
```

### 2. Deploy to Kubernetes
```bash
kubectl apply -f k8s/
```

### 3. Access Application
```bash
minikube ip
# Access at: http://<minikube-ip>:30220
```

## Database Schemas

### MySQL - Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### MongoDB Collections
- **Destinations**: name, country, city, description, category, price, rating
- **Bookings**: user_id, destination_id, travelers, check_in, check_out, total_amount
- **Reviews**: user_id, destination_id, rating, comment

## Port Configuration

- **Application**: Port 30220 (NodePort)
- **MySQL**: Port 3306 (Internal)
- **MongoDB**: Port 27017 (Internal)

## Cleanup

```bash
kubectl delete -f k8s/
```