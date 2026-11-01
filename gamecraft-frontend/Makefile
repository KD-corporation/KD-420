# GameCraft frontend — local development commands.
# Run `make help` to list targets.

.DEFAULT_GOAL := help

.PHONY: help setup env install dev build start lint clean

help: ## Show this help
	@echo "GameCraft frontend — available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

setup: env install ## One-shot setup: env file + npm install
	@echo ""
	@echo "Setup complete. Start the dev server with:  make dev"

env: ## Create .env.local from .env.example if it does not exist
	@if [ ! -f .env.local ]; then cp .env.example .env.local && echo "created .env.local from .env.example"; else echo ".env.local already exists"; fi

install: ## Install npm dependencies (uses package-lock.json when present)
	npm install

dev: ## Start the dev server on http://localhost:3000
	npm run dev

build: ## Production build
	npm run build

start: ## Serve an existing production build
	npm run start

lint: ## Run ESLint
	npm run lint

clean: ## Remove build artifacts and dependencies
	rm -rf .next node_modules
