# Guard base

Available endpoint decorators:

- `@Permissions(Permission.MOVIE_CREATE)`: requires a permission mapped from the authenticated role.
- `@OwnerParam('userId')`: requires the `userId` route parameter to equal the authenticated user ID. `ADMIN` bypasses this check.
- `@RequireVerifiedEmail()`: requires `user.emailVerified === true`.

The gateway applies Redis-backed rate limiting: 10 requests/minute for Auth routes and 120 requests/minute for other service routes, keyed by client IP and service. If Redis is unavailable, the limiter fails open so authentication traffic is not accidentally blocked by cache infrastructure failure.

## Deferred guards

`TODO`: Implement an idempotency-key guard when booking/payment request contracts have stable idempotency keys and persistence semantics.

`TODO`: Implement a resource-state guard when the booking/payment state-transition rules are finalized. Do not enable either guard before those contracts are defined.
