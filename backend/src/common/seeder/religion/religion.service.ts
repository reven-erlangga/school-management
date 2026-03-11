import { Injectable, Logger } from '@nestjs/common';
import { QueryBuilderService } from '../../query-builder/query-builder.service';

@Injectable()
export class ReligionService {
  private readonly logger = new Logger(ReligionService.name);

  constructor(private readonly qb: QueryBuilderService) {}

  async seed(
    onProgress?: (progress: number, message: string) => Promise<void>,
  ) {
    const religions = [
      {
        key: 'islam',
        name: { en: 'Islam', id: 'Islam' },
        description: { en: 'Islamic Faith', id: 'Agama Islam' },
        is_active: true,
      },
      {
        key: 'christian_protestant',
        name: {
          en: 'Protestant Christian',
          id: 'Kristen Protestan',
        },
        description: {
          en: 'Protestantism',
          id: 'Protestan',
        },
        is_active: true,
      },
      {
        key: 'christian_catholic',
        name: { en: 'Catholic', id: 'Katolik' },
        description: { en: 'Catholicism', id: 'Katolik' },
        is_active: true,
      },
      {
        key: 'hindu',
        name: { en: 'Hindu', id: 'Hindu' },
        description: { en: 'Hinduism', id: 'Hinduisme' },
        is_active: true,
      },
      {
        key: 'buddha',
        name: { en: 'Buddha', id: 'Buddha' },
        description: { en: 'Buddhism', id: 'Buddhisme' },
        is_active: true,
      },
      {
        key: 'konghucu',
        name: { en: 'Confucian', id: 'Konghucu' },
        description: { en: 'Confucianism', id: 'Konghucu' },
        is_active: true,
      },
    ];

    this.logger.log(`Seeding religions... (${religions.length} items)`);

    if (onProgress) {
      await onProgress(0, 'seeding religion');
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    for (let i = 0; i < religions.length; i++) {
      const religion = religions[i];
      await this.qb
        .using('religion', {})
        .upsert({ key: religion.key }, religion);

      if (onProgress) {
        const progress = Math.round(((i + 1) / religions.length) * 100);
        await onProgress(progress, `seeding religion: ${religion.key}`);
      }
    }

    const summary = `Religion seed completed (${religions.length} items)`;
    this.logger.log(summary);
    if (onProgress) {
      await onProgress(100, summary);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
}
