# Backend base conventions

## Pagination

Use `PaginationQueryDto` for every list endpoint. It safely converts HTTP query strings to numbers and enforces `page >= 1` and `1 <= pageSize <= 100`.

```ts
@Get()
findAll(@Query() query: PaginationQueryDto) {
  return this.movieService.findAll(query);
}
```

Repositories return `{ data, pagination }`, where `pagination` always includes `page`, `pageSize`, `total`, and `totalPages`. For services that do not use the existing MikroORM repository base, use `createPaginationResponse(data, total, query)`.

## Redis read-through cache

Inject `RedisService` and call `remember`. The caller supplies only the cache key, expiry, and the database/API function to run on a miss.

```ts
return this.redisService.remember({
  key: `movie:list:page=${query.page}:size=${query.pageSize}`,
  ttlSeconds: 60,
  loader: () => this.movieRepository.paginate(query),
});
```

After a write, invalidate the affected key with `redisService.forget(key)`. Use predictable namespaced keys such as `movie:detail:<id>` and `movie:list:<filters>`.

## Recommended next base modules

1. **Base repository** — move the duplicated `BaseRepository` in each service into `libs/core`, then add filtering and safe sort-field allowlists.
2. **Cache invalidation helper** — tag list/detail keys per resource so writes invalidate all affected pages without `KEYS` scans.
3. **Audit context** — propagate `x-request-id` and authenticated user ID to logs and entity audit fields.
4. **Idempotency module** — Redis-backed idempotency keys for booking and payment mutations.
5. **Rate-limit module** — Redis counters at the gateway, with stricter rules for login and password recovery.
