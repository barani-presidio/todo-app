# Quick Start Guide

Get the TODO app running in Kubernetes in 5 minutes!

## Prerequisites Check

Make sure you have:
- ✅ Docker Desktop installed with Kubernetes enabled
- ✅ kubectl installed and configured
- ✅ make installed (comes with Xcode Command Line Tools on Mac)

## Quick Deploy (One Command!)

### 1. Deploy Everything

```bash
make deploy
```

This single command will:
- Build both backend and frontend Docker images
- Create the namespace
- Set up ConfigMap
- Deploy MongoDB with ephemeral storage
- Deploy the backend API (2 replicas)
- Deploy the frontend (2 replicas)
- Wait for all services to be ready
- Show you the access URLs

**Note:** MongoDB uses ephemeral storage (data is lost on pod restart). This is fine for development/testing.

### 2. Access the Application

Open your browser and go to:
- **Frontend:** http://localhost (LoadBalancer)
- **Backend API:** http://localhost:30001/api/todos

To get the frontend external IP:
```bash
kubectl get service frontend-service -n todo-app
```

On Docker Desktop/Minikube, the LoadBalancer EXTERNAL-IP will be `localhost`.

### 3. Verify Deployment

```bash
make status
```

You should see:
- 1 MongoDB pod
- 2 Backend pods
- 2 Frontend pods
- All services running

### 4. View Logs (Optional)

```bash
# View all logs
make logs

# Or view specific service logs
make logs-backend
make logs-frontend
make logs-mongodb
```

### 5. Test the API

```bash
make test-api
```

## Clean Up

To remove everything:

```bash
make clean
```

Or remove everything including Docker images:

```bash
make clean-all
```

## Manual Deployment (Step by Step)

If you prefer manual control:

### 1. Build Images

```bash
# Build both
make build

# Or build individually
make build-backend
make build-frontend
```

### 2. Deploy to Kubernetes

```bash
# Deploy everything
make deploy-k8s

# Or deploy step by step
make deploy-namespace
make deploy-configmap
make deploy-mongodb
make deploy-backend
make deploy-frontend
```

### 3. Check Status

```bash
make status
```

Or watch pods:

```bash
make pods
```

## Using Docker Compose (Alternative)

For local development without Kubernetes:

```bash
make dev-up
```

Access at:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000

View logs:

```bash
make dev-logs
```

Stop services:

```bash
make dev-down
```

## Troubleshooting

### Images not found
Make sure you've built the images:
```bash
docker images | grep todo
```

### Pods stuck in Pending
Check events:
```bash
kubectl describe pods -n todo-app
```

### Cannot connect to backend
Verify services:
```bash
kubectl get services -n todo-app
```

### Port already in use
Change the NodePort values in service YAML files (30000, 30001).

## Next Steps

- Read the full [README.md](README.md) for detailed information
- Explore the API endpoints
- Customize the UI
- Add authentication
- Set up monitoring

## Quick Commands Reference

```bash
# View all available commands
make help

# View all resources
make status

# Scale deployments
make scale-up      # Scale to 3 replicas
make scale-down    # Scale to 1 replica

# Restart deployments
make restart

# View logs
make logs          # All logs
make logs-backend  # Backend only
make logs-frontend # Frontend only

# Test API
make test-api

# Health check
make health-check

# Get info
make info

# Delete everything
make clean
```

## Support

If you encounter issues, check:
1. Docker Desktop is running
2. Kubernetes is enabled in Docker Desktop
3. kubectl can connect: `kubectl cluster-info`
4. Sufficient resources (4GB RAM recommended)

Happy coding!

