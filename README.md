# Kubernetes (K8s) Projects

This repository contains various Kubernetes projects and configurations for learning and practice purposes.

## Repository Structure

```
K8s/
├── L1 Simple-nginx-app/     # Basic nginx application deployment
│   ├── nginx-deployment.yml # Nginx deployment configuration
│   ├── nginx-pod.yml        # Nginx pod configuration
│   └── nginx-service.yml    # Nginx service configuration
├── L2/                      # Level 2 projects (coming soon)
├── minikube-installation && node/  # Minikube setup and node configurations
└── minikube-nodes.yml       # Minikube node configuration
```

## Projects

### L1 Simple-nginx-app
A basic nginx application deployment demonstrating:
- Pod creation and management
- Deployment configurations
- Service exposure with NodePort

**Quick Start:**
```bash
kubectl apply -f L1\ Simple-nginx-app/nginx-deployment.yml
kubectl apply -f L1\ Simple-nginx-app/nginx-service.yml
```

## Prerequisites

- Kubernetes cluster (minikube, kind, or cloud provider)
- kubectl CLI tool
- Docker (for local development)

## Getting Started

1. Clone this repository
2. Navigate to the desired project folder
3. Apply the Kubernetes manifests using `kubectl apply -f <filename>`
4. Verify deployments with `kubectl get pods,services`

## Contributing

Feel free to add new projects and configurations. Follow the naming convention:
- `L<number>` for learning levels
- Descriptive folder names
- Include all necessary YAML files

## Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Minikube Documentation](https://minikube.sigs.k8s.io/docs/)