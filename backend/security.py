import os
import hmac
import hashlib
import time
import re
import html
from typing import Callable
from fastapi import Request, Response, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

SECRET_KEY = os.environ.get("DEVPULSE_SECRET_KEY")
if not SECRET_KEY:
    if os.environ.get("APP_ENV") == "production":
        raise RuntimeError("CRITICAL SECURITY ERROR: DEVPULSE_SECRET_KEY must be set in production.")
    SECRET_KEY = "devpulse-development-only-fallback-key"

MAX_REQUESTS_PER_MINUTE = 60
request_counts = {}
last_cleanup_min = 0

def sanitize_input(text: str) -> str:
    """Sanitize user input against HTML, XSS, and control character injection."""
    if not text:
        return ""
    # Escape HTML entities instead of naive regex tag stripping
    clean = html.escape(text)
    clean = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', clean)
    return clean.strip()[:200]

def verify_client_signature(timestamp: str, signature: str, body: str = "") -> bool:
    """Verify HMAC SHA-256 signature to prevent API tampering and unauthorized scraping."""
    try:
        ts = int(timestamp)
        # Reject requests older than 5 minutes
        if abs(time.time() - ts) > 300:
            return False
        expected_msg = f"{timestamp}:{body}".encode('utf-8')
        expected_sig = hmac.new(SECRET_KEY.encode('utf-8'), expected_msg, hashlib.sha256).hexdigest()
        return hmac.compare_digest(expected_sig, signature)
    except Exception:
        return False

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Enforce strict production HTTP security headers."""
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        response = await call_next(request)
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response

class RateLimitMiddleware(BaseHTTPMiddleware):
    """Token bucket / sliding window rate limiting."""
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        global last_cleanup_min
        
        # Resolve client IP behind reverse proxies
        forwarded = request.headers.get("x-forwarded-for")
        client_ip = forwarded.split(",")[0].strip() if forwarded else (request.client.host if request.client else "127.0.0.1")
        
        current_min = int(time.time() // 60)
        key = f"{client_ip}:{current_min}"
        
        count = request_counts.get(key, 0)
        if count >= MAX_REQUESTS_PER_MINUTE:
            return JSONResponse(
                status_code=429,
                content={"detail": "Rate limit exceeded. Too many requests per minute."}
            )
        request_counts[key] = count + 1
        
        # Cleanup old minutes only when the minute rolls over to avoid CPU bottlenecks
        if current_min != last_cleanup_min:
            last_cleanup_min = current_min
            for k in list(request_counts.keys()):
                if int(k.split(":")[1]) < current_min - 2:
                    del request_counts[k]
                    
        return await call_next(request)

class SignatureVerificationMiddleware(BaseHTTPMiddleware):
    """Enforce HMAC signature validation on all incoming API requests."""
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        path = request.url.path
        # Exclude documentation, schemas, health checks, and static files from signature checks
        if not path.startswith("/api") or path in [
            "/api/docs",
            "/api/redoc",
            "/openapi.json",
            "/api/openapi.json",
            "/api/health",
            "/api/v1/health"
        ]:
            return await call_next(request)
            
        timestamp = request.headers.get("x-timestamp")
        signature = request.headers.get("x-signature")
        
        if not timestamp or not signature:
            return JSONResponse(
                status_code=401,
                content={"detail": "Missing cryptographic signature headers (x-timestamp, x-signature)."}
            )
        
        # GET requests have no body; for others, read body and cache it
        body = ""
        if request.method != "GET":
            body_bytes = await request.body()
            body = body_bytes.decode('utf-8', errors='ignore')
            async def receive():
                return {"type": "http.request", "body": body_bytes, "more_body": False}
            request._receive = receive

        if not verify_client_signature(timestamp, signature, body):
            return JSONResponse(
                status_code=401,
                content={"detail": "Invalid or expired cryptographic signature."}
            )
            
        return await call_next(request)
