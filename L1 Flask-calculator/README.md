# L1 Flask Calculator

A simple Flask calculator application deployed on Kubernetes with basic arithmetic operations.

## Features

- Addition, subtraction, multiplication, division
- Clean web interface
- Error handling (division by zero)
- RESTful API endpoint

## Project Structure

```
L1 Flask-calculator/
├── app.py                           # Flask application
├── requirements.txt                 # Python dependencies
├── Dockerfile                      # Container configuration
├── templates/
│   └── index.html                  # Calculator interface
└── k8s/
    ├── flask-calculator-deployment.yml  # Kubernetes deployment
    └── flask-calculator-service.yml     # Kubernetes service
```

## Quick Start

### 1. Build Docker Image
```bash
cd "L1 Flask-calculator"
docker build -t flask-calculator:latest .
```

### 2. Deploy to Kubernetes
```bash
kubectl apply -f k8s/flask-calculator-deployment.yml
kubectl apply -f k8s/flask-calculator-service.yml
```

### 3. Access the Application
```bash
# Get minikube IP
minikube ip

# Access at: http://<minikube-ip>:30100
```

## API Usage

**POST /calculate**
```json
{
  "num1": 10,
  "num2": 5,
  "operation": "add"
}
```

Operations: `add`, `subtract`, `multiply`, `divide`

## Verify Deployment

```bash
kubectl get pods
kubectl get services
kubectl logs deployment/flask-calculator-deployment
```

## Clean Up

```bash
kubectl delete -f k8s/
```