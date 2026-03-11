import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { SEEDER_QUEUE, SEED_JOB } from './queue/queue.config';
import { SeederKeyService } from '../utils/seeder/seeder-key.service';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectQueue(SEEDER_QUEUE) private seederQueue: Queue,
    private readonly seederKeyService: SeederKeyService,
  ) {}

  /**
   * Trigger a new seeder job
   * @returns Job ID
   */
  async run(): Promise<{ key: string; message: string }> {
    const type = 'all';
    const key = await this.seederKeyService.generateUniqueKey();
    await this.seederQueue.add(
      SEED_JOB,
      {
        type,
        timestamp: new Date().toISOString(),
      },
      {
        jobId: key,
      },
    );

    this.logger.log(`Seeder job triggered: ${key} (Type: ${type})`);

    return {
      key,
      message: `Seeder job started for type - ${type}`,
    };
  }

  /**
   * Get job status and progress
   */
  async checkStatus(key: string): Promise<{
    key: string;
    state: string;
    progress: unknown;
    result: unknown;
    failedReason: string | null;
  } | null> {
    const job = await this.seederQueue.getJob(key);
    if (!job) {
      return null;
    }

    const state = await job.getState();
    const progress = job.progress;

    return {
      key,
      state,
      progress,
      result: job.returnvalue,
      failedReason: job.failedReason,
    };
  }
}
