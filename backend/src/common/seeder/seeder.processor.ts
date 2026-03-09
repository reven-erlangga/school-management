import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { SEEDER_QUEUE, SEED_JOB } from './queue/queue.config';
import { spawn } from 'child_process';
import * as path from 'path';

@Processor(SEEDER_QUEUE)
export class SeederProcessor extends WorkerHost {
  private readonly logger = new Logger(SeederProcessor.name);

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);
    
    await job.updateProgress(0);

    const { type } = job.data;

    try {
      // Simulate steps or run actual logic
      if (type === 'cli-demo') {
        return await this.runCliCommand(job);
      } else if (type === 'users') {
        // Specific single seeder
        return await this.runSeederTask(job, 'users');
      } else {
        // Default: Run sequence of seeders
        return await this.runSeederSequence(job);
      }
    } catch (error) {
      this.logger.error(`Job ${job.id} failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Run a sequence of seeders (users, settings, academic-years, etc.)
   */
  private async runSeederSequence(job: Job): Promise<string> {
    const seeders = ['users', 'settings', 'academic-years', 'classes', 'subjects'];
    const totalSeeders = seeders.length;

    for (let i = 0; i < totalSeeders; i++) {
      const seederName = seeders[i];
      await job.log(`Starting seeder: ${seederName}...`);
      
      // Update progress: Indicate which seeder is running
      // Overall progress is weighted by step index
      // We can pass an object to updateProgress
      const baseProgress = Math.round((i / totalSeeders) * 100);
      
      await job.updateProgress({
        percent: baseProgress,
        step: seederName,
        progress: 0,
        message: `Starting ${seederName}...`
      });

      // Run the specific seeder task
      await this.runSeederTask(job, seederName, i, totalSeeders);
      
      await job.log(`Seeder ${seederName} completed.`);
    }

    await job.updateProgress({
      percent: 100,
      step: 'completed',
      progress: 100,
      message: 'All seeders completed successfully'
    });

    return 'All seeders completed successfully';
  }

  /**
   * Simulate a specific seeder task
   */
  private async runSeederTask(job: Job, name: string, stepIndex = 0, totalSteps = 1): Promise<string> {
    const steps = 10; // 10 chunks per seeder
    
    for (let i = 1; i <= steps; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate work

      const stepProgress = Math.round((i / steps) * 100);
      
      // Calculate global progress
      // Global progress = (completed steps / total steps) * 100 + (current step progress / total steps)
      const globalProgress = Math.round(((stepIndex + (i / steps)) / totalSteps) * 100);

      await job.updateProgress({
        percent: globalProgress,
        step: name,
        progress: stepProgress,
        message: `Seeding ${name}... (${stepProgress}%)`
      });
    }
    return `Seeder ${name} completed`;
  }

  /**
   * Simulate a long running task with progress updates
   */
  private async simulateLongRunningTask(job: Job): Promise<string> {
    const totalSteps = 20;
    
    for (let i = 1; i <= totalSteps; i++) {
      // Check if job is cancelled
      // if (await job.isWaitingChildren()) ...

      // Simulate work
      await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5s per step

      const progress = Math.round((i / totalSteps) * 100);
      
      // Update progress
      await job.updateProgress(progress);
      
      // Log progress (optional, can be stored in job data if needed)
      this.logger.debug(`Job ${job.id} progress: ${progress}%`);
      
      // You can also emit logs via job.log() which saves string logs to Redis
      await job.log(`Step ${i}/${totalSteps} completed.`);
    }

    return 'Seeder completed successfully';
  }

  /**
   * Run a CLI command (e.g. 'ls -la' or a real seeder script)
   */
  private async runCliCommand(job: Job): Promise<string> {
    await job.log('Starting CLI command...');
    
    return new Promise((resolve, reject) => {
      // Example: list files in current directory to simulate output
      // In production, this could be: spawn('node', ['dist/console.js', 'seed']);
      const child = spawn('ls', ['-la', 'src'], {
        cwd: process.cwd(),
      });

      child.stdout.on('data', async (data) => {
        const output = data.toString();
        this.logger.debug(`CLI Output: ${output}`);
        await job.log(output);
      });

      child.stderr.on('data', async (data) => {
        const error = data.toString();
        this.logger.error(`CLI Error: ${error}`);
        await job.log(`ERROR: ${error}`);
      });

      child.on('close', async (code) => {
        if (code === 0) {
          await job.updateProgress(100);
          resolve('CLI command finished successfully');
        } else {
          reject(new Error(`CLI command exited with code ${code}`));
        }
      });
    });
  }
}
