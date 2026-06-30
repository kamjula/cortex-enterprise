# Tech Stack

## Cortex Enterprise - Technology Decisions

### Frontend
| Tech | Version | Purpose |
|------|---------|---------|
| React | 18.2.0 | UI Framework |
| TypeScript | 5.2.0 | Type Safety |
| Vite | 4.4.0 | Build Tool |
| Zustand | 4.4.0 | State Management |
| Axios | 1.5.0 | HTTP Client |
| React Router | 6.15.0 | Routing |

### Backend
| Tech | Version | Purpose |
|------|---------|---------|
| FastAPI | 0.104.0 | API Framework |
| Python | 3.11+ | Language |
| SQLAlchemy | 2.0.0 | ORM |
| Alembic | 1.12.0 | DB Migrations |
| Pydantic | 2.4.0 | Data Validation |
| PyJWT | 2.8.0 | Authentication |

### Data & Storage
| Tech | Version | Purpose |
|------|---------|---------|
| PostgreSQL | 15 | Primary Database |
| DuckDB | 0.8.0 | Analytics Engine |
| Great Expectations | 0.18.0 | Data Quality |
| Pandas | 2.0.0 | Data Processing |

### Infrastructure
| Tech | Version | Purpose |
|------|---------|---------|
| Docker | Latest | Containerization |
| Docker Compose | Latest | Local Dev |
| PgAdmin | Latest | DB Management |

### Why These Choices
- **FastAPI**: Fast, async, auto-docs (Swagger)
- **DuckDB**: In-process analytics, no extra server
- **PostgreSQL**: Reliable, feature-rich RDBMS
- **React + Vite**: Modern, fast dev experience
