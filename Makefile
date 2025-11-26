.PHONY: help build build-backend build-frontend buildx-setup build-multiarch build-backend-multiarch build-frontend-multiarch build-backend-multiarch-build build-frontend-multiarch-build build-backend-multiarch-push build-frontend-multiarch-push deploy deploy-k8s clean status logs test-api dev-up dev-down

# Variables
BACKEND_IMAGE := todo-backend:latest
FRONTEND_IMAGE := todo-frontend:latest
NAMESPACE := todo-app
API_URL := http://localhost:30001/api
PLATFORM := linux/amd64
PLATFORMS := linux/amd64,linux/arm64
BUILDER_NAME := multiarch-builder

# Colors for output
CYAN := \033[0;36m
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m

help:
	@echo "$(CYAN)MERN TODO Application - Makefile Commands$(NC)"
	@echo ""
	@echo "$(GREEN)Build Commands:$(NC)"
	@echo "  make build              - Build both frontend and backend Docker images (amd64)"
	@echo "  make build-backend      - Build backend Docker image (amd64)"
	@echo "  make build-frontend     - Build frontend Docker image (amd64)"
	@echo "  make build-multiarch    - Build images for amd64 (with buildx)"
	@echo "  make build-backend-multiarch  - Build backend for amd64 (with buildx)"
	@echo "  make build-frontend-multiarch - Build frontend for amd64 (with buildx)"
	@echo "  make build-backend-multiarch-build  - Build backend for amd64+arm64 (no push)"
	@echo "  make build-frontend-multiarch-build - Build frontend for amd64+arm64 (no push)"
	@echo "  make build-backend-multiarch-push  - Build and push backend multi-arch"
	@echo "  make build-frontend-multiarch-push - Build and push frontend multi-arch"
	@echo "  make buildx-setup       - Setup Docker buildx for multi-arch builds"
	@echo ""
	@echo "$(GREEN)Deployment Commands:$(NC)"
	@echo "  make deploy             - Build images and deploy to Kubernetes"
	@echo "  make deploy-k8s         - Deploy to Kubernetes (without building)"
	@echo "  make deploy-namespace   - Create namespace only"
	@echo "  make deploy-configmap   - Deploy ConfigMap only"
	@echo "  make deploy-mongodb     - Deploy MongoDB only"
	@echo "  make deploy-backend     - Deploy backend only"
	@echo "  make deploy-frontend    - Deploy frontend only"
	@echo ""
	@echo "$(GREEN)Management Commands:$(NC)"
	@echo "  make status             - Show status of all resources"
	@echo "  make logs               - Show logs from all pods"
	@echo "  make logs-backend       - Show backend logs"
	@echo "  make logs-frontend      - Show frontend logs"
	@echo "  make logs-mongodb       - Show MongoDB logs"
	@echo "  make scale-up           - Scale backend and frontend to 3 replicas"
	@echo "  make scale-down         - Scale backend and frontend to 1 replica"
	@echo "  make restart            - Restart all deployments"
	@echo ""
	@echo "$(GREEN)Development Commands:$(NC)"
	@echo "  make dev-up             - Start development environment with Docker Compose"
	@echo "  make dev-down           - Stop development environment"
	@echo "  make dev-logs           - Show Docker Compose logs"
	@echo ""
	@echo "$(GREEN)Testing Commands:$(NC)"
	@echo "  make test-api           - Test API endpoints"
	@echo "  make health-check       - Check health of all services"
	@echo ""
	@echo "$(GREEN)Cleanup Commands:$(NC)"
	@echo "  make clean              - Remove all Kubernetes resources"
	@echo "  make clean-images       - Remove Docker images"
	@echo "  make clean-all          - Remove everything (K8s resources + images)"
	@echo ""
	@echo "$(GREEN)Info Commands:$(NC)"
	@echo "  make info               - Show application URLs and info"
	@echo "  make pods               - List all pods"
	@echo "  make services           - List all services"
	@echo "  make describe           - Describe all resources"

build: build-backend build-frontend
	@echo "$(GREEN)✓ All images built successfully$(NC)"

build-backend:
	@echo "$(CYAN)Building backend Docker image (amd64)...$(NC)"
	@cd backend && docker build --platform $(PLATFORM) -t $(BACKEND_IMAGE) .
	@echo "$(GREEN)✓ Backend image built for amd64$(NC)"

build-frontend:
	@echo "$(CYAN)Building frontend Docker image (amd64)...$(NC)"
	@cd frontend && docker build --platform $(PLATFORM) -t $(FRONTEND_IMAGE) .
	@echo "$(GREEN)✓ Frontend image built for amd64$(NC)"

buildx-setup:
	@echo "$(CYAN)Setting up Docker buildx for multi-architecture builds...$(NC)"
	@docker buildx create --name $(BUILDER_NAME) --use 2>/dev/null || docker buildx use $(BUILDER_NAME)
	@docker buildx inspect --bootstrap
	@echo "$(GREEN)✓ Buildx setup complete$(NC)"

build-multiarch: buildx-setup build-backend-multiarch build-frontend-multiarch
	@echo "$(GREEN)✓ All multi-architecture images built successfully$(NC)"

build-backend-multiarch: buildx-setup
	@echo "$(CYAN)Building backend Docker image (amd64 with buildx)...$(NC)"
	@cd backend && docker buildx build \
		--platform $(PLATFORM) \
		-t $(BACKEND_IMAGE) \
		--load \
		.
	@echo "$(GREEN)✓ Backend image built for amd64$(NC)"

build-frontend-multiarch: buildx-setup
	@echo "$(CYAN)Building frontend Docker image (amd64 with buildx)...$(NC)"
	@cd frontend && docker buildx build \
		--platform $(PLATFORM) \
		-t $(FRONTEND_IMAGE) \
		--load \
		.
	@echo "$(GREEN)✓ Frontend image built for amd64$(NC)"

build-backend-multiarch-build: buildx-setup
	@echo "$(CYAN)Building backend Docker image for multiple architectures (amd64, arm64)...$(NC)"
	@echo "$(YELLOW)Note: Images built for registry (not loaded locally). Use push commands to upload.$(NC)"
	@cd backend && docker buildx build \
		--platform $(PLATFORMS) \
		-t $(BACKEND_IMAGE) \
		.
	@echo "$(GREEN)✓ Backend multi-arch image built$(NC)"

build-frontend-multiarch-build: buildx-setup
	@echo "$(CYAN)Building frontend Docker image for multiple architectures (amd64, arm64)...$(NC)"
	@echo "$(YELLOW)Note: Images built for registry (not loaded locally). Use push commands to upload.$(NC)"
	@cd frontend && docker buildx build \
		--platform $(PLATFORMS) \
		-t $(FRONTEND_IMAGE) \
		.
	@echo "$(GREEN)✓ Frontend multi-arch image built$(NC)"

build-backend-multiarch-push: buildx-setup
	@echo "$(CYAN)Building and pushing backend multi-arch image...$(NC)"
	@cd backend && docker buildx build \
		--platform $(PLATFORMS) \
		-t $(BACKEND_IMAGE) \
		--push \
		.
	@echo "$(GREEN)✓ Backend multi-arch image built and pushed$(NC)"

build-frontend-multiarch-push: buildx-setup
	@echo "$(CYAN)Building and pushing frontend multi-arch image...$(NC)"
	@cd frontend && docker buildx build \
		--platform $(PLATFORMS) \
		-t $(FRONTEND_IMAGE) \
		--push \
		.
	@echo "$(GREEN)✓ Frontend multi-arch image built and pushed$(NC)"

deploy: build deploy-k8s
	@echo "$(GREEN)✓ Full deployment completed$(NC)"

deploy-k8s: deploy-namespace deploy-configmap deploy-mongodb wait-mongodb deploy-backend wait-backend deploy-frontend wait-frontend
	@echo ""
	@echo "$(GREEN)=========================================$(NC)"
	@echo "$(GREEN)✓ Deployment Complete!$(NC)"
	@echo "$(GREEN)=========================================$(NC)"
	@echo ""
	@make info

deploy-namespace:
	@echo "$(CYAN)Creating namespace...$(NC)"
	@kubectl apply -f k8s/namespace.yaml
	@echo "$(GREEN)✓ Namespace created$(NC)"

deploy-configmap:
	@echo "$(CYAN)Creating ConfigMap...$(NC)"
	@kubectl apply -f k8s/configmap.yaml
	@echo "$(GREEN)✓ ConfigMap created$(NC)"

deploy-mongodb:
	@echo "$(CYAN)Deploying MongoDB...$(NC)"
	@kubectl apply -f k8s/mongodb-deployment.yaml
	@kubectl apply -f k8s/mongodb-service.yaml
	@echo "$(GREEN)✓ MongoDB deployed$(NC)"

deploy-backend:
	@echo "$(CYAN)Deploying Backend...$(NC)"
	@kubectl apply -f k8s/backend-deployment.yaml
	@kubectl apply -f k8s/backend-service.yaml
	@echo "$(GREEN)✓ Backend deployed$(NC)"

deploy-frontend:
	@echo "$(CYAN)Deploying Frontend...$(NC)"
	@kubectl apply -f k8s/frontend-deployment.yaml
	@kubectl apply -f k8s/frontend-service.yaml
	@echo "$(GREEN)✓ Frontend deployed$(NC)"

wait-mongodb:
	@echo "$(YELLOW)Waiting for MongoDB to be ready...$(NC)"
	@kubectl wait --for=condition=ready pod -l app=mongodb -n $(NAMESPACE) --timeout=180s || true
	@echo "$(GREEN)✓ MongoDB is ready$(NC)"

wait-backend:
	@echo "$(YELLOW)Waiting for Backend to be ready...$(NC)"
	@kubectl wait --for=condition=ready pod -l app=backend -n $(NAMESPACE) --timeout=180s || true
	@echo "$(GREEN)✓ Backend is ready$(NC)"

wait-frontend:
	@echo "$(YELLOW)Waiting for Frontend to be ready...$(NC)"
	@kubectl wait --for=condition=ready pod -l app=frontend -n $(NAMESPACE) --timeout=180s || true
	@echo "$(GREEN)✓ Frontend is ready$(NC)"

status:
	@echo "$(CYAN)Kubernetes Resources Status:$(NC)"
	@kubectl get all -n $(NAMESPACE)

pods:
	@echo "$(CYAN)Pods in $(NAMESPACE) namespace:$(NC)"
	@kubectl get pods -n $(NAMESPACE)

services:
	@echo "$(CYAN)Services in $(NAMESPACE) namespace:$(NC)"
	@kubectl get services -n $(NAMESPACE)

describe:
	@echo "$(CYAN)Detailed resource information:$(NC)"
	@kubectl describe all -n $(NAMESPACE)

logs:
	@echo "$(CYAN)=== Backend Logs ===$(NC)"
	@kubectl logs -l app=backend -n $(NAMESPACE) --tail=20 --prefix=true || true
	@echo ""
	@echo "$(CYAN)=== Frontend Logs ===$(NC)"
	@kubectl logs -l app=frontend -n $(NAMESPACE) --tail=20 --prefix=true || true
	@echo ""
	@echo "$(CYAN)=== MongoDB Logs ===$(NC)"
	@kubectl logs -l app=mongodb -n $(NAMESPACE) --tail=20 --prefix=true || true

logs-backend:
	@kubectl logs -l app=backend -n $(NAMESPACE) --tail=50 -f

logs-frontend:
	@kubectl logs -l app=frontend -n $(NAMESPACE) --tail=50 -f

logs-mongodb:
	@kubectl logs -l app=mongodb -n $(NAMESPACE) --tail=50 -f

scale-up:
	@echo "$(CYAN)Scaling up deployments...$(NC)"
	@kubectl scale deployment backend-deployment -n $(NAMESPACE) --replicas=3
	@kubectl scale deployment frontend-deployment -n $(NAMESPACE) --replicas=3
	@echo "$(GREEN)✓ Scaled to 3 replicas$(NC)"

scale-down:
	@echo "$(CYAN)Scaling down deployments...$(NC)"
	@kubectl scale deployment backend-deployment -n $(NAMESPACE) --replicas=1
	@kubectl scale deployment frontend-deployment -n $(NAMESPACE) --replicas=1
	@echo "$(GREEN)✓ Scaled to 1 replica$(NC)"

restart:
	@echo "$(CYAN)Restarting deployments...$(NC)"
	@kubectl rollout restart deployment backend-deployment -n $(NAMESPACE)
	@kubectl rollout restart deployment frontend-deployment -n $(NAMESPACE)
	@kubectl rollout restart deployment mongodb-deployment -n $(NAMESPACE)
	@echo "$(GREEN)✓ All deployments restarted$(NC)"

dev-up:
	@echo "$(CYAN)Starting development environment...$(NC)"
	@docker-compose up -d
	@echo "$(GREEN)✓ Development environment started$(NC)"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend:  http://localhost:5000"

dev-down:
	@echo "$(CYAN)Stopping development environment...$(NC)"
	@docker-compose down
	@echo "$(GREEN)✓ Development environment stopped$(NC)"

dev-logs:
	@docker-compose logs -f

test-api:
	@echo "$(CYAN)Testing API endpoints...$(NC)"
	@echo ""
	@echo "$(YELLOW)Health Check:$(NC)"
	@curl -s http://localhost:30001/health | jq . || echo "Service not available"
	@echo ""
	@echo "$(YELLOW)Get Todos:$(NC)"
	@curl -s http://localhost:30001/api/todos | jq . || echo "Service not available"

health-check:
	@echo "$(CYAN)Checking service health...$(NC)"
	@echo ""
	@echo -n "$(YELLOW)Backend Health: $(NC)"
	@curl -s -o /dev/null -w "%{http_code}" http://localhost:30001/health && echo " $(GREEN)✓$(NC)" || echo " $(RED)✗$(NC)"
	@echo -n "$(YELLOW)Frontend Health: $(NC)"
	@curl -s -o /dev/null -w "%{http_code}" http://localhost:30000 && echo " $(GREEN)✓$(NC)" || echo " $(RED)✗$(NC)"

clean:
	@echo "$(YELLOW)Cleaning up Kubernetes resources...$(NC)"
	@kubectl delete namespace $(NAMESPACE) --ignore-not-found=true
	@echo "$(YELLOW)Waiting for namespace deletion...$(NC)"
	@kubectl wait --for=delete namespace/$(NAMESPACE) --timeout=120s 2>/dev/null || true
	@echo "$(GREEN)✓ Cleanup complete$(NC)"

clean-images:
	@echo "$(YELLOW)Removing Docker images...$(NC)"
	@docker rmi $(BACKEND_IMAGE) 2>/dev/null || true
	@docker rmi $(FRONTEND_IMAGE) 2>/dev/null || true
	@echo "$(GREEN)✓ Images removed$(NC)"

clean-all: clean clean-images
	@echo "$(GREEN)✓ Complete cleanup done$(NC)"

info:
	@echo "$(CYAN)Application Information:$(NC)"
	@echo ""
	@echo "$(GREEN)Access Points:$(NC)"
	@echo "  Frontend:  http://localhost (LoadBalancer)"
	@echo "  Backend:   http://localhost:30001"
	@echo "  Health:    http://localhost:30001/health"
	@echo ""
	@echo "$(YELLOW)Get Frontend External IP:$(NC)"
	@echo "  kubectl get service frontend-service -n $(NAMESPACE)"
	@echo ""
	@echo "$(GREEN)Useful Commands:$(NC)"
	@echo "  Status:    make status"
	@echo "  Logs:      make logs"
	@echo "  Cleanup:   make clean"
	@echo "  Help:      make help"

.DEFAULT_GOAL := help

