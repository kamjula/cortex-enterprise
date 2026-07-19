# CortexOS — Enterprise Data Platform

[GitHub Repository](https://github.com/kamjula/cortex-enterprise) • Live Demo: Coming Soon

> Enterprise Data Operations Platform with AI-Assisted Workflows

**React • Node.js • Express • PostgreSQL**

Pipeline Monitoring • Data Quality • Dataset Management • Alerts • AI Copilot

CortexOS is a full-stack enterprise data platform designed to help teams monitor data pipelines, improve data quality, manage datasets, track alerts, and explore AI-assisted operational workflows from a single workspace.

Built with React, Node.js, Express, and PostgreSQL, the platform combines functional CRUD operations, REST APIs, pipeline execution workflows, data quality monitoring, and enterprise dashboard interfaces.

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

**Application Flow:** React Frontend → Express REST API → PostgreSQL Database

## Project Status

| Feature | Status |
|---|---|
| Dataset Management | Functional |
| Pipeline Monitoring | Functional |
| Data Quality | Functional |
| Alerts Management | Functional |
| AI Copilot | UI Prototype |
| User Management | UI Prototype |
| Settings | UI Prototype |
| Authentication | Planned |

## Current Features

- **Dataset Management:** Create, view, update, and delete datasets through a REST API backed by PostgreSQL.
- **Pipeline Monitoring:** Track pipeline status, trigger runs, retry failed executions, and review execution logs.
- **Data Quality Dashboard:** Monitor quality scores, validation metrics, missing values, failed checks, and dataset-level trends.
- **Alerts Management:** Create, view, update, resolve, and delete alerts with severity and status tracking.
- **AI Copilot:** Conversational interface prototype for exploring datasets, pipelines, alerts, and data quality information.
- **User Management:** Enterprise-style interface for viewing users, roles, and account status.
- **Settings:** Interface for notification, security, integration, and appearance preferences.

## Highlights

- Enterprise dashboard with 8 integrated modules
- Responsive modern user interface
- RESTful API architecture
- PostgreSQL database integration
- Dataset and alerts CRUD workflows
- Pipeline triggering, retry handling, and execution logs
- Data quality analytics and visualizations
- AI Copilot interface prototype
- Figma prototype and developer handoff documentation

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

See the [open issues](https://github.com/kamjula/cortex-enterprise/issues) for planned improvements:

- JWT authentication
- Role-based access control
- AI backend integration
- Deployment configuration
- Loading, empty, and error states
- Production monitoring
- Additional automated data quality checks

## Getting Started

### Prerequisites

- Node.js v18 or later
- PostgreSQL running locally or remotely
- npm

### Clone the Repository

```bash
git clone https://github.com/kamjula/cortex-enterprise.git
cd cortex-enterprise
