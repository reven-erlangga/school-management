import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { SEEDER_QUEUE } from '../../seeder/queue/queue.config';

@Injectable()
export class SeederKeyService {
  private counter = 0;

  constructor(@InjectQueue(SEEDER_QUEUE) private seederQueue: Queue) {}

  async generateUniqueKey(): Promise<string> {
    for (let i = 0; i < 100; i++) {
      const timestampPart = Date.now()
        .toString(36)
        .replace(/[^a-z0-9]/gi, '')
        .slice(-6)
        .padStart(6, '0');

      this.counter = (this.counter + 1) % (36 * 36);
      const counterPart = this.counter.toString(36).padStart(2, '0');

      const key = `${timestampPart}${counterPart}`.toLowerCase();
      const existing = await this.seederQueue.getJob(key);
      if (!existing) return key;
    }

    throw new Error('Failed to generate unique seeder key');
  }
}
