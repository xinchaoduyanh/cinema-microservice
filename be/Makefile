# ============================================
# Makefile for Cinema Management Backend
# ============================================
# Quick commands for development workflow
#
# Usage:
#   make dev          - Start all services in Docker
#   make dev-infra    - Start only Redis & Kafka
#   make logs         - View logs
#   make stop         - Stop all services
#   make restart      - Restart services

.PHONY: help dev dev-infra dev-local logs logs-node logs-redis logs-kafka stop restart clean ps test

# Default target
help:
	@echo "🚀 Cinema Management Backend - Available Commands:"
	@echo ""
	@echo "  Development:"
	@echo "    make dev          - Start all services (Redis, Kafka, NestJS) in Docker"
	@echo "    make dev-infra    - Start only infrastructure (Redis, Kafka)"
	@echo "    make dev-local    - Start infra + run NestJS locally (pnpm dev)"
	@echo ""
	@echo "  Logs:"
	@echo "    make logs         - View all logs"
	@echo "    make logs-node    - View NestJS logs"
	@echo "    make logs-redis   - View Redis logs"
	@echo "    make logs-kafka   - View Kafka logs"
	@echo ""
	@echo "  Control:"
	@echo "    make stop         - Stop all services"
	@echo "    make restart      - Restart all services"
	@echo "    make restart-node - Restart only NestJS"
	@echo "    make ps           - Show running containers"
	@echo ""
	@echo "  Cleanup:"
	@echo "    make clean        - Stop and remove all containers"
	@echo "    make clean-all    - Stop, remove containers and volumes"
	@echo ""
	@echo "  Testing:"
	@echo "    make test         - Run tests"
	@echo "    make test-watch   - Run tests in watch mode"
	@echo ""
	@echo "  Documentation:"
	@echo "    Swagger Auth      - http://localhost:3300/swagger"
	@echo "    Swagger User      - http://localhost:3301/swagger"
	@echo "    Swagger Movie     - http://localhost:3302/swagger"
	@echo ""

# ============================================
# Development Commands
# ============================================

# Start all services in Docker (recommended)
dev:
	@echo "🚀 Starting all services in Docker..."
	docker-compose -f docker-compose.dev.yml up -d
	@echo "✅ Services started! View logs with: make logs"
	@echo "📊 Kafka UI: http://localhost:18082 (admin/secret)"
	@echo "📊 Redis Insight: http://localhost:5544"

# Start only infrastructure (Redis + Kafka)
dev-infra:
	@echo "🔧 Starting infrastructure (Redis + Kafka)..."
	docker-compose -f docker-compose.dev.yml up -d redis kafka redisinsight kafkaui
	@echo "✅ Infrastructure started!"
	@echo "📝 Now run: pnpm dev"

# Start infrastructure + run NestJS locally
dev-local: dev-infra
	@echo "💻 Starting NestJS services locally..."
	pnpm dev

# ============================================
# Logs Commands
# ============================================

# View all logs
logs:
	docker-compose -f docker-compose.dev.yml logs -f

# View NestJS logs
logs-node:
	docker-compose -f docker-compose.dev.yml logs -f node

# View Redis logs
logs-redis:
	docker-compose -f docker-compose.dev.yml logs -f redis

# View Kafka logs
logs-kafka:
	docker-compose -f docker-compose.dev.yml logs -f kafka

# ============================================
# Control Commands
# ============================================

# Stop all services
stop:
	@echo "🛑 Stopping all services..."
	@docker-compose -f docker-compose.dev.yml down
	@echo "🧹 Killing lingering local Node.js processes..."
	@pkill -f "node" || true
	@echo "✅ All services stopped!"

# Restart all services
restart:
	@echo "🔄 Restarting all services..."
	docker-compose -f docker-compose.dev.yml restart
	@echo "✅ Services restarted!"

# Restart only NestJS
restart-node:
	@echo "🔄 Restarting NestJS services..."
	docker-compose -f docker-compose.dev.yml restart node
	@echo "✅ NestJS restarted!"

# Show running containers
ps:
	docker-compose -f docker-compose.dev.yml ps

# ============================================
# Cleanup Commands
# ============================================

# Stop and remove containers
clean:
	@echo "🧹 Cleaning up containers..."
	docker-compose -f docker-compose.dev.yml down
	@echo "✅ Cleanup complete!"

# Stop, remove containers and volumes
clean-all:
	@echo "🧹 Cleaning up containers and volumes..."
	docker-compose -f docker-compose.dev.yml down -v
	@echo "✅ Full cleanup complete!"

# ============================================
# Testing Commands
# ============================================

# Run tests
test:
	pnpm test

# Run tests in watch mode
test-watch:
	pnpm test:watch

# ============================================
# Database Commands (for local PostgreSQL if needed)
# ============================================

# Start PostgreSQL (if using local DB instead of cloud)
db-local:
	docker-compose up -d db

# Stop PostgreSQL
db-stop:
	docker-compose stop db

# ============================================
# Utility Commands
# ============================================

# Install dependencies
install:
	pnpm install

# Build all services
build:
	pnpm build

# Check environment
check-env:
	@echo "🔍 Checking environment..."
	@echo "Redis URL: $$(grep REDIS_URL .env | cut -d '=' -f2)"
	@echo "Kafka Brokers: $$(grep KAFKA_BROKERS .env | cut -d '=' -f2)"
	@echo ""
	@echo "Docker env:"
	@echo "Redis URL: $$(grep REDIS_URL .env.docker | cut -d '=' -f2)"
	@echo "Kafka Brokers: $$(grep KAFKA_BROKERS .env.docker | cut -d '=' -f2)"

# Health check
health:
	@echo "🏥 Checking service health..."
	@curl -s -I http://localhost:3300/api | grep -q "200" && echo "✅ Auth service (3300) is UP" || echo "❌ Auth service (3300) is DOWN"
	@curl -s -I http://localhost:3301/api | grep -q "200" && echo "✅ User service (3301) is UP" || echo "❌ User service (3301) is DOWN"
	@curl -s -I http://localhost:3302/api | grep -q "200" && echo "✅ Movie service (3302) is UP" || echo "❌ Movie service (3302) is DOWN"
	@curl -s -I http://localhost:3303/api | grep -q "200" && echo "✅ Notification service (3303) is UP" || echo "❌ Notification service (3303) is DOWN"
	@curl -s -I http://localhost:3304/api | grep -q "200" && echo "✅ Cinema service (3304) is UP" || echo "❌ Cinema service (3304) is DOWN"
	@curl -s -I http://localhost:3305/api | grep -q "200" && echo "✅ Booking service (3305) is UP" || echo "❌ Booking service (3305) is DOWN"
	@echo "✅ Health check complete!"
