# Architecture

## Cortex Enterprise - System Architecture

### Overview
Three-tier architecture: React frontend, FastAPI backend, PostgreSQL + DuckDB storage

### Components

#### Frontend (React + TypeScript + Vite)
- Pages: Upload, Quality Dashboard, Insights, Catalog
- State: Zustand
- API: Axios

#### Backend (FastAPI)
- /api/v1/datasets - CRUD for datasets
- /api/v1/quality - Quality analysis
- /api/v1/insights - AI insights
- /api/v1/catalog - Data catalog

#### Database
- PostgreSQL: Users, datasets metadata, audit logs
- DuckDB: In-process analytics on dataset files

### Database Schema

users: id, email, name, created_at
datasets: id, user_id, name, file_path, row_count, col_count, status, created_at
quality_reports: id, dataset_id, score, issues, created_at
insights: id, dataset_id, content, type, created_at
