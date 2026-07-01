"""
Week 1 | Cortex Enterprise - Auth Router
FastAPI router: login, refresh, logout, /me endpoints.
Interview Concept: Why we separate auth logic from routes (Single Responsibility).
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr

from .jwt import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    get_current_user,
)

router = APIRouter(prefix="/auth", tags=["authentication"])

# ── In-memory user store (replaced by PostgreSQL in Week 2) ─────────────────
_USERS: dict[str, dict] = {}


# ── Schemas ──────────────────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    user_id: str
    email: str
    full_name: str


# ── Routes ───────────────────────────────────────────────────────────────────
@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(payload: RegisterRequest):
    """Register a new user and return JWT tokens."""
    if payload.email in _USERS:
        raise HTTPException(status_code=409, detail="Email already registered")

    user_id = payload.email  # use email as user_id for now
    _USERS[payload.email] = {
        "user_id": user_id,
        "email": payload.email,
        "full_name": payload.full_name,
        "hashed_password": hash_password(payload.password),
    }
    return TokenResponse(
        access_token=create_access_token(user_id),
        refresh_token=create_refresh_token(user_id),
    )


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest):
    """Authenticate user and return JWT tokens."""
    user = _USERS.get(payload.email)
    if not user or not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    return TokenResponse(
        access_token=create_access_token(user["user_id"]),
        refresh_token=create_refresh_token(user["user_id"]),
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh(payload: RefreshRequest):
    """Exchange a valid refresh token for new access + refresh tokens."""
    token_data = decode_refresh_token(payload.refresh_token)
    subject = token_data["sub"]
    return TokenResponse(
        access_token=create_access_token(subject),
        refresh_token=create_refresh_token(subject),
    )


@router.get("/me", response_model=UserResponse)
async def me(current_user: dict = Depends(get_current_user)):
    """Return the authenticated user's profile."""
    user = _USERS.get(current_user["user_id"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(
        user_id=user["user_id"],
        email=user["email"],
        full_name=user["full_name"],
    )


@router.post("/logout", status_code=204)
async def logout(current_user: dict = Depends(get_current_user)):
    """
    Logout endpoint (stateless JWT - token invalidation via blacklist in Week 2).
    For now: client deletes token. Redis blacklist added in Week 2.
    """
    return None
