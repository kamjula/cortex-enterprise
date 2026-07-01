"""
Week 1 | Cortex Enterprise - Request Tracing Middleware
Structured JSON logging with correlation IDs on every request.
Interview Concept: Observability = Logs + Metrics + Traces. This is the Logs layer.
"""
import time
import uuid
import logging
import json
from typing import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

# ── Structured JSON Logger ───────────────────────────────────────────────────
class JSONFormatter(logging.Formatter):
    """Emit logs as JSON lines - parseable by Datadog, CloudWatch, ELK."""

    def format(self, record: logging.LogRecord) -> str:
        log_obj = {
            "timestamp": self.formatTime(record, "%Y-%m-%dT%H:%M:%S"),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        # Attach extra fields set by middleware
        for key in ("request_id", "method", "path", "status_code",
                    "duration_ms", "user_id", "ip"):
            if hasattr(record, key):
                log_obj[key] = getattr(record, key)

        if record.exc_info:
            log_obj["exception"] = self.formatException(record.exc_info)

        return json.dumps(log_obj)


def configure_logging(level: str = "INFO") -> None:
    """Call once at app startup to wire up JSON logging."""
    handler = logging.StreamHandler()
    handler.setFormatter(JSONFormatter())
    root = logging.getLogger()
    root.handlers = [handler]
    root.setLevel(getattr(logging, level.upper(), logging.INFO))


# ── Request Tracing Middleware ───────────────────────────────────────────────
logger = logging.getLogger("cortex.request")


class RequestTracingMiddleware(BaseHTTPMiddleware):
    """
    Injects X-Request-ID header on every response.
    Logs structured JSON: method, path, status, duration, user IP.

    Palantir/OpenAI interview question:
      'How would you trace a single request through 10 microservices?'
      Answer: propagate a correlation ID in HTTP headers + log it at every hop.
    """

    def __init__(self, app: ASGIApp, service_name: str = "cortex-api") -> None:
        super().__init__(app)
        self.service_name = service_name

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        start = time.perf_counter()

        # Attach request_id to request state so routes can access it
        request.state.request_id = request_id

        try:
            response: Response = await call_next(request)
        except Exception as exc:
            duration_ms = round((time.perf_counter() - start) * 1000, 2)
            logger.error(
                "Unhandled exception",
                extra={
                    "request_id": request_id,
                    "method": request.method,
                    "path": request.url.path,
                    "duration_ms": duration_ms,
                    "ip": request.client.host if request.client else "unknown",
                },
                exc_info=exc,
            )
            raise

        duration_ms = round((time.perf_counter() - start) * 1000, 2)
        logger.info(
            f"{request.method} {request.url.path} {response.status_code}",
            extra={
                "request_id": request_id,
                "method": request.method,
                "path": request.url.path,
                "status_code": response.status_code,
                "duration_ms": duration_ms,
                "ip": request.client.host if request.client else "unknown",
            },
        )

        response.headers["X-Request-ID"] = request_id
        response.headers["X-Service"] = self.service_name
        return response
