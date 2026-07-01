# Cortex Enterprise

> Distributed Enterprise Data Platform — built by a Software Systems Engineer
>
> ![Build](https://img.shields.io/badge/build-passing-brightgreen) ![Week](https://img.shields.io/badge/Week-1%20of%206-blue) ![Stack](https://img.shields.io/badge/Stack-FastAPI%20%7C%20PostgreSQL%20%7C%20Redis%20%7C%20Kafka%20%7C%20Docker-orange) ![Role](https://img.shields.io/badge/Target-FDE%20%7C%20Palantir%20%7C%20OpenAI%20%7C%20Scale%20AI-red)
>
> ---
>
> ## What is Cortex Enterprise?
>
> Cortex is not a data science project. It is a **production-grade distributed platform** that handles data ingestion, quality enforcement, event-driven processing, and AI-powered analytics at scale.
>
> Built to demonstrate the exact skills that top-tier engineering teams (Palantir, OpenAI, Scale AI) evaluate in Forward Deployed Engineer and Software Systems Engineer interviews.
>
> ---
>
> ## Architecture Overview
>
> Client (React) --> API Gateway (FastAPI) --> Service Layer --> [PostgreSQL | Redis Cache | Kafka Queue] --> Worker Services --> AI Engine
>
> Design principles: Event-driven, Stateless APIs, Cache-aside pattern, CQRS, Idempotent workers, CAP theorem aware
>
> ---
>
> ## 6-Week Build Roadmap
>
> This is a focused 6-week sprint. Each week ships real, working code. No tutorials. No toy examples.
>
> ### WEEK 1 — Systems Foundation [CURRENT]
>
> Status: IN PROGRESS
>
> Skills: Advanced Python, OOP, Async/Await, REST API design, JWT Authentication, pytest, Logging, Error handling, FastAPI dependency injection
>
> Cortex Deliverables:
> Production-ready FastAPI backend with modular structure
> JWT Authentication with refresh tokens
> Health check, versioned API endpoints
> Full pytest test suite with coverage reports
> Structured logging with request tracing
>
> Interview Concept: How does FastAPI handle 10,000 concurrent requests? Why async?
>
> ---
>
> ### WEEK 2 — Database Engineering + Caching
>
> Status: PLANNED
>
> Skills: PostgreSQL advanced queries, Indexing strategies, SQLAlchemy ORM + raw SQL, Redis cache-aside pattern, Connection pooling, Database migrations with Alembic, Background jobs with Celery
>
> Cortex Deliverables:
> User management system with RBAC
> Dataset upload and metadata storage
> Redis caching layer for hot queries
> Async background job queue for data processing
>
> Interview Concept: When does caching hurt consistency? Write-through vs cache-aside tradeoffs.
>
> ---
>
> ### WEEK 3 — Distributed Systems [THE HARD WEEK]
>
> Status: PLANNED
>
> Skills: CAP Theorem (Consistency vs Availability tradeoffs), Kafka event streaming, Message queues vs task queues, Nginx reverse proxy, Load balancing strategies (Round Robin, Least Connections, IP Hash), API Gateway pattern, Microservice decomposition, Eventual consistency, Saga pattern
>
> Cortex Deliverables:
> Split monolith into: Ingest Service, Catalog Service, Quality Service
> Kafka topic: dataset.uploaded -> triggers quality check pipeline
> Nginx config with upstream load balancer
> Circuit breaker pattern between services
>
> Interview Concept: Your service gets a network partition. Do you choose CP or AP? Why?
>
> ---
>
> ### WEEK 4 — Cloud Infrastructure + DevOps
>
> Status: PLANNED
>
> Skills: Docker multi-stage builds, Docker Compose orchestration, Kubernetes (Pods, Deployments, Services, Ingress), AWS EC2 + RDS + S3 + IAM, GitHub Actions CI/CD pipeline, Secrets management, Environment-based config
>
> Cortex Deliverables:
> Dockerize all services with multi-stage production builds
> Deploy Cortex to AWS (EC2 + RDS + S3)
> CI/CD: push to main -> test -> build -> deploy automatically
> k8s manifests for horizontal pod autoscaling
>
> Interview Concept: Zero-downtime deployment strategy. Blue-green vs canary. Which for Cortex?
>
> ---
>
> ### WEEK 5 — System Design + Observability
>
> Status: PLANNED
>
> Skills: System design interviews (URL shortener, file storage, notification system), Prometheus + Grafana monitoring, Distributed tracing with OpenTelemetry, Rate limiting, Idempotency keys, Scalability bottleneck analysis
>
> Cortex Deliverables:
> Prometheus metrics on every API endpoint
> Grafana dashboard: latency P50/P95/P99, error rates, throughput
> Distributed trace IDs across all microservices
> Rate limiter: 100 req/min per user (Redis sliding window)
>
> Interview Concept: Design a system like Palantir Foundry's dataset pipeline. Where are the bottlenecks?
>
> ---
>
> ### WEEK 6 — AI as a Feature (Not the Product)
>
> Status: PLANNED
>
> Skills: RAG (Retrieval Augmented Generation), Vector databases (pgvector), LLM API integration (OpenAI/Anthropic), Prompt engineering for structured outputs, AI root cause analysis, Natural language to SQL
>
> Cortex Deliverables:
> AI Copilot: chat with your data using RAG over dataset metadata
> Natural Language Query: 'Show me datasets with >90% quality score uploaded this month'
> AI Root Cause Analysis on data quality failures
> pgvector semantic search over dataset catalog
>
> Interview Concept: AI is Week 6. The distributed system underneath is what makes it production-ready.
>
> ---
>
> ## Full Tech Stack
>
> Layer: Backend | Tech: Python 3.11, FastAPI, Celery, Alembic
> Layer: Database | Tech: PostgreSQL 15, SQLAlchemy 2.0, pgvector
> Layer: Cache | Tech: Redis 7 (cache-aside, rate limiting, sessions)
> Layer: Messaging | Tech: Apache Kafka (event streaming, async pipelines)
> Layer: Infra | Tech: Docker, Docker Compose, Kubernetes, Nginx
> Layer: Cloud | Tech: AWS (EC2, RDS, S3, IAM, CloudWatch)
> Layer: Observability | Tech: Prometheus, Grafana, OpenTelemetry
> Layer: CI/CD | Tech: GitHub Actions, pytest, coverage
> Layer: AI | Tech: OpenAI API, LangChain, pgvector, RAG pipeline
> Layer: Frontend | Tech: React 18, Vite, TypeScript, TailwindCSS
>
> ---
>
> ## What Recruiters Will See After Week 6
>
> Not: 'I built an AI data project'
>
> But: 'I designed and shipped a distributed enterprise platform with event-driven microservices, production observability, AWS deployment, CI/CD automation, and AI features — from scratch in 6 weeks.'
>
> Proof stack:
> Repository with 6 weeks of real commits (not tutorial copy-paste)
> Working live deployment on AWS
> Architecture decision documents explaining WHY each choice was made
> Interview answers backed by real implementation, not theory
>
> ---
>
> ## Quick Start
>
> git clone https://github.com/kamjula/cortex-enterprise
> cd cortex-enterprise
> docker-compose up -d
> cd backend && pip install -r requirements.txt
> uvicorn app.main:app --reload --port 8000
>
> API Docs: http://localhost:8000/docs
>
> ---
>
> ## Docs
>
> Architecture Decision Records: docs/ARCHITECTURE.md
> System Design Docs: docs/SYSTEM_DESIGN.md
> Roadmap: docs/ROADMAP.md
> Tech Stack Choices: docs/TECH_STACK.md
>
> ---
>
> Built by a Software Systems Engineer. Targeting FDE roles at Palantir, OpenAI, Scale AI.
