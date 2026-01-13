# Smart Event Management Platform

A comprehensive event management platform built with Node.js, featuring dual database architecture - MySQL for user management and MongoDB for events and bookings.

## Features

- 🎉 **Event Management**: Create, view, and manage events
- 👤 **User System**: Registration with role-based access (User/Organizer)
- 🎫 **Booking System**: Book tickets for events with real-time availability
- 📊 **Analytics Dashboard**: Event statistics and revenue tracking
- 🏷️ **Categories**: Organized event categories (Conference, Workshop, Concert, etc.)
- 💰 **Payment Integration**: Ticket pricing and booking management
- 📱 **Responsive Design**: Modern glassmorphism UI
- 🔒 **Secure Authentication**: Password hashing and session management

## Architecture

- **User Management**: MySQL database with secure authentication
- **Event Operations**: MongoDB for events, bookings, and analytics
- **Role-Based Access**: Users, Organizers, and Admin roles
- **Real-time Updates**: Dynamic booking and event management

## Tech Stack

- **Backend**: Node.js with Express
- **User DB**: MySQL (StatefulSet)
- **Event DB**: MongoDB (Deployment with PV)
- **Authentication**: bcrypt + express-session
- **Frontend**: EJS templates with modern CSS
- **Containerization**: Docker
- **Orchestration**: Kubernetes

## Quick Start

### 1. Build Docker Image
```bash
cd "L3 Node-event-management"
docker build -t event-management:latest .
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

# Access at: http://<minikube-ip>:30210
```

## User Roles

### 👤 User
- Browse and view events
- Book tickets for events
- View booking history
- Manage personal profile

### 🎪 Organizer
- All user permissions
- Create and manage events
- View event analytics
- Track bookings and revenue

### 🔧 Admin
- All organizer permissions
- System-wide analytics
- User management
- Platform administration

## API Endpoints

### Authentication
- `GET /login` - Login page
- `POST /login` - User authentication
- `GET /register` - Registration page
- `POST /register` - User registration
- `GET /logout` - User logout

### Events
- `GET /` - Dashboard with upcoming events
- `GET /events` - All events listing
- `GET /create-event` - Create event form (Organizers only)
- `POST /api/events` - Create new event
- `GET /api/events` - Get all events

### Bookings
- `POST /api/bookings` - Create booking
- `GET /my-bookings` - User's booking history

### Analytics
- `GET /analytics` - Analytics dashboard (Organizers/Admin)

## Database Schemas

### MySQL - Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'organizer', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### MongoDB - Events Collection
```javascript
{
  title: String,
  description: String,
  category: String,
  date: Date,
  time: String,
  location: String,
  capacity: Number,
  price: Number,
  organizer_id: Number,
  created_at: Date,
  status: String
}
```

### MongoDB - Bookings Collection
```javascript
{
  event_id: ObjectId,
  user_id: Number,
  tickets: Number,
  total_amount: Number,
  booking_date: Date,
  status: String
}
```

## Event Categories

- 🎤 Conference
- 🛠️ Workshop
- 🎵 Concert
- ⚽ Sports
- 🍕 Food & Drink
- 🎨 Art & Culture
- 💻 Technology
- 💼 Business

## Kubernetes Resources

- **MySQL StatefulSet**: Persistent user data with 1Gi storage
- **MongoDB Deployment**: Event and booking data with PV
- **Node.js App Deployment**: 2 replicas for high availability
- **Services**: Internal database services and external NodePort
- **PersistentVolumes**: MongoDB data persistence

## Environment Variables

### MySQL Connection
- `MYSQL_HOST`: MySQL service hostname
- `MYSQL_PORT`: MySQL port (3306)
- `MYSQL_USER`: Database user (root)
- `MYSQL_PASSWORD`: Database password
- `MYSQL_DATABASE`: Database name (event_db)

### MongoDB Connection
- `MONGO_HOST`: MongoDB service hostname
- `MONGO_PORT`: MongoDB port (27017)

## Port Configuration

- **Application**: Port 30210 (NodePort)
- **MySQL**: Port 3306 (Internal)
- **MongoDB**: Port 27017 (Internal)

## Sample Data

### Default Users
Register with these roles:
- **User**: Can browse and book events
- **Organizer**: Can create events and view analytics

### Event Categories
The platform supports 8 main categories with emoji icons for better UX.

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- Role-based access control
- Input validation and sanitization
- Secure database connections

## Cleanup

```bash
kubectl delete -f k8s/
```

## Development

1. Install dependencies: `npm install`
2. Run MySQL: `docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=event_db mysql:8.0`
3. Run MongoDB: `docker run -d -p 27017:27017 mongo:5.0`
4. Start app: `npm start`
5. Access at: http://localhost:3000