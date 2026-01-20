# Voting App

A microservices voting application with real-time results.

## Architecture

- **Vote** (Port 30080) - Python Flask frontend for voting
- **Redis** - Collects new votes in queue
- **Worker** - Python worker consumes votes and stores in PostgreSQL
- **PostgreSQL** - Database with Docker volume for persistence
- **Result** (Port 30090) - Node.js app shows real-time results

## Quick Start

1. **Build Docker Images:**
```bash
cd vote && docker build -t vote:latest .
cd ../worker && docker build -t worker:latest .
cd ../result && docker build -t result:latest .
```

2. **Deploy to Kubernetes:**
```bash
kubectl apply -f k8s/
```

3. **Access Applications:**
```bash
minikube ip
# Vote: http://<minikube-ip>:30080
# Results: http://<minikube-ip>:30090
```

## Usage

1. Go to voting page and vote for Cats or Dogs
2. Check results page for real-time vote counts
3. Data persists in PostgreSQL with Docker volume

## Components

- **vote/**: Python Flask voting interface
- **worker/**: Python worker processing votes
- **result/**: Node.js real-time results display
- **k8s/**: Kubernetes deployment manifests

## Cleanup
```bash
kubectl delete -f k8s/
```