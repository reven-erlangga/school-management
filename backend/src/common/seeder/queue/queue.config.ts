import { QueueOptions } from 'bullmq';
import { ConfigService } from '@nestjs/config';

// BullModuleOptions is not exported directly, use QueueOptions for registerQueue
export const queueConfig = (configService: ConfigService): QueueOptions => ({
  connection: {
    host: configService.get<string>('REDIS_HOST', 'localhost'),
    port: configService.get<number>('REDIS_PORT', 6379),
    password: configService.get<string>('REDIS_PASSWORD'),
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: {
      age: 3600, // Keep for 1 hour
      count: 100, // Keep last 100 jobs
    },
    removeOnFail: {
      age: 24 * 3600, // Keep for 24 hours
    },
  },
});

export const SEEDER_QUEUE = 'seeder-queue';
export const SEED_JOB = 'seed-job';
