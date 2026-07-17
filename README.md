# CortexOS — Enterprise Data Platform

> Enterprise AI Data Platform

**React • Node.js • Express • PostgreSQL**

Pipeline Monitoring • Data Quality • AI Copilot • Dataset Management

CortexOS is an AI-powered enterprise data platform designed to help teams monitor data pipelines, improve data quality, manage enterprise datasets, and surface AI-driven insights from a single workspace. Built with React, Node.js, Express, and PostgreSQL, the platform combines functional full-stack workflows with enterprise dashboard interfaces for modern data operations.

## Tech Stack

- **Frontend:** React 19, Vite, JavaScript, Recharts, Lucide React
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Design & Development Tools:** Git, GitHub, VS Code, Figma

## Architecture

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | PostgreSQL |

## Project Status

| Feature | Status |
|---|---|
| Dataset Management | Functional |
| Pipeline Monitoring | Functional |
| Data Quality | Functional |
| AI Copilot | UI Prototype |
| Alerts Management | Functional |
| User Management | UI Prototype |
| Settings | UI Prototype |
| Authentication | Planned |

## Current Features

- **Dataset Management:** Create, view, update, and delete datasets through a REST API backed by PostgreSQL.
- **Pipeline Monitoring:** Track pipeline status, trigger pipeline runs, retry failed executions, and review execution logs.
- **Data Quality Dashboard:** Monitor quality scores, validation metrics, missing values, failed checks, and dataset-level quality trends.
- **AI Copilot:** Conversational interface designed to answer questions about datasets, pipelines, alerts, and data quality.
- **Alerts Management:** Create, view, edit, resolve, and delete enterprise alerts with severity and status tracking.
- **User Management:** Enterprise-style interface for viewing users, roles, and account status.
- **Settings:** Interface for notification, security, integration, and appearance preferences.

## Highlights

- Enterprise dashboard with 8 integrated modules
- Responsive modern user interface
- RESTful API architecture
- PostgreSQL database integration
- Dataset and alerts CRUD workflows
- Pipeline monitoring and execution logs
- Data quality analytics and visualizations
- AI Copilot interface
- Professional Figma prototype and developer handoff

## Key Modules

- Dashboard
- Dataset Management
- Pipeline Monitoring
- Data Quality
- AI Copilot
- Alerts Management
- User Management
- Settings

## Roadmap

See the [open issues](https://github.com/kamjula/cortex-enterprise/issues) for upcoming enhancements, including:

- JWT authentication
- Role-based access control
- AI backend integration
- Deployment configuration
- Loading, empty, and error states
- Production-ready monitoring
- Additional automated data quality checks

## Getting Started

### Prerequisites

- Node.js v18 or later
- PostgreSQL running locally or remotely
- npm

### Backend Setup

```bash
cd backend
npm install
```

Create a `backend/.env` file:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=cortexos
```

Start the backend server:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5050
```

### Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend usually runs on:

```text
http://localhost:5173
```

## Screenshots

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Dataset Management

![Dataset Management](screenshots/datasets.png)

### Pipeline Monitoring

![Pipeline Monitoring](screenshots/pipelines.png)

### Data Quality

![Data Quality](screenshots/data-quality.png)

### AI Copilot

![AI Copilot](screenshots/ai-copilot.png)

### Alerts Management

![Alerts Management](screenshots/alerts.png)

### User Management

![User Management](screenshots/users.png)

### Settings

![Settings](screenshots/settings.png)

## Project Purpose

CortexOS was created as a portfolio project to demonstrate full-stack development, enterprise data platform design, REST API development, PostgreSQL integration, data quality monitoring, pipeline operations, and AI-assisted workflow concepts.

## License

This repository is intended for portfolio and educational purposes only. Commercial use or redistribution without permission is not permitted.
