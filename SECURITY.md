# Security & Anti-Tamper Policy - DevPulse Engine

## Security Controls & Policies
DevPulse implements multi-layered enterprise defense mechanisms:

1. **Input Sanitization & Injection Defense**:
   - All search queries and URL parameters undergo strict regex sanitization stripping control characters and HTML tags.

2. **Rate Limiting & Anti-Scraping**:
   - Sliding-window rate limiters prevent API abuse (maximum 60 requests per minute per IP).

3. **HTTP Hardening**:
   - Content Security Policy (CSP), HTTP Strict Transport Security (HSTS), X-Frame-Options (`DENY`), and X-Content-Type-Options (`nosniff`).

4. **Cryptographic Payload Verification**:
   - Request signature validation via HMAC SHA-256 prevents request tampering and playback attacks.

## Vulnerability Reporting
Please report security vulnerabilities directly to `security@devpulse.app`.
