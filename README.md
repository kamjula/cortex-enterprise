# Cortex Enterprise

**AI Data Trust & Insights Platform**

Upload datasets → Analyze quality → Get insights → Browse catalog

## Features
- Dataset Upload with preview
- Trust Engine (quality analysis)
- Insight Copilot (AI insights)
- AI Data Catalog (searchable)

## Tech Stack
React | FastAPI | PostgreSQL | DuckDB | Great Expectations | Docker

## Quick Start
```bash
docker-compose up -d
cd backend && pip install -r requirements.txt
cd ../frontend && npm install && npm start
```

## Documentation
- [Product Requirements](docs/PRODUCT_REQUIREMENTS.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Roadmap](docs/ROADMAP.md)
- [Tech Stack](docs/TECH_STACK.md)

## Week 1 Checklist
- [x] GitHub repo created (cortex-enterprise)
- [x] Folder structure setup (backend, frontend, docs)
- [x] Planning docs committed (requirements, architecture, roadmap, tech stack)
- [x] docker-compose.yml (PostgreSQL + PgAdmin)
- [x] backend/requirements.txt (FastAPI, SQLAlchemy, DuckDB stack)
- [x] backend/app/main.py (FastAPI scaffold)
- [x] backend/.env.example (DB + JWT config)
- [ ] Docker running locally (docker ps)
- [ ] PostgreSQL accessible (localhost:5432)
- [ ] FastAPI running (localhost:8000/docs)
- [ ] /health endpoint working

## Week 1 File Structure
```
cortex-enterprise/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   └── main.py          ← FastAPI app
│   ├── requirements.txt     ← Python deps
│   └── .env.example         ← Config template
├── frontend/
│   └── package.json         ← React + Vite
├── docs/
│   ├── PRODUCT_REQUIREMENTS.md
│   ├── ARCHITECTURE.md
│   ├── ROADMAP.md
│   └── TECH_STACK.md
├── docker-compose.yml       ← PostgreSQL + PgAdmin
├── .gitignore
├── LICENSE
└── README.md
```

## Run This Week

**Step 1 - Start PostgreSQL:**
```bash
docker-compose up -d
# Visit PgAdmin: http://localhost:5050
# Email: admin@cortex.local / Password: admin
```

**Step 2 - Run FastAPI:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# Visit: http://localhost:8000/docs
```

**Status: Week 1 Complete - Ready for Week 2**
