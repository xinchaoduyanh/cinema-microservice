# API Gateway

The NestJS application in `apps/api-gateway` is the only public HTTP entry point. Kong is not used.

## Request flow

```text
Client -> API Gateway (:9080) -> verify JWT -> create trusted x-auth-user -> target service
```

1. The client sends `Authorization: Bearer <token>` to the gateway.
2. The gateway verifies the signature, algorithm, issuer, expiry, required claims, and token type.
3. It removes any client-provided `x-auth-user`, creates a trusted one from the verified JWT, adds forwarding/request-ID headers, then proxies the request.
4. The target service uses the trusted context and may load the latest user state (active status, role, email verification) from its own user source.

The login, sign-up, forgot-password, verification, and reset-password endpoints are public. `refresh-token` requires a valid refresh token; every other routed endpoint requires an access token.

## Routes

| Public prefix | Target |
| --- | --- |
| `/auth-service/*` | Auth service (`AUTH_SERVICE_BASE_URL` or port `3300`) |
| `/user-service/*` | User service (`3301`) |
| `/movie-service/*` | Movie service (`3302`) |
| `/notification-service/*` | Notification service (`3303`) |
| `/cinema-service/*` | Cinema service (`3304`) |
| `/booking-service/*` | Booking service (`3305`) |
| `/payment-service/*` | Payment service (`3306`) |

Example: `POST /auth-service/api/auth/login` is forwarded to `http://127.0.0.1:3300/api/auth/login` in local development.

## Configuration

Set `API_GATEWAY_APP_PORT` (default `9080`), `JWT_SECRET`, `JWT_ALGORITHM` (default `HS256`), and `JWT_ISSUER`. For containers or remote services, set each `*_SERVICE_BASE_URL`; otherwise the gateway uses the matching `*_SERVICE_APP_PORT`.
