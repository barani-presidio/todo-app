# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2025-11-13

### Changed
- **Updated Node.js base image** from `node:18-alpine` to `node:alpine` (latest)
- **Frontend service** changed from NodePort to LoadBalancer
- **MongoDB storage** changed from PersistentVolumeClaim to ephemeral (emptyDir)
- Frontend now accessible at `http://localhost` instead of `http://localhost:30000`

### Added
- `DOCKER_IMAGES.md` - Comprehensive Docker images reference guide
- `SERVICE_TYPES.md` - Kubernetes service types explained
- `STORAGE_CONFIG.md` - MongoDB storage configuration guide
- `k8s/README.md` - Kubernetes manifests documentation

### Removed
- `k8s/mongodb-pvc.yaml` - Replaced with ephemeral storage (backup saved as `.backup`)

## [1.1.0] - 2025-11-13

### Added
- **Makefile-based build system** replacing shell scripts
  - Root `Makefile` with comprehensive build, deploy, and management commands
  - Backend-specific `Makefile` for local development
  - Frontend-specific `Makefile` for local development
  - Color-coded output for better readability
  - 40+ commands for all operations

### Changed
- Replaced `build-images.sh` with `make build` commands
- Replaced `k8s/deploy-all.sh` with `make deploy` and related commands
- Replaced `k8s/cleanup.sh` with `make clean` commands
- Updated `README.md` to use Makefile commands
- Updated `QUICKSTART.md` to use Makefile commands
- Updated `PROJECT_SUMMARY.md` to reflect Makefile usage

### Removed
- `build-images.sh` shell script
- `k8s/deploy-all.sh` shell script  
- `k8s/cleanup.sh` shell script

### New Documentation
- `MAKEFILE_GUIDE.md` - Comprehensive guide to all Makefile commands

## [1.0.0] - 2025-11-13

### Added
- Initial release of MERN TODO application
- React 18 frontend with modern UI
- Express.js backend with RESTful API
- MongoDB database with Mongoose ODM
- Complete Kubernetes deployment manifests
- Docker support with multi-stage builds
- Docker Compose for local development
- Comprehensive documentation
  - `README.md` with full deployment instructions
  - `QUICKSTART.md` for fast deployment
  - `PROJECT_SUMMARY.md` with technical overview

### Features
- Create, read, update, delete todos
- Priority levels (Low, Medium, High)
- Filter by status and priority
- Real-time statistics
- Responsive design
- Health checks
- Persistent storage for MongoDB
- Horizontal scaling support
- Resource limits and requests

### DevOps
- Kubernetes namespace isolation
- ConfigMap for configuration
- PersistentVolumeClaim for data
- Services (ClusterIP and NodePort)
- Liveness and readiness probes
- 2 replicas for backend and frontend
- Automated deployment scripts

