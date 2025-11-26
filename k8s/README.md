# Kubernetes Manifests

This directory contains all Kubernetes manifests for deploying the TODO application.

## Files

### Core Resources
- **namespace.yaml** - Creates the `todo-app` namespace
- **configmap.yaml** - Environment configuration for all services

### MongoDB
- **mongodb-deployment.yaml** - MongoDB deployment with ephemeral storage
- **mongodb-service.yaml** - ClusterIP service for MongoDB (internal only)
- **mongodb-pvc.yaml.backup** - Backup PVC configuration (optional, for persistent storage)

### Backend
- **backend-deployment.yaml** - Backend API deployment (2 replicas)
- **backend-service.yaml** - NodePort service on port 30001

### Frontend
- **frontend-deployment.yaml** - Frontend UI deployment (2 replicas)
- **frontend-service.yaml** - NodePort service on port 30000

## Storage Configuration

### Current: Ephemeral Storage (emptyDir)

MongoDB currently uses **ephemeral storage** which means:
- ✅ Simpler setup, no storage class required
- ✅ Works on any Kubernetes cluster
- ✅ Perfect for development and testing
- ⚠️ Data is lost when the pod restarts
- ⚠️ Not suitable for production

### Optional: Persistent Storage (PVC)

If you need data persistence, you can enable PVC:

1. **Rename the backup file:**
   ```bash
   cd k8s
   mv mongodb-pvc.yaml.backup mongodb-pvc.yaml
   ```

2. **Apply the PVC:**
   ```bash
   kubectl apply -f k8s/mongodb-pvc.yaml
   ```

3. **Update mongodb-deployment.yaml:**
   
   Change the volumes section from:
   ```yaml
   volumes:
   - name: mongodb-storage
     emptyDir: {}
   ```
   
   To:
   ```yaml
   volumes:
   - name: mongodb-storage
     persistentVolumeClaim:
       claimName: mongodb-pvc
   ```

4. **Apply the updated deployment:**
   ```bash
   kubectl apply -f k8s/mongodb-deployment.yaml
   ```

5. **Update the Makefile:**
   
   Add PVC deployment back to the `deploy-mongodb` target:
   ```makefile
   deploy-mongodb:
       @kubectl apply -f k8s/mongodb-pvc.yaml
       @kubectl apply -f k8s/mongodb-deployment.yaml
       @kubectl apply -f k8s/mongodb-service.yaml
   ```

## Deployment Order

The Makefile handles deployment order automatically:

1. Namespace
2. ConfigMap
3. MongoDB (no PVC needed)
4. Backend (waits for MongoDB)
5. Frontend

## Quick Commands

```bash
# Deploy everything
make deploy

# Deploy individual components
make deploy-namespace
make deploy-configmap
make deploy-mongodb
make deploy-backend
make deploy-frontend

# Check status
make status

# View logs
make logs-mongodb
make logs-backend
make logs-frontend

# Cleanup
make clean
```

## Resource Requirements

| Component | CPU Request | CPU Limit | Memory Request | Memory Limit |
|-----------|-------------|-----------|----------------|--------------|
| MongoDB   | 250m        | 500m      | 256Mi          | 512Mi        |
| Backend   | 100m        | 200m      | 128Mi          | 256Mi        |
| Frontend  | 50m         | 100m      | 64Mi           | 128Mi        |

**Total:** ~800m CPU, ~1280Mi Memory

## Notes

- All services run in the `todo-app` namespace
- MongoDB is only accessible from within the cluster (ClusterIP)
- Backend and Frontend are exposed via NodePort for easy access
- Health checks are configured for all deployments
- Resource limits prevent pods from consuming too many resources

