"""
Week 1 | Cortex Enterprise - Production FastAPI App
Wires together: auth router, request tracing, CORS, versioned API.
Interview Concept: Dependency injection, lifespan events, middleware ordering matters.
"""
import logging
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .api.middleware import RequestTracingMiddleware, configure_logging
from .auth.router import router as auth_router

load_dotenv()

logger = logging.getLogger("cortex.app")


# ── Lifespan (startup / shutdown) ────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Async context manager replacing deprecated @app.on_event handlers."""
    configure_logging(level=os.getenv("LOG_LEVEL", "INFO"))
    logger.info("Cortex Enterprise API starting", extra={"env": os.getenv("ENV", "dev")})
    yield
    logger.info("Cortex Enterprise API shutting down")


# ── App factory ──────────────────────────────────────────────────────────────
def create_app() -> FastAPI:
    app = FastAPI(
        title="Cortex Enterprise API",
        description=(
            "Distributed enterprise platform - Week 1: Auth + Observability. "
            "Built for FDE roles at Palantir / OpenAI / Scale AI."
        ),
        version="0.1.0",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
        lifespan=lifespan,
    )

    # ── Middleware (order matters: outer-most runs first on request) ──────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(RequestTracingMiddleware, service_name="cortex-api")

    # ── Routers ───────────────────────────────────────────────────────────────
    app.include_router(auth_router, prefix="/api/v1")

    # ── Core routes ───────────────────────────────────────────────────────────
    @app.get("/health", tags=["infra"])
    async def health():
        return {
            "status": "healthy",
            "service": "cortex-enterprise",
            "version": "0.1.0",
            "week": 1,
        }

    @app.get("/api/v1", tags=["infra"])
    async def api_info():
        return {
            "name": "Cortex Enterprise",
            "version": "0.1.0",
            "phase": "Week 1: Systems Foundation",
            "capabilities": ["jwt-auth", "request-tracing", "versioned-api"],
        }

    # ── Global exception handler ──────────────────────────────────────────────
    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request, exc):
        logger.error("Unhandled error", exc_info=exc)
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "type": type(exc).__name__},
        )

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.app.main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=os.getenv("ENV", "dev") == "dev",
        log_config=None,  # Disable uvicorn's default logging; use our JSON logger
    )
