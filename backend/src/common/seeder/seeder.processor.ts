import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { SEEDER_QUEUE } from './queue/queue.config';
import { GeographicalService } from './geographical/geographical.service';
import { TranslationService } from './translation/translation.service';
import { GenderService } from './gender/gender.service';
import { ReligionService } from './religion/religion.service';

@Processor(SEEDER_QUEUE)
export class SeederProcessor extends WorkerHost {
  private readonly logger = new Logger(SeederProcessor.name);

  constructor(
    private readonly geographicalService: GeographicalService,
    private readonly translationService: TranslationService,
    private readonly genderService: GenderService,
    private readonly religionService: ReligionService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);

    await job.updateProgress(0);

    const type =
      typeof (job.data as { type?: unknown })?.type === 'string'
        ? ((job.data as { type?: unknown }).type as string)
        : 'all';

    try {
      if (type === 'translations') {
        return await this.runTranslationsSeeder(job);
      } else if (type === 'gender') {
        return await this.runGenderSeeder(job);
      } else if (type === 'religion') {
        return await this.runReligionSeeder(job);
      } else if (type === 'geographical') {
        return await this.runGeographicalSeeder(job);
      } else {
        return await this.runSeederSequence(job);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Job ${job.id} failed: ${message}`);
      throw error;
    }
  }

  private async runSeederSequence(job: Job): Promise<string> {
    const seeders = ['gender', 'religion', 'translations', 'geographical'];
    const totalSeeders = seeders.length;

    for (let i = 0; i < totalSeeders; i++) {
      const seederName = seeders[i];

      const baseProgress = Math.round((i / totalSeeders) * 100);

      await job.updateProgress({
        percent: baseProgress,
        step: seederName,
        progress: 0,
        message: `Starting ${seederName}...`,
      });

      if (seederName === 'translations') {
        await this.runTranslationsSeeder(job, i, totalSeeders);
      } else if (seederName === 'gender') {
        await this.runGenderSeeder(job, i, totalSeeders);
      } else if (seederName === 'religion') {
        await this.runReligionSeeder(job, i, totalSeeders);
      } else if (seederName === 'geographical') {
        await this.runGeographicalSeeder(job, i, totalSeeders);
      }

      await job.log(`Seeder ${seederName} completed.`);
    }

    await job.updateProgress({
      percent: 100,
      step: 'completed',
      progress: 100,
      message: 'All seeders completed successfully',
    });

    return 'All seeders completed successfully';
  }

  private async runGenderSeeder(
    job: Job,
    stepIndex = 0,
    totalSteps = 1,
  ): Promise<string> {
    await this.genderService.seed(async (progress, message) => {
      const globalProgress = Math.round(
        ((stepIndex + progress / 100) / totalSteps) * 100,
      );
      await job.updateProgress({
        percent: globalProgress,
        step: 'gender',
        progress: progress,
        message: message,
      });
      await job.log(message);
    });

    return 'Gender seed completed';
  }

  private async runReligionSeeder(
    job: Job,
    stepIndex = 0,
    totalSteps = 1,
  ): Promise<string> {
    await this.religionService.seed(async (progress, message) => {
      const globalProgress = Math.round(
        ((stepIndex + progress / 100) / totalSteps) * 100,
      );
      await job.updateProgress({
        percent: globalProgress,
        step: 'religion',
        progress: progress,
        message: message,
      });
      await job.log(message);
    });

    return 'Religion seed completed';
  }

  private async runGeographicalSeeder(
    job: Job,
    stepIndex = 0,
    totalSteps = 1,
  ): Promise<string> {
    await this.geographicalService.seed(async (progress, message) => {
      const globalProgress = Math.round(
        ((stepIndex + progress / 100) / totalSteps) * 100,
      );
      await job.updateProgress({
        percent: globalProgress,
        step: 'geographical',
        progress: progress,
        message: message,
      });
    });
    return 'Geographical seed completed';
  }

  private async runTranslationsSeeder(
    job: Job,
    stepIndex = 0,
    totalSteps = 1,
  ): Promise<string> {
    await this.translationService.seed(async (progress, message) => {
      const globalProgress = Math.round(
        ((stepIndex + progress / 100) / totalSteps) * 100,
      );
      await job.updateProgress({
        percent: globalProgress,
        step: 'translations',
        progress: progress,
        message: message,
      });
      if (
        message.includes('Vault') ||
        message.includes('Tolgee') ||
        message.includes('Seeding')
      ) {
        await job.log(message);
      }
    });

    return 'Translations seed completed';
  }
}
