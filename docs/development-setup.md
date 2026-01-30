# SmartCart AI - Development Setup Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Database Setup](#database-setup)
4. [Service Configuration](#service-configuration)
5. [Running Services](#running-services)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

| Software | Version | Installation |
|----------|---------|--------------|
| Node.js | 20+ | https://nodejs.org/ |
| Python | 3.11+ | https://www.python.org/ |
| Docker | 24+ | https://www.docker.com/ |
| Docker Compose | 2.20+ | Included with Docker Desktop |
| PostgreSQL | 15+ | https://www.postgresql.org/ (or use Docker) |
| Redis | 7+ | https://redis.io/ (or use Docker) |
| Git | Latest | https://git-scm.com/ |

### API Keys Required

Before starting, obtain the following API keys:

1. **Anthropic Claude API** - https://console.anthropic.com/
2. **Razorpay** (for payments) - https://dashboard.razorpay.com/
3. **Twilio** (for SMS) - https://www.twilio.com/
4. **Telegram Bot Token** - https://core.telegram.org/bots#botfather

---

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-org/smartcart-ai.git
cd smartcart-ai
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your API keys
nano .env  # or use your preferred editor
```

**Critical environment variables to set:**
```env
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
DATABASE_URL=postgresql://smartcart_user:smartcart_password_2026@localhost:5432/smartcart_db
REDIS_URL=redis://:redis_password_2026@localhost:6379
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_secret
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=your_token
```

---

## Database Setup

### Option 1: Using Docker (Recommended)

```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Wait for services to be healthy
docker-compose ps

# Initialize database schema
docker-compose exec postgres psql -U smartcart_user -d smartcart_db -f /docker-entrypoint-initdb.d/01-schema.sql
```

### Option 2: Local PostgreSQL Installation

```bash
# Create database
createdb smartcart_db

# Create user
psql -c "CREATE USER smartcart_user WITH PASSWORD 'smartcart_password_2026';"

# Grant privileges
psql -c "GRANT ALL PRIVILEGES ON DATABASE smartcart_db TO smartcart_user;"

# Run schema
psql -U smartcart_user -d smartcart_db -f database/schema.sql
```

### Verify Database

```bash
# Connect to database
psql -U smartcart_user -d smartcart_db

# Check tables
\dt

# Should see: users, stores, products, orders, etc.
```

---

## Service Configuration

### NLP Service (Python)

```bash
cd services/nlp-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Test service
python main.py
# Should start on http://localhost:8001
```

### Product Service (Node.js)

```bash
cd services/product-service

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run in development mode
npm run dev
# Should start on http://localhost:8002
```

### Repeat for Other Services

Follow similar steps for:
- `order-service` (port 8003)
- `customer-service` (port 8004)
- `payment-service` (port 8005)
- `notification-service` (port 8006)
- `analytics-service` (port 8007)

---

## Running Services

### Option 1: Docker Compose (All Services)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check service health
curl http://localhost:8080/health  # API Gateway
curl http://localhost:8001/health  # NLP Service
curl http://localhost:8002/health  # Product Service
```

### Option 2: Individual Services (Development)

**Terminal 1 - Database & Cache:**
```bash
docker-compose up -d postgres redis
```

**Terminal 2 - NLP Service:**
```bash
cd services/nlp-service
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn main:app --reload --port 8001
```

**Terminal 3 - Product Service:**
```bash
cd services/product-service
npm run dev
```

**Terminal 4 - API Gateway:**
```bash
cd services/api-gateway
npm run dev
```

---

## Testing

### Unit Tests

```bash
# Node.js services
cd services/product-service
npm test

# Python services
cd services/nlp-service
pytest
```

### Integration Tests

```bash
# From project root
npm run test:integration
```

### API Testing with cURL

**Test NLP Service:**
```bash
curl -X POST http://localhost:8001/nlp/parse \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I need 2 kg tomatoes and 1 liter milk",
    "user_id": "test-user-123"
  }'
```

**Test Product Service:**
```bash
curl http://localhost:8002/products?store_id=test-store-id
```

### Load Testing

```bash
# Install k6
# macOS: brew install k6
# Windows: choco install k6

# Run load test
k6 run tests/performance/load-test.js
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Error

**Error:** `ECONNREFUSED localhost:5432`

**Solution:**
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

#### 2. Redis Connection Error

**Error:** `ECONNREFUSED localhost:6379`

**Solution:**
```bash
# Check Redis
docker-compose ps redis

# Test connection
redis-cli ping
# Should return: PONG
```

#### 3. NLP Service - spaCy Model Not Found

**Error:** `Can't find model 'en_core_web_sm'`

**Solution:**
```bash
cd services/nlp-service
source venv/bin/activate
python -m spacy download en_core_web_sm
```

#### 4. Port Already in Use

**Error:** `EADDRINUSE: address already in use :::8002`

**Solution:**
```bash
# Find process using port
# Windows:
netstat -ano | findstr :8002
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :8002
kill -9 <PID>
```

#### 5. TypeScript Compilation Errors

**Solution:**
```bash
cd services/product-service
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Debugging Tips

1. **Enable Debug Logging:**
   ```env
   DEBUG=true
   LOG_LEVEL=debug
   ```

2. **Check Service Health:**
   ```bash
   curl http://localhost:8002/health
   ```

3. **View Docker Logs:**
   ```bash
   docker-compose logs -f product-service
   ```

4. **Database Queries:**
   ```bash
   psql -U smartcart_user -d smartcart_db
   SELECT * FROM products LIMIT 5;
   ```

---

## Development Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes
- Edit code
- Add tests
- Update documentation

### 3. Run Tests
```bash
npm test
npm run lint
```

### 4. Commit Changes
```bash
git add .
git commit -m "feat: add your feature description"
```

### 5. Push and Create PR
```bash
git push origin feature/your-feature-name
# Create Pull Request on GitHub
```

---

## Useful Commands

### Docker
```bash
# Stop all services
docker-compose down

# Remove volumes (reset database)
docker-compose down -v

# Rebuild services
docker-compose build

# View resource usage
docker stats
```

### Database
```bash
# Backup database
pg_dump -U smartcart_user smartcart_db > backup.sql

# Restore database
psql -U smartcart_user smartcart_db < backup.sql

# Reset database
psql -U smartcart_user -d smartcart_db -f database/schema.sql
```

### Logs
```bash
# Follow logs for specific service
docker-compose logs -f product-service

# View last 100 lines
docker-compose logs --tail=100 nlp-service
```

---

## Next Steps

1. ✅ Complete setup
2. 📖 Read [API Documentation](docs/api-specification.yaml)
3. 🧪 Run tests
4. 🚀 Deploy to staging (see [Deployment Guide](docs/deployment-guide.md))

---

## Support

- **Issues**: https://github.com/your-org/smartcart-ai/issues
- **Slack**: #smartcart-dev channel
- **Email**: dev@smartcart.ai

---

**Happy Coding! 🚀**
