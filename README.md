# MERN TODO Application with Kubernetes Deployment

[![CI/CD Pipeline](https://github.com/barani-presidio/todo-app/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/barani-presidio/todo-app/actions/workflows/ci-cd.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/kubernetes-ready-326CE5)](https://kubernetes.io/)

A full-stack TODO application built with MongoDB, Express.js, React, and Node.js (MERN), designed for deployment on Kubernetes.

## Features

- Create, read, update, and delete TODO items
- Set priority levels (Low, Medium, High)
- Filter todos by status (All, Active, Completed)
- Filter todos by priority
- Responsive and modern UI design
- RESTful API backend
- Kubernetes-ready with production-grade configurations

## Architecture

```
┌─────────────────┐
│   Frontend      │
│   (React)       │
│   Port: 30000   │
└────────┬────────┘
         │
         │ API Calls
         │
┌────────▼────────┐
│   Backend       │
│   (Express)     │
│   Port: 30001   │
└────────┬────────┘
         │
         │ Mongoose
         │
┌────────▼────────┐
│   MongoDB       │
│   Port: 27017   │
└─────────────────┘
```

## Project Structure

```
k8s-mern/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   └── Todo.js
│   ├── routes/
│   │   └── todos.js
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── TodoForm.js
│   │   │   ├── TodoForm.css
│   │   │   ├── TodoList.js
│   │   │   ├── TodoList.css
│   │   │   ├── TodoItem.js
│   │   │   ├── TodoItem.css
│   │   │   ├── TodoFilters.js
│   │   │   └── TodoFilters.css
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .dockerignore
└── k8s/
    ├── namespace.yaml
    ├── configmap.yaml
    ├── mongodb-pvc.yaml
    ├── mongodb-deployment.yaml
    ├── mongodb-service.yaml
    ├── backend-deployment.yaml
    ├── backend-service.yaml
    ├── frontend-deployment.yaml
    └── frontend-service.yaml
```

## Prerequisites

- Docker Desktop with Kubernetes enabled
- kubectl CLI tool
- Node.js 18+ (for local development)
- Git

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd k8s-mern
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todoapp
NODE_ENV=development
```

Start the backend server:

```bash
npm start
```

The backend will be available at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## Kubernetes Deployment

### Step 1: Enable Kubernetes in Docker Desktop

1. Open Docker Desktop
2. Go to Settings → Kubernetes
3. Check "Enable Kubernetes"
4. Click "Apply & Restart"

### Step 2: Build and Deploy Using Makefile

The easiest way to build and deploy:

```bash
make deploy
```

This single command will:
- Build both backend and frontend Docker images
- Create the namespace
- Deploy ConfigMap
- Deploy MongoDB with persistent storage
- Deploy backend API (2 replicas)
- Deploy frontend (2 replicas)
- Wait for all services to be ready

#### Alternative: Step-by-Step Deployment

Build images only:

```bash
make build
```

Or build individually:

```bash
make build-backend
make build-frontend
```

Deploy to Kubernetes (after building):

```bash
make deploy-k8s
```

Deploy individual components:

```bash
make deploy-namespace
make deploy-configmap
make deploy-mongodb
make deploy-backend
make deploy-frontend
```

### Step 3: Verify Deployment

Check all resources:

```bash
make status
```

Check pod status:

```bash
make pods
```

Check services:

```bash
make services
```

View pod logs:

```bash
# All logs
make logs

# Individual service logs
make logs-backend
make logs-frontend
make logs-mongodb
```

Get application info:

```bash
make info
```

### Step 4: Access the Application

Once all pods are running:

- **Frontend:** http://localhost (LoadBalancer) or check external IP with `kubectl get svc -n todo-app`
- **Backend API:** http://localhost:30001
- **Backend Health Check:** http://localhost:30001/health
- **API Todos Endpoint:** http://localhost:30001/api/todos

Get the frontend external IP:
```bash
kubectl get service frontend-service -n todo-app
```

On Docker Desktop/Minikube, LoadBalancer services are accessible at `localhost`.

Test the API:

```bash
make test-api
```

Check health of all services:

```bash
make health-check
```

## API Endpoints

### GET /api/todos
Get all todos with optional filters

**Query Parameters:**
- `completed` - Filter by completion status (true/false)
- `priority` - Filter by priority (low/medium/high)
- `sortBy` - Sort field (default: createdAt)
- `order` - Sort order (asc/desc, default: desc)

**Example:**
```bash
curl http://localhost:30001/api/todos?priority=high&completed=false
```

### GET /api/todos/:id
Get a single todo by ID

### POST /api/todos
Create a new todo

**Body:**
```json
{
  "title": "Complete project",
  "description": "Finish the MERN TODO app",
  "priority": "high"
}
```

### PUT /api/todos/:id
Update a todo

**Body:**
```json
{
  "title": "Updated title",
  "completed": true,
  "priority": "low"
}
```

### DELETE /api/todos/:id
Delete a todo

## Kubernetes Management Commands

### Using Makefile Commands

View all available commands:

```bash
make help
```

### Scaling Deployments

Scale up to 3 replicas:

```bash
make scale-up
```

Scale down to 1 replica:

```bash
make scale-down
```

### Updating Deployments

After making changes and rebuilding images:

```bash
make build
make restart
```

### Viewing Logs

View all logs:

```bash
make logs
```

Stream logs from specific service:

```bash
make logs-backend    # Backend logs (follow mode)
make logs-frontend   # Frontend logs (follow mode)
make logs-mongodb    # MongoDB logs (follow mode)
```

### Development Environment

Start local development with Docker Compose:

```bash
make dev-up
```

Stop development environment:

```bash
make dev-down
```

View development logs:

```bash
make dev-logs
```

### Debugging

Execute commands in a pod:

```bash
# Get a shell in backend pod
kubectl exec -it <backend-pod-name> -n todo-app -- sh

# Get a shell in MongoDB pod
kubectl exec -it <mongodb-pod-name> -n todo-app -- mongosh
```

Port forwarding for debugging:

```bash
# Forward MongoDB port
kubectl port-forward service/mongodb-service 27017:27017 -n todo-app

# Forward backend port
kubectl port-forward service/backend-service 5000:5000 -n todo-app
```

### Cleanup

Remove all Kubernetes resources:

```bash
make clean
```

Remove Docker images:

```bash
make clean-images
```

Complete cleanup (K8s + images):

```bash
make clean-all
```

## Resource Configuration

### MongoDB
- **Replicas:** 1
- **Storage:** Ephemeral (emptyDir) - Data will be lost on pod restart
- **Memory:** 256Mi request, 512Mi limit
- **CPU:** 250m request, 500m limit
- **Note:** For production, consider using PersistentVolumeClaim

### Backend
- **Replicas:** 2
- **Memory:** 128Mi request, 256Mi limit
- **CPU:** 100m request, 200m limit
- **Health Checks:** /health endpoint

### Frontend
- **Replicas:** 2
- **Memory:** 64Mi request, 128Mi limit
- **CPU:** 50m request, 100m limit
- **Server:** Nginx

## Troubleshooting

### Pods not starting

Check pod events:
```bash
kubectl describe pod <pod-name> -n todo-app
```

### Connection issues

Verify services are running:
```bash
kubectl get services -n todo-app
```

Test connectivity from backend to MongoDB:
```bash
kubectl exec -it <backend-pod-name> -n todo-app -- wget -O- mongodb-service:27017
```

### Image pull errors

Ensure images are built locally:
```bash
docker images | grep todo
```

For Kubernetes to use local images, set `imagePullPolicy: IfNotPresent` in deployments (already configured).

### MongoDB connection errors

Check MongoDB logs:
```bash
kubectl logs -l app=mongodb -n todo-app
```

Verify MongoDB service:
```bash
kubectl get service mongodb-service -n todo-app
```

## Production Considerations

For production deployment, consider:

1. **Use a Docker Registry:** Push images to Docker Hub, GCR, or ECR
2. **Secrets Management:** Use Kubernetes Secrets for sensitive data
3. **Ingress Controller:** Replace NodePort with Ingress for better routing
4. **TLS/SSL:** Add HTTPS support
5. **Persistent Storage:** Use cloud provider's storage classes
6. **Monitoring:** Add Prometheus and Grafana
7. **Logging:** Implement ELK or Loki stack
8. **Backup:** Implement MongoDB backup strategy
9. **Resource Limits:** Adjust based on load testing
10. **Horizontal Pod Autoscaling:** Add HPA for auto-scaling

## Technologies Used

- **Frontend:** React 18, CSS3
- **Backend:** Node.js, Express.js
- **Database:** MongoDB 7.0
- **Container:** Docker
- **Orchestration:** Kubernetes
- **Web Server:** Nginx (for frontend)

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Author

Built with Context7 documentation references for best practices in MERN stack development and Kubernetes deployment.

