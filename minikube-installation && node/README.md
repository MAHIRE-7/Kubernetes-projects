# Minikube Installation Guide

## Prerequisites

- Windows 10/11
- Virtualization enabled in BIOS
- At least 2GB RAM available
- Docker Desktop or VirtualBox

## Installation Steps

### 1. Install Minikube
```powershell
# Using Chocolatey
choco install minikube

# Or download directly
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-windows-amd64.exe
```

### 2. Install kubectl
```powershell
# Using Chocolatey
choco install kubernetes-cli

# Or using minikube
minikube kubectl -- get po -A
```

### 3. Start Minikube
```powershell
# Start with Docker driver
minikube start --driver=docker

# Or with VirtualBox
minikube start --driver=virtualbox
```

### 4. Verify Installation
```powershell
minikube status
kubectl get nodes
```

## Common Commands

```powershell
# Start minikube
minikube start

# Stop minikube
minikube stop

# Delete minikube cluster
minikube delete

# Access minikube dashboard
minikube dashboard

# Get minikube IP
minikube ip

# SSH into minikube
minikube ssh
```

## Troubleshooting

- Enable Hyper-V or VirtualBox in Windows Features
- Run PowerShell as Administrator
- Check Docker Desktop is running
- Verify virtualization is enabled in BIOS