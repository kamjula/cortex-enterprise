# Cortex Enterprise

**AI Data Trust & Insights Platform**

Upload datasets → Analyze quality → Get AI insights → Browse catalog

![Week](https://img.shields.io/badge/Week-2%20of%2010-blue)
![Status](https://img.shields.io/badge/Status-Active%20Development-green)
![Stack](https://img.shields.io/badge/Stack-FastAPI%20%7C%20React%20%7C%20PostgreSQL-orange)

---

## Features

- Dataset Upload with preview and validation
- - Trust Engine (data quality analysis with Great Expectations)
  - - Insight Copilot (AI-powered insights via LLM)
    - - AI Data Catalog (searchable, filterable dataset registry)
      - - Analytics Dashboard (real-time metrics and visualizations)
        - - JWT Authentication and Role-Based Access Control
         
          - ---

          ## Tech Stack

          | Layer | Technology |
          |-------|------------|
          | Frontend | React + Vite + TypeScript |
          | Backend | FastAPI + Python 3.11 |
          | Database | PostgreSQL + SQLAlchemy |
          | Analytics | DuckDB + Pandas |
          | Data Quality | Great Expectations |
          | Auth | JWT + OAuth2 |
          | Infrastructure | Docker + Docker Compose |

          ---

          ## Project Structure

          ```
          cortex-enterprise/
          ├── backend/
          │   ├── app/
          │   │   ├── api/           ← API route handlers
          │   │   ├── analytics/     ← Analytics Dashboard module
          │   │   ├── auth/          ← Authentication and JWT
          │   │   ├── catalog/       ← AI Data Catalog
          │   │   ├── etl/           ← ETL Pipeline
          │   │   ├── models/        ← SQLAlchemy ORM models
          │   │   ├── quality/       ← Data Quality Engine
          │   │   └── main.py        ← FastAPI entry point
          │   ├── requirements.txt
          │   └── .env.example
          ├── frontend/
          │   └── package.json
          ├── docs/
          │   ├── PRODUCT_REQUIREMENTS.md
          │   ├── ARCHITECTURE.md
          │   ├── ROADMAP.md
          │   └── TECH_STACK.md
          ├── tests/
          ├── docker-compose.yml
          └── README.md
          ```

          ---

          ## Quick Start

          ```bash
          # 1. Start PostgreSQL
          docker-compose up -d

          # 2. Run Backend
          cd backend
          python -m venv venv
          source venv/bin/activate
          pip install -r requirements.txt
          uvicorn app.main:app --reload --port 8000
          # API Docs: http://localhost:8000/docs

          # 3. Run Frontend
          cd frontend
          npm install && npm start
          # App: http://localhost:3000
          ```

          ---

          ## 10-Week Roadmap

          | Week | Focus | Status |
          |------|-------|--------|
          | 1 | Requirements + Architecture | Done |
          | 2 | Database Schema + Backend Setup + Module Scaffolds | Done |
          | 3 | ETL Pipeline | Next |
          | 4 | AI Data Catalog | Planned |
          | 5 | Data Quality Engine | Planned |
          | 6 | AI Analytics | Planned |
          | 7 | Dashboard | Planned |
          | 8 | Authentication | Planned |
          | 9 | Testing | Planned |
          | 10 | Deployment + Documentation | Planned |

          ---

          ## Week 2 Progress

          **Completed:**
          - Module scaffolds: etl, catalog, quality, analytics, auth, api, models
          - - Backend folder structure finalized
            - - tests/ directory created
              - - Docker + PostgreSQL running locally
                - - FastAPI running at localhost:8000/docs
                 
                  - **Next - Week 3 - ETL Pipeline:**
                  - - CSV/JSON/Parquet ingestion
                    - - DuckDB analytics engine integration
                      - - Data profiling
                        - - Upload API endpoint
                         
                          - ---

                          ## Documentation

                          - [Product Requirements](docs/PRODUCT_REQUIREMENTS.md)
                          - - [Architecture](docs/ARCHITECTURE.md)
                            - - [Roadmap](docs/ROADMAP.md)
                              - - [Tech Stack](docs/TECH_STACK.md)
                               
                                - ---

                                ## Contributing

                                This project is part of a 10-week build sprint. Issues and PRs welcome!

                                ---

                                *Week 2 of 10 - Cortex Enterprise*
                                
