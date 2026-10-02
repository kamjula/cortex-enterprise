# CortexOS — Recruiter Overview

CortexOS is a full-stack enterprise data operations project built to demonstrate applied data engineering, backend/API design, operational analytics, secure application development, and AI integration in one coherent system.

## What it demonstrates

- **Data operations:** dataset inventory, pipeline monitoring and actions, data-quality metrics, and alert lifecycle management.
- **Applied AI:** an AI Copilot with a deliberate aggregate-only operational context boundary rather than unrestricted database access.
- **Backend engineering:** Express APIs backed by PostgreSQL with validation and explicit error handling.
- **Security engineering:** bcrypt credentials, JWT access/refresh flow, hashed and rotated refresh sessions, logout revocation, and active-user checks on protected APIs.
- **Frontend engineering:** React/Vite operational UI with loading, empty, error, authentication, and session-expiration states.
- **Delivery discipline:** Docker configuration, automated tests, production frontend builds, and pull-request CI.

## Architecture at a glance

React/Vite -> Node.js/Express -> PostgreSQL, with server-side AI provider integration. Authentication and authorization remain backend responsibilities; client-side controls are treated only as user experience.

## Engineering decisions worth discussing in an interview

CortexOS uses a modular monolith rather than artificial microservices. Refresh tokens are hashed at rest and rotated. Active-user status is checked server-side so deactivation is effective before access-token expiry. Copilot context is opt-in and intentionally constrained. CI makes tests, lint, and build health independently visible.

## Scope honesty

CortexOS is a portfolio system, not a claim of audited enterprise compliance or hyperscale production traffic. The repository documents both implemented controls and production hardening that would be appropriate at larger scale.
