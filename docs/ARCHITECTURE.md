# CortexOS Architecture

## Purpose

CortexOS is an enterprise data operations platform that brings operational datasets, pipeline state, data-quality signals, alerts, and an AI-assisted investigation experience into one application.

## System design

```text
React / Vite UI
      |
      | HTTPS + Bearer access token
      v
Node.js / Express API
      |
      +---- Authentication + active-user validation
      |
      +---- Dataset / Pipeline / Quality / Alert services
      |
      +---- AI Copilot context composer ----> AI provider API
      |
      v
PostgreSQL
  - operational data
  - users
  - hashed refresh sessions
  - Copilot conversation history
```

## Authentication lifecycle

1. A user signs in with email and password.
2. The backend verifies the bcrypt password hash and active-user state.
3. The backend issues a short-lived access token and a longer-lived refresh token.
4. Only a SHA-256 hash of the refresh token is persisted.
5. Protected requests carry the access token in the Authorization header.
6. The API verifies the JWT and re-checks that the user is still active.
7. Refresh rotates the stored session: the old refresh token is revoked and a new pair is issued.
8. Logout revokes the refresh session.

## AI context boundary

Copilot context is disabled by default. When explicitly enabled, the context composer provides aggregate operational information rather than unrestricted database rows. This design keeps the AI integration useful while making the data boundary explicit and testable.

## Reliability and validation

Backend behavior is covered with Node's built-in test runner. The frontend has lint and production-build checks. GitHub Actions runs these checks for pull requests and pushes to main so repository quality is visible rather than dependent on local claims.

## Design choices

CortexOS intentionally remains a modular monolith. For the current workload and portfolio scope, a React client, Express API, and PostgreSQL database provide clearer ownership and lower operational complexity than adding message brokers, Kubernetes, or microservices without a demonstrated requirement.
