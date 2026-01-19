# Pharmacy Management System

A comprehensive pharmacy management system with dual database architecture - MySQL for user management and MongoDB for medicines, prescriptions, and sales.

## Features

- 💊 **Medicine Inventory**: Track medicines, stock, expiry dates, and batches
- 📋 **Prescription Management**: Process and manage patient prescriptions
- 💰 **Sales Tracking**: Record sales and update inventory automatically
- 👥 **Staff Management**: Role-based access (Pharmacist, Manager, Cashier)
- 📊 **Dashboard**: Real-time statistics and low stock alerts
- 🔒 **Secure Authentication**: User login with role-based permissions

## Architecture

- **User Management**: MySQL database with secure authentication
- **Pharmacy Data**: MongoDB for medicines, prescriptions, and sales
- **Dual Database**: Optimized storage for different data types

## Tech Stack

- **Backend**: Node.js + Express
- **User DB**: MySQL (StatefulSet)
- **Pharmacy DB**: MongoDB (Deployment with PV)
- **Authentication**: bcrypt + express-session
- **Frontend**: EJS templates with modern CSS

## Quick Start

### 1. Build
```bash
cd "L3 Node-pharmacy-management"
docker build -t pharmacy-management:latest .
```

### 2. Deploy
```bash
kubectl apply -f k8s/
```

### 3. Access
```bash
minikube ip
# Access at: http://<minikube-ip>:30310
```

## Database Schemas

### MySQL - Users
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('pharmacist', 'manager', 'cashier'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### MongoDB Collections
- **Medicines**: name, generic_name, manufacturer, category, price, stock, expiry_date, batch_number
- **Prescriptions**: patient_name, patient_phone, doctor_name, medicines[], total_amount, status
- **Sales**: customer_name, customer_phone, items[], total_amount, payment_method

## User Roles

- **Pharmacist**: Full access to all features
- **Manager**: Inventory management and reports
- **Cashier**: Sales processing and basic inventory view

## Port Configuration

- **Application**: 30310 (NodePort)
- **MySQL**: 3306 (Internal)
- **MongoDB**: 27017 (Internal)

## Features in Detail

### Medicine Management
- Add new medicines with complete details
- Track stock levels and expiry dates
- Low stock alerts on dashboard
- Batch number tracking for recalls

### Prescription Processing
- Patient information management
- Doctor prescription details
- Medicine dispensing tracking
- Status updates (pending, completed)

### Sales Management
- Customer transaction recording
- Automatic inventory updates
- Payment method tracking
- Sales history and reports

## Cleanup

```bash
kubectl delete -f k8s/
```