# Hospital Management System

A comprehensive hospital management system with Node.js using MySQL for user management and MongoDB for patient records and appointments.

## Features

- 🏥 **Patient Management**: Register and manage patient records
- 📅 **Appointment System**: Schedule and track appointments
- 👨⚕️ **Staff Management**: Doctors, Receptionists, and Admin roles
- 📊 **Dashboard**: Real-time statistics and insights
- 🔒 **Secure Authentication**: Role-based access control
- 💎 **Modern UI**: Glassmorphism design

## Architecture

- **User Management**: MySQL (Staff authentication)
- **Patient Data**: MongoDB (Patients, Appointments)
- **Dual Database**: Optimized for different data types

## Tech Stack

- **Backend**: Node.js + Express
- **User DB**: MySQL (StatefulSet)
- **Patient DB**: MongoDB (Deployment with PV)
- **Authentication**: bcrypt + express-session
- **Frontend**: EJS templates

## Quick Start

### 1. Build
```bash
cd "L3 Node-hospital-management"
docker build -t hospital-management:latest .
```

### 2. Deploy
```bash
kubectl apply -f k8s/
```

### 3. Access
```bash
minikube ip
# Access at: http://<minikube-ip>:30230
```

## Database Schemas

### MySQL - Users
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'doctor', 'receptionist'),
    department VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### MongoDB Collections
- **Patients**: name, age, gender, phone, email, blood_group, address, medical_history
- **Appointments**: patient_id, doctor_id, date, time, department, reason, status

## Port Configuration

- **Application**: 30230 (NodePort)
- **MySQL**: 3306 (Internal)
- **MongoDB**: 27017 (Internal)

## Cleanup

```bash
kubectl delete -f k8s/
```