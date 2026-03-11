import { Injectable, Logger } from '@nestjs/common';
import { QueryBuilderService } from '../../query-builder/query-builder.service';

@Injectable()
export class GenderService {
  private readonly logger = new Logger(GenderService.name);

  constructor(private readonly qb: QueryBuilderService) {}

  async seed(
    onProgress?: (progress: number, message: string) => Promise<void>,
  ) {
    const genders = [
      {
        key: 'male',
        name: JSON.stringify({ en: 'Male', id: 'Laki-laki' }),
        description: JSON.stringify({
          en: 'Male gender',
          id: 'Jenis kelamin laki-laki',
        }),
      },
      {
        key: 'female',
        name: JSON.stringify({ en: 'Female', id: 'Perempuan' }),
        description: JSON.stringify({
          en: 'Female gender',
          id: 'Jenis kelamin perempuan',
        }),
      },
    ];

    this.logger.log(`Seeding genders... (${genders.length} items)`);

    if (onProgress) {
      await onProgress(0, 'seeding gender');
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    for (let i = 0; i < genders.length; i++) {
      const gender = genders[i];
      await this.qb.using('gender', {}).upsert({ key: gender.key }, gender);

      if (onProgress) {
        const progress = Math.round(((i + 1) / genders.length) * 100);
        await onProgress(progress, `seeding gender: ${gender.key}`);
      }
    }

    const summary = `Gender seed completed (${genders.length} items)`;
    this.logger.log(summary);
    if (onProgress) {
      await onProgress(100, summary);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
}
