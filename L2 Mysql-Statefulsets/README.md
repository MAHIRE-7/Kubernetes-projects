# MySQL StatefulSet

MySQL database deployment using StatefulSets with persistent storage.

## Port
- **ClusterIP**: 3306
- **Container Port**: 3306

## Quick Start
```bash
# Deploy to Kubernetes
kubectl apply -f k8s/

# Check StatefulSet
kubectl get statefulset -n mysql-ns

# Access MySQL
kubectl exec -it mysql-0 -n mysql-ns -- mysql -u root -p
```

## Developer Info
- **Database**: MySQL 8.0
- **Features**: StatefulSet deployment, persistent volumes, replicas
- **K8s Resources**: StatefulSet, Service, Namespace, VolumeClaimTemplates

## Challenge
Learn StatefulSets for stateful applications and database persistence patterns in Kubernetes.