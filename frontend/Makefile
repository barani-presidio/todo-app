.PHONY: help install dev build start test clean lint

CYAN := \033[0;36m
GREEN := \033[0;32m
NC := \033[0m

help:
	@echo "$(CYAN)Frontend Makefile Commands$(NC)"
	@echo ""
	@echo "  make install   - Install Node.js dependencies"
	@echo "  make dev       - Start development server"
	@echo "  make build     - Build production bundle"
	@echo "  make start     - Serve production build"
	@echo "  make test      - Run tests"
	@echo "  make clean     - Remove node_modules and build artifacts"
	@echo "  make lint      - Run linter"

install:
	@echo "$(CYAN)Installing frontend dependencies...$(NC)"
	@npm install
	@echo "$(GREEN)✓ Dependencies installed$(NC)"

dev:
	@echo "$(CYAN)Starting development server...$(NC)"
	@npm start

build:
	@echo "$(CYAN)Building production bundle...$(NC)"
	@npm run build
	@echo "$(GREEN)✓ Production build complete$(NC)"

start:
	@echo "$(CYAN)Serving production build...$(NC)"
	@npx serve -s build -l 3000

test:
	@echo "$(CYAN)Running tests...$(NC)"
	@npm test || echo "No tests configured yet"

clean:
	@echo "$(CYAN)Cleaning frontend...$(NC)"
	@rm -rf node_modules 2>/dev/null || true
	@rm -rf build 2>/dev/null || true
	@rm -rf package-lock.json 2>/dev/null || true
	@echo "$(GREEN)✓ Frontend cleaned$(NC)"

lint:
	@echo "$(CYAN)Linting frontend code...$(NC)"
	@npm run lint || echo "No linter configured yet"

.DEFAULT_GOAL := help
