"""
Week 1 | Cortex Enterprise - pytest configuration
Shared fixtures and test settings for all test modules.
"""
import pytest
from fastapi.testclient import TestClient

from backend.app.main import app


@pytest.fixture(scope="session")
def test_client():
    """Session-scoped test client - reused across all tests for speed."""
    with TestClient(app) as c:
        yield c


@pytest.fixture(autouse=True)
def reset_user_store():
    """
    Clear the in-memory user store before each test to prevent state leakage.
    Week 2: This goes away when we switch to a test PostgreSQL DB.
    """
    from backend.app.auth.router import _USERS
    _USERS.clear()
    yield
    _USERS.clear()
