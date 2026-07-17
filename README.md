# CortexOS — Enterprise Data Platform

> Enterprise AI Data Platform

**React • Node.js • Express • PostgreSQL**

Pipeline Monitoring • Data Quality • AI Copilot • Dataset Management

CortexOS is an AI-powered...

## Tech Stack

- Frontend: React 19, Vite, JavaScript, Recharts, Lucide React
- Backend: Node.js, Express.js
- Database: PostgreSQL
- Tools: Git, GitHub, VS Code, Figma

## Architecture

React (Frontend)
        │
        ▼
Express REST API
        │
        ▼
PostgreSQL Database

## Project Status
| Feature | Status |
|---|---|
| Dataset Management | Functional |
| Pipeline Monitoring | UI Prototype |
| Data Quality | UI Prototype |
| AI Copilot | UI Prototype |
| Alerts | Functional (CRUD) |
| Users | UI Prototype |
| Settings | UI Prototype |
| Authentication | Planned |

## Current Features

- **Dataset Management (fully functional):** Create, read, update, and delete datasets via a REST API backed by PostgreSQL.
- **Pipeline Monitoring:** Interactive dashboard with pipeline status tracking, retry actions, trigger pipeline workflow, and execution log viewer.
- **Data Quality Dashboard:** Enterprise dashboard for monitoring dataset quality scores, validation metrics, missing values, and failed quality checks.
- **AI Copilot:** Conversational interface designed to answer questions about datasets, pipelines, alerts, and data quality using AI-powered workflows.
- **Alerts Management:** Manage enterprise alerts with severity levels, status tracking, edit, resolve, and delete workflows.

- Enterprise dashboard with 8 integrated modules

- Responsive modern UI

- RESTful API architecture

- PostgreSQL database integration

- Interactive prototype workflows

- AI Copilot interface

- Pipeline monitoring and execution logs

- Data Quality analytics
## Roadmap

See the [open issues](https://github.com/kamjula/cortex-enterprise/issues) for upcoming enhancements, including JWT authentication, role-based access control (RBAC), AI backend integration, deployment, and production-ready monitoring improvements.

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
### Dataset Management

![Dataset Management](screenshots/datasets.png)

### AI Copilot

![AI Copilot](screenshots/ai-copilot.png)

### Users

![Users](screenshots/users.png)

### Settings

![Settings](screenshots/settings.png)

## License

This repository is intended for portfolio and educational purposes only. Commercial use or redistribution without permission is not permitted.
