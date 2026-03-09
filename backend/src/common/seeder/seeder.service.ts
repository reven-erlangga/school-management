import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { SEEDER_QUEUE, SEED_JOB } from './queue/queue.config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(@InjectQueue(SEEDER_QUEUE) private seederQueue: Queue) {}

  /**
   * Trigger a new seeder job
   * @param type Type of seed to run (e.g., 'users', 'settings', 'all')
   * @returns Job ID
   */
  async runSeeder(type: string = 'all'): Promise<{ jobId: string; message: string }> {
    const jobId = uuidv4();
    const job = await this.seederQueue.add(
      SEED_JOB, 
      {
        type,
        timestamp: new Date().toISOString(),
      },
      {
        jobId: jobId, // Explicitly set custom UUID
      }
    );

    this.logger.log(`Seeder job triggered: ${job.id} (Type: ${type})`);

    return {
      jobId: job.id || jobId,
      message: `Seeder job started for type: ${type}`,
    };
  }

  /**
   * Get job status and progress
   */
  async getJobStatus(jobId: string) {
    const job = await this.seederQueue.getJob(jobId);
    if (!job) {
      return null;
    }

    const state = await job.getState();
    const progress = job.progress;
    
    return {
      id: job.id,
      state,
      progress,
      result: job.returnvalue,
      failedReason: job.failedReason,
    };
  }
}
