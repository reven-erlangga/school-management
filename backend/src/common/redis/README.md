# Redis Cache Module

This module provides a reusable Redis cache service and integrates with the Query Builder for automatic caching.

## Features

- **Redis Service**: `set`, `get`, `delete`, `exists` with JSON serialization.
- **Query Builder Integration**: Cache database queries easily using `useCache()`.
- **Automatic Invalidation**: Automatically invalidates cache on `create`, `update`, `delete` operations via Prisma Middleware.
- **Robust Connection**: Uses `ioredis` with connection pooling and retry strategies.

## Setup

Ensure your `docker-compose.yaml` has a Redis service and `.env` (or environment variables) are set:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
# REDIS_PASSWORD=secret (optional)
```

## Usage

### 1. Using Redis Service Directly

Inject `RedisService` anywhere in your application:

```typescript
import { RedisService } from 'src/common/redis/redis.service';

constructor(private readonly redisService: RedisService) {}

async someMethod() {
  await this.redisService.set('my-key', { data: 123 }, 300); // TTL 300s
  const value = await this.redisService.get('my-key');
}
```

### 2. Caching Queries with Query Builder

The `QueryBuilderService` now supports caching via the `useCache(ttl?)` method.

```typescript
// In your controller or service
const users = await this.queryBuilder
  .using('User', queryParams)
  .allowedFilters(['name', 'email'])
  .useCache(600) // Cache for 10 minutes (default 5 mins)
  .execute();
```

The cache key is automatically generated based on:
- Model name
- Pagination (page, limit)
- Filters, Sorts, Includes, and Fields (hashed)

**Format:** `{model}:paginate:{page}:{limit}:{hash}`

### 3. Automatic Invalidation

The `PrismaService` is configured with middleware that intercepts write operations (`create`, `update`, `delete`, `upsert`, etc.).

When a write operation occurs on a model (e.g., `User`), **ALL** cache keys starting with `user:*` are invalidated.

## Testing

Run unit tests:

```bash
npm test src/common/redis/redis.service.spec.ts
```
