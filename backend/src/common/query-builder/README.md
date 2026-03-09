# Query Builder

A database-agnostic Query Builder that wraps Prisma Client to provide a consistent, fluent interface for database operations. It supports dynamic queries, cursor pagination, and standard CRUD operations.

## Features

- **Database Agnostic**: Works with PostgreSQL, MySQL, SQLite via Prisma.
- **Dynamic Queries**: Build complex `where` clauses dynamically.
- **Cursor Pagination**: Efficiently stream large datasets.
- **Optimized**: Parameterized queries and selective column retrieval.
- **Error Handling**: Standardized error codes (e.g., `DUPLICATE_ENTRY`, `RECORD_NOT_FOUND`).

## Installation

The Query Builder is part of the `QueryBuilderModule`. Import it into your module:

```typescript
import { QueryBuilderModule } from 'src/common/query-builder/query-builder.module';

@Module({
  imports: [QueryBuilderModule],
  // ...
})
export class YourModule {}
```

## Usage

Inject `QueryBuilder` into your service:

```typescript
import { QueryBuilder } from 'src/common/query-builder/QueryBuilder';

constructor(private readonly qb: QueryBuilder) {}
```

### 1. Find (Dynamic Search)

```typescript
const users = await this.qb.find({
  table: 'user',
  where: { role: 'ADMIN', active: true },
  select: ['id', 'email', 'name'],
  orderBy: { createdAt: 'desc' },
  limit: 10,
  offset: 0,
});
```

### 2. Cursor Pagination (Streaming)

```typescript
const iterator = this.qb.cursor({
  table: 'transaction',
  where: { status: 'COMPLETED' },
  batchSize: 500,
});

for await (const batch of iterator) {
  // Process 500 records at a time
  await this.processBatch(batch);
}
```

### 3. Create

```typescript
// Single
const user = await this.qb.create({
  table: 'user',
  data: { email: 'test@example.com', name: 'Test' },
});

// Batch
const count = await this.qb.create({
  table: 'user',
  data: [
    { email: 'a@example.com' },
    { email: 'b@example.com' },
  ],
});
```

### 4. Read (Single Record)

```typescript
const user = await this.qb.read({
  table: 'user',
  where: { id: 1 },
});
```

### 5. Update

```typescript
const result = await this.qb.update({
  table: 'user',
  where: { id: 1 },
  data: { name: 'New Name' },
});

// Soft Delete
await this.qb.update({
  table: 'user',
  where: { id: 1 },
  data: {}, 
  useSoftDelete: true, // Sets deletedAt = now()
});
```

### 6. Delete

```typescript
await this.qb.delete({
  table: 'user',
  where: { id: 1 },
});
```

### 7. Upsert (Create or Update)

```typescript
const setting = await this.qb.createOrUpdate({
  table: 'setting',
  where: { key: 'site_name' }, // Unique constraint
  data: { key: 'site_name', value: 'My School' },
});
```

## Error Handling

Catch `QueryBuilderError` for specific handling:

```typescript
import { QueryBuilderError, ErrorCodes } from 'src/common/query-builder/errors';

try {
  await this.qb.create({ ... });
} catch (error) {
  if (error instanceof QueryBuilderError) {
    if (error.code === ErrorCodes.DUPLICATE_ENTRY) {
      // Handle duplicate
    }
  }
}
```
