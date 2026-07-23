# Backend Foundation Roadmap

This roadmap defines the platform work to complete before expanding complex booking, payment, and microservice workflows.

## P0 - Complete first

### 1. Prevent privilege escalation

Public sign-up must always create a `GUEST` account. Only an authenticated `ADMIN` may create or assign `ADMIN` and `RECEPTIONIST` roles.

### 2. Health and readiness

Every service must expose health and readiness endpoints. Readiness checks must verify dependencies such as the database, Redis, and Kafka. The gateway should route only to ready services.

### 3. Configuration safety

Validate every environment variable during startup. Separate local, staging, and production settings, and never retain usable secrets or production defaults in example environment files.

### 4. End-to-end observability

Propagate the gateway `x-request-id` through HTTP calls, Kafka events, logs, and error responses. Redact passwords, tokens, and sensitive payment data from logs.

### 5. Foundation tests

Add automated tests for JWT validation, response envelopes, exception handling, role/permission/ownership/email-verification guards, rate limiting, and gateway proxying.

## P1 - Complete before critical workflows scale

### 6. API contracts and versioning

Adopt versioned routes such as `/api/v1`. Swagger must document the standard `{ code, message, data }` envelope and error responses.

### 7. Service resilience

Standardize timeouts, bounded retries, and circuit breaking for service-to-service calls. Booking and payment calls must never retry blindly.

### 8. Transactions and outbox

Use an outbox pattern when a database write must publish an event. This prevents inconsistent states where a record is saved but its Kafka event is lost.

### 9. Redis scalability

Replace Redis `KEYS` pattern deletion with `SCAN` or cache-tag invalidation to avoid blocking Redis at scale.

### 10. Internal service boundary

In production, expose only the API Gateway publicly. Apply CORS allowlists, request-size limits, refresh-token rotation, and a clear token-revocation policy.

## P2 - Operational maturity

### 11. Safe list querying

Complete pagination with filter and sort allowlists. Never accept arbitrary database field names from query parameters.

### 12. Audit trail

Record sensitive actions with actor ID, request ID, timestamp, and before/after state. This is required for role changes, refunds, and destructive admin actions.

### 13. Background jobs

Move email, notification, and retryable work into queues with retry policy and dead-letter handling instead of executing them inside HTTP requests.

## Recommended order

Complete P0 items 1, 2, 4, and 5 first. Then implement P1 items 6, 7, and 8 before expanding payment and booking workflows.
