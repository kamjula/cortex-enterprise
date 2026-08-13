# CortexOS - Data Operations Platform

CortexOS is an in-development full-stack data operations project built with React, Node.js, Express, and PostgreSQL. It demonstrates dataset management, stored pipeline-status tracking, data-quality summaries, alert management, and an optional AI Copilot.

[Live demo](https://cortex-enterprise-sigma.vercel.app)

## Implemented features

- Dataset create, read, update, and delete operations backed by PostgreSQL
- Pipeline status display plus trigger/retry controls
- Data-quality score and validation-metric dashboards
- Alert create, update, resolve, and delete operations
- AI Copilot chat backed by OpenAI, with messages persisted in PostgreSQL
- Optional privacy-limited operational context
- Docker Compose setup for PostgreSQL, backend, and frontend

## AI Copilot privacy behavior

The Copilot works without operational context by default. Set `COPILOT_CONTEXT_ENABLED=true` only when you intentionally want to include a read-only aggregate snapshot in an OpenAI request.

When enabled, the snapshot contains only:

- dataset counts grouped by status
- pipeline counts grouped by status
- alert counts grouped by status and severity
- data-quality counts grouped by status
- average and minimum data-quality scores

It excludes dataset names and owners, pipeline names/sources/destinations, alert titles/messages, chat history, and individual database rows. SQL statements are fixed aggregate `SELECT` queries; neither prompts nor model output can generate SQL.

## Local setup with Docker

Requirements: Docker with Compose support.

```bash
export POSTGRES_PASSWORD='choose-a-local-password'
export OPENAI_API_KEY='your-key' # optional; required only for Copilot responses
docker compose up --build
```

Open the frontend at http://localhost:3000 and backend at http://localhost:5050.

Operational context remains disabled unless you explicitly set:

```bash
export COPILOT_CONTEXT_ENABLED=true
```

Do not commit real passwords or API keys. To stop the stack, run `docker compose down`. Add `-v` only when you intentionally want to delete the local PostgreSQL volume.

## Development commands

Backend:

```bash
cd backend
npm ci
npm test
npm start
```

Frontend:

```bash
cd frontend
npm ci
npm run lint
npm run build
```

## Important limitations

- Pipeline trigger and retry routes only update the stored status to `Running`. They do not execute a pipeline, job, worker, or orchestration engine.
- Displayed pipeline logs are generated from stored pipeline fields; they are not persisted execution logs.
- Authentication and role-based access control are not implemented; API routes are open.
- User Management and Settings remain UI prototypes.
- Operational context is aggregate-only and disabled by default.
- The project is not production-ready and has not been deployed, tested, or validated on IBM Z or LinuxONE.
