# School Management System - RBAC Implementation

Sistem ini mengimplementasikan Role-Based Access Control (RBAC) yang komprehensif menggunakan NestJS dan Prisma ORM.

## Struktur RBAC

- **Module**: Entitas yang mewakili fitur atau bagian dari sistem (misal: `teacher`, `student`).
- **Permission**: Aksi spesifik dalam sebuah module (misal: `teacher.create`, `teacher.view`).
- **Role**: Kumpulan permission yang diberikan kepada user (misal: `admin`, `user`).
- **RolePermission**: Relasi many-to-many antara Role dan Permission.

## Prasyarat

- Node.js (v18+)
- PostgreSQL
- pnpm

## Setup

1. Install dependensi:
   ```bash
   pnpm install
   ```

2. Konfigurasi Environment:
   Update `.env` file dengan koneksi database Anda:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/school_management?schema=public"
   ```

3. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

4. Jalankan Migrasi:
   ```bash
   npx prisma migrate dev --name init_rbac
   ```

5. Jalankan Seeder (Opsional):
   ```bash
   pnpm run prisma:seed
   ```

## API Documentation

Setelah aplikasi berjalan, dokumentasi Swagger dapat diakses di:
`http://localhost:3001/api/docs`

## Penggunaan Authorization Guard (nestjs-rbac)

Gunakan decorator `@RBAcPermissions()` dan `RBAcGuard` dari library `nestjs-rbac`:

```typescript
import { UseGuards } from '@nestjs/common';
import { RBAcGuard, RBAcPermissions } from 'nestjs-rbac';

@UseGuards(RBAcGuard)
@RBAcPermissions('teacher@view')
@Get()
findAll() {
  return this.service.findAll();
}
```

Catatan: Guard mengharapkan `request.user.role` berisi nama role sebagai string.

## Menjalankan Test

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e
```
