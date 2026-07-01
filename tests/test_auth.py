"""
Week 1 | Cortex Enterprise - Auth Test Suite
pytest + FastAPI TestClient: covers register, login, token refresh, /me, edge cases.
Interview Concept: Why you test edge cases not just happy paths. Fail fast.
"""
import pytest
from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


# ── Fixtures ─────────────────────────────────────────────────────────────────
@pytest.fixture
def registered_user():
    """Register a user and return credentials + tokens."""
    payload = {
        "email": "test@cortex.io",
        "password": "Secure123!",
        "full_name": "Cortex Tester",
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    return {"credentials": payload, "tokens": response.json()}


# ── Health check ──────────────────────────────────────────────────────────────
def test_health_returns_200():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data


def test_health_includes_request_id_header():
    response = client.get("/health")
    assert "x-request-id" in response.headers


# ── Register ──────────────────────────────────────────────────────────────────
def test_register_success():
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "newuser@cortex.io",
            "password": "StrongPass1!",
            "full_name": "New User",
        },
    )
    assert response.status_code == 201
    body = response.json()
    assert "access_token" in body
    assert "refresh_token" in body
    assert body["token_type"] == "bearer"


def test_register_duplicate_email(registered_user):
    response = client.post(
        "/api/v1/auth/register",
        json=registered_user["credentials"],
    )
    assert response.status_code == 409
    assert "already registered" in response.json()["detail"]


def test_register_invalid_email():
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "not-an-email", "password": "pass", "full_name": "X"},
    )
    assert response.status_code == 422  # pydantic validation error


# ── Login ─────────────────────────────────────────────────────────────────────
def test_login_success(registered_user):
    creds = registered_user["credentials"]
    response = client.post(
        "/api/v1/auth/login",
        json={"email": creds["email"], "password": creds["password"]},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_wrong_password(registered_user):
    creds = registered_user["credentials"]
    response = client.post(
        "/api/v1/auth/login",
        json={"email": creds["email"], "password": "WrongPassword!"},
    )
    assert response.status_code == 401


def test_login_unknown_email():
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "ghost@cortex.io", "password": "anything"},
    )
    assert response.status_code == 401


# ── Token Refresh ─────────────────────────────────────────────────────────────
def test_refresh_returns_new_tokens(registered_user):
    old_access = registered_user["tokens"]["access_token"]
    refresh = registered_user["tokens"]["refresh_token"]
    response = client.post("/api/v1/auth/refresh", json={"refresh_token": refresh})
    assert response.status_code == 200
    new_tokens = response.json()
    assert "access_token" in new_tokens
    # New access token should be different (different jti)
    assert new_tokens["access_token"] != old_access


def test_refresh_with_access_token_fails(registered_user):
    """Passing access token as refresh token must fail - type check."""
    access = registered_user["tokens"]["access_token"]
    response = client.post("/api/v1/auth/refresh", json={"refresh_token": access})
    assert response.status_code == 401


def test_refresh_with_garbage_token():
    response = client.post("/api/v1/auth/refresh", json={"refresh_token": "garbage"})
    assert response.status_code == 401


# ── /me ───────────────────────────────────────────────────────────────────────
def test_me_returns_user_profile(registered_user):
    token = registered_user["tokens"]["access_token"]
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == registered_user["credentials"]["email"]
    assert data["full_name"] == registered_user["credentials"]["full_name"]


def test_me_without_token_returns_403():
    response = client.get("/api/v1/auth/me")
    assert response.status_code in (401, 403)


def test_me_with_invalid_token():
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": "Bearer this.is.invalid"},
    )
    assert response.status_code == 401
