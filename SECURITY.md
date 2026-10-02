# CortexOS Security

CortexOS is a portfolio-grade enterprise data operations platform. Security controls are implemented to demonstrate production-minded engineering without claiming formal compliance certification.

## Implemented controls

- JWT access tokens use HS256 and require server-side secrets of at least 32 characters.
- Refresh tokens are rotated and stored only as SHA-256 hashes in PostgreSQL.
- Protected API requests validate both the JWT and the current active user record.
- Deactivated users are denied access even when they still hold an unexpired access token.
- Authentication secrets, database credentials, and AI provider keys belong in server-side environment variables and must never be committed.
- AI Copilot operational context is opt-in and aggregate-only when enabled.
- CI validates backend tests and the frontend lint/production build on pull requests and main-branch pushes.

## Threat boundaries

The browser is treated as untrusted. Authorization decisions must be enforced by the backend; UI visibility is not a security boundary. PostgreSQL is the source of truth for user activation and refresh-session state.

## Demo limitations

This repository demonstrates security-conscious application design; it is not represented as SOC 2, HIPAA, PCI DSS, or other formally audited/certified software. Production deployments should additionally use managed secret storage, TLS-only database connections, strict origin allowlists, centralized observability, rate limiting, dependency scanning, and provider-specific infrastructure controls.

## Reporting a vulnerability

Please avoid opening a public issue containing credentials, tokens, personal data, or exploit details. Revoke or rotate any credential that may have been exposed before continuing investigation.
