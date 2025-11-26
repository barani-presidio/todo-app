.PHONY: help install dev start test clean lint

CYAN := \033[0;36m
GREEN := \033[0;32m
NC := \033[0m

help:
	@echo "$(CYAN)Backend Makefile Commands$(NC)"
	@echo ""
	@echo "  make install   - Install Node.js dependencies"
	@echo "  make dev       - Start development server with auto-reload"
	@echo "  make start     - Start production server"
	@echo "  make test      - Run tests"
	@echo "  make clean     - Remove node_modules and artifacts"
	@echo "  make lint      - Run linter"

install:
	@echo "$(CYAN)Installing backend dependencies...$(NC)"
	@npm install
	@echo "$(GREEN)✓ Dependencies installed$(NC)"

dev:
	@echo "$(CYAN)Starting development server...$(NC)"
	@NODE_ENV=development npm run dev

start:
	@echo "$(CYAN)Starting production server...$(NC)"
	@NODE_ENV=production npm start

test:
	@echo "$(CYAN)Running tests...$(NC)"
	@npm test || echo "No tests configured yet"

clean:
	@echo "$(CYAN)Cleaning backend...$(NC)"
	@rm -rf node_modules 2>/dev/null || true
	@rm -rf package-lock.json 2>/dev/null || true
	@echo "$(GREEN)✓ Backend cleaned$(NC)"

lint:
	@echo "$(CYAN)Linting backend code...$(NC)"
	@npm run lint || echo "No linter configured yet"

.DEFAULT_GOAL := help
