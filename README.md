# SmartCart AI - AI-Powered Supermarket Ordering Platform

<div align="center">

![SmartCart AI Logo](docs/assets/logo.png)

**Transform traditional supermarkets into intelligent, automated retail operations**

[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/python-%3E%3D3.11-blue.svg)](https://www.python.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-15%2B-blue.svg)](https://www.postgresql.org/)

[Features](#features) • [Architecture](#architecture) • [Quick Start](#quick-start) • [Documentation](#documentation) • [Deployment](#deployment)

</div>

---

## 📋 Overview

SmartCart AI is a production-ready, AI-powered conversational ordering system that enables customers to shop via messaging platforms (WhatsApp, Telegram, SMS) while providing store owners with real-time inventory management and analytics.

### Key Benefits

- 🤖 **AI-Powered Ordering**: Natural language processing with Claude AI
- 📱 **Multi-Platform**: WhatsApp, Telegram, SMS - no app required
- 📊 **Real-Time Analytics**: Sales insights and customer behavior tracking
- 🔄 **Automated Inventory**: Smart stock management with low-stock alerts
- 💰 **Multiple Payment Options**: UPI, Cards, Wallets, Cash on Delivery
- 🚀 **Scalable Architecture**: Microservices-based, cloud-native design

---

## ✨ Features

### For Customers
- ✅ Natural language ordering ("I need 2kg tomatoes and 1L milk")
- ✅ Multi-language support (English + Hindi)
- ✅ Real-time order tracking
- ✅ Saved addresses and preferences
- ✅ Loyalty points and rewards
- ✅ Voice message support

### For Store Owners
- ✅ Automated stock tracking
- ✅ Low stock alerts
- ✅ Sales analytics dashboard
- ✅ Customer insights
- ✅ Order management
- ✅ Multi-store support

### For Delivery Partners
- ✅ Optimized delivery routes
- ✅ Digital payment tracking
- ✅ Delivery notifications
- ✅ Performance metrics

---

## 🏗️ Architecture

SmartCart AI uses a **microservices architecture** with 8 independent services:

```
┌─────────────────────────────────────────────────────────┐
│                     API Gateway (8080)                   │
│              Rate Limiting • Auth • Routing              │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   ┌─────────┐  ┌─────────┐  ┌─────────┐
   │   NLP   │  │ Product │  │  Order  │
   │ Service │  │ Service │  │ Service │
   │  :8001  │  │  :8002  │  │  :8003  │
   └─────────┘  └─────────┘  └─────────┘
        │            │            │
        └────────────┼────────────┘
                     ▼
            ┌─────────────────┐
            │   PostgreSQL    │
            │   Redis Cache   │
            └─────────────────┘
```

### Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Backend** | Node.js 20 (Fastify) | High-performance APIs |
| **AI/ML** | Python 3.11 (FastAPI) | NLP & Analytics |
| **Database** | PostgreSQL 15+ | Primary data store |
| **Cache** | Redis 7+ | Session & cart management |
| **AI Engine** | Anthropic Claude Sonnet 4 | Conversational AI |
| **Cloud** | AWS (ECS, RDS, S3) | Infrastructure |
| **Orchestration** | Kubernetes (EKS) | Container management |
| **CI/CD** | GitHub Actions | Automated deployment |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ and **npm** 9+
- **Python** 3.11+
- **Docker** 24+ and **Docker Compose** 2.20+
- **PostgreSQL** 15+ (or use Docker)
- **Redis** 7+ (or use Docker)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/smartcart-ai.git
   cd smartcart-ai
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

3. **Start services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Initialize database**
   ```bash
   docker-compose exec postgres psql -U smartcart_user -d smartcart_db -f /docker-entrypoint-initdb.d/01-schema.sql
   ```

5. **Access services**
   - API Gateway: http://localhost:8080
   - NLP Service: http://localhost:8001
   - Product Service: http://localhost:8002
   - Admin Panel: http://localhost:3000
   - API Docs: http://localhost:8080/docs

### Running Individual Services

#### NLP Service (Python)
```bash
cd services/nlp-service
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --reload --port 8001
```

#### Product Service (Node.js)
```bash
cd services/product-service
npm install
npm run dev
```

---

## 📚 Documentation

### Complete Documentation Set

1. **[Product Requirements Document (PRD)](docs/PRD_SmartCart_AI.md)** - 60 pages
   - Market analysis & competitive landscape
   - User personas and feature requirements
   - Success metrics and KPIs

2. **[Technical Requirements Document (TRD)](docs/TRD_SmartCart_AI.md)** - 100+ pages
   - System architecture and technology stack
   - Database design and API specifications
   - Security, deployment, and DevOps

3. **[API Documentation](docs/api-specification.yaml)** - OpenAPI 3.0
   - Complete REST API reference
   - Request/response examples
   - Authentication and error handling

4. **[Database Schema](database/schema.sql)**
   - 15+ tables with relationships
   - Triggers, functions, and views
   - Migration scripts

### Quick Links

- [Development Setup Guide](docs/development-setup.md)
- [Deployment Guide](docs/deployment-guide.md)
- [API Reference](docs/api-specification.yaml)
- [Contributing Guidelines](CONTRIBUTING.md)

---

## 🐳 Docker Deployment

### Build All Services
```bash
docker-compose build
```

### Run in Production Mode
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### View Logs
```bash
docker-compose logs -f product-service
```

---

## ☸️ Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (EKS, GKE, or local with Minikube)
- kubectl configured
- Helm 3+ (optional)

### Deploy to Production
```bash
# Create namespace
kubectl apply -f k8s/production/namespace.yaml

# Deploy all services
kubectl apply -f k8s/production/

# Check deployment status
kubectl get pods -n smartcart-production

# Access logs
kubectl logs -f deployment/api-gateway -n smartcart-production
```

### Scale Services
```bash
kubectl scale deployment product-service --replicas=5 -n smartcart-production
```

---

## 🧪 Testing

### Run Unit Tests
```bash
npm test
```

### Run Integration Tests
```bash
npm run test:integration
```

### Run Load Tests (k6)
```bash
k6 run tests/performance/load-test.js
```

### Test Coverage
```bash
npm run test:coverage
```

---

## 📊 Monitoring & Observability

### Health Checks
- API Gateway: `GET /health`
- Each Service: `GET /health`

### Metrics
- Prometheus metrics: `GET /metrics`
- Grafana dashboards: http://localhost:3001

### Logging
- Centralized logging with ELK Stack
- CloudWatch Logs (AWS)
- Structured JSON logs

### Error Tracking
- Sentry integration for error monitoring
- Real-time alerts via Slack/Email

---

## 💰 Cost Estimates

### MVP (100 stores, 10K users)
- Infrastructure: ~$1,500/month
- AI API: ~$250/month
- SMS: ~$500/month
- **Total: ~$2,250/month**

### At Scale (1,000 stores, 100K users)
- **Total: ~$8,000/month**

---

## 🔒 Security

- ✅ JWT-based authentication with RS256
- ✅ OTP verification for customers
- ✅ Rate limiting (10-100 req/min)
- ✅ HTTPS/TLS 1.3 encryption
- ✅ PCI DSS compliant payments
- ✅ GDPR compliant data handling
- ✅ Input validation and sanitization
- ✅ SQL injection prevention

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md).

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is proprietary software. See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- **Anthropic** for Claude AI API
- **PostgreSQL** community
- **Fastify** and **FastAPI** teams
- All open-source contributors

---

## 📞 Support

- **Email**: support@smartcart.ai
- **Documentation**: https://docs.smartcart.ai
- **Issues**: https://github.com/your-org/smartcart-ai/issues
- **Slack**: https://smartcart-ai.slack.com

---

<div align="center">

**Built with ❤️ by the SmartCart AI Team**

[Website](https://smartcart.ai) • [Documentation](https://docs.smartcart.ai) • [Blog](https://blog.smartcart.ai)

</div>
