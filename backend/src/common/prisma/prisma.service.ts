import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly redisService: RedisService) {
    super();

    // Prisma 6 removed $use middleware support.
    // We use client extensions ($extends) to achieve the same caching invalidation logic.
    const extended = this.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            const result = await query(args);

            if (
              model &&
              [
                'create',
                'update',
                'delete',
                'deleteMany',
                'createMany',
                'updateMany',
                'upsert',
              ].includes(operation)
            ) {
              const modelName = model.toLowerCase();
              // Invalidate all cache keys for this model
              // Pattern: {model}:*
              redisService.reset(`${modelName}:*`);
            }

            return result;
          },
        },
      },
    });

    // Assign lifecycle hooks to the extended client so NestJS can call them
    Object.assign(extended, {
      onModuleInit: async () => {
        await this.$connect();
      },
      onModuleDestroy: async () => {
        await this.$disconnect();
      },
    });

    return extended as any;
  }

  // These methods are defined here to satisfy the interface and TypeScript,
  // but at runtime, the methods attached to the returned 'extended' object are used.
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
