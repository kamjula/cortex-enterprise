# CortexOS — Enterprise Data Platform
Enterprise AI Data Platform

React • Node.js • Express • PostgreSQL

Pipeline Monitoring • Data Quality • AI Copilot • Dataset Management
CortexOS is an AI-powered enterprise data platform designed to help teams monitor data pipelines, improve data quality, manage enterprise datasets, and surface AI-driven insights from a single workspace. Built with React, Node.js, Express, and PostgreSQL, the platform combines production-ready CRUD functionality with enterprise dashboard prototypes for modern data operations.

## Tech Stack

- Frontend: React 19, Vite, JavaScript, Recharts, Lucide React
- Backend: Node.js, Express.js
- Database: PostgreSQL
- Tools: Git, GitHub, VS Code, Figma

## Architecture

React (Frontend)

↓

Express REST API

↓

PostgreSQL Database

## Project Status

| Feature | Status |
|---|---|
| Dataset Management | Functional |
| Pipeline Monitoring | UI Prototype |
| Data Quality | UI Prototype |
| AI Copilot | UI Prototype |
 | Alerts | Functional (CRUD)|
| Users | UI Prototype

Settings | UI Prototype

Authentication | Planned|

## Current Features
### Dataset Management

(image)

### AI Copilot

(image)

### Users

(image)

### Settings

(image)
- **Dataset Management (fully functional):** Create, read, update, and delete datasets via a REST API backed by PostgreSQL.
- **Pipeline Monitoring: Interactive dashboard with pipeline status tracking, retry actions, trigger pipeline workflow, and execution log viewer.
- **Data Quality Dashboard: Enterprise dashboard for monitoring dataset quality scores, validation metrics, missing values, and failed quality checks.
- **AI Copilot: Conversational interface designed to answer questions about datasets, pipelines, alerts, and data quality using AI-powered workflows.
- **- **Alerts Management:** Manage enterprise alerts with severity levels, status tracking, edit, resolve, and delete workflows.
## Highlights

- Enterprise dashboard with 8 integrated modules

- Responsive modern UI

- RESTful API architecture

- PostgreSQL database integration

- Interactive prototype workflows

- AI Copilot interface

- Pipeline monitoring and execution logs

- Data Quality analytics
## Roadmap

See the [open issues](https://github.com/kamjula/cortex-enterprise/issues) for in-progress and planned work, including Alerts CRUD, User Management, a Settings page, Login/JWT authentication, Role-Based Access Control, deployment configuration, and improved loading/empty/error states.

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (running locally or remotely)

### Backend Setup
```bash
cd backend
npm install
```

Create a `backend/.env` file with the following variables:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=cortexos
```

Then run:
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Screenshots

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Data Quality

![Data Quality](screenshots/data-quality.png)

### Pipelines

![Pipelines](screenshots/pipelines.png)

### Alerts

![Alerts](screenshots/alerts.png)

## License

This repository is intended for portfolio and educational purposes only. Commercial use or redistribution without permission is not permitted.
