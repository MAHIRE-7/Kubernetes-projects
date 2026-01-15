# Simple Portfolio Website

A clean, modern portfolio website with glassmorphism design.

## Features

- 👨💻 About section
- 🛠️ Skills showcase
- 📁 Projects display
- 📧 Contact links
- 💎 Modern glassmorphism UI
- 📱 Responsive design

## Quick Start

### 1. Build
```bash
cd "L1 Simple-portfolio"
docker build -t simple-portfolio:latest .
```

### 2. Deploy
```bash
kubectl apply -f k8s/
```

### 3. Access
```bash
minikube ip
# Access at: http://<minikube-ip>:30250
```

## Cleanup

```bash
kubectl delete -f k8s/
```