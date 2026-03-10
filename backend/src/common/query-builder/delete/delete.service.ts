import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class DeleteService {
  private readonly logger = new Logger(DeleteService.name);

  constructor(private readonly redis: RedisService) {}

  async remove(
    model: any,
    options: {
      id?: string;
      where?: Record<string, any>;
      soft?: boolean;
      modelName?: string;
    },
  ): Promise<any> {
    const { id, where, soft = true, modelName } = options;

    if (!model) {
      throw new Error('Model delegate is required');
    }

    let result: any;

    if (soft) {
      const filter = id ? { id } : where || {};
      result = await model.updateMany({
        where: filter,
        data: { deletedAt: new Date() },
      });
      if (result.count === 0) {
        throw new NotFoundException(
          id ? `Entity with ID ${id} not found` : `No entities matched filter`,
        );
      }
    } else {
      if (id) {
        result = await model.delete({ where: { id } });
      } else {
        result = await model.deleteMany({ where: where || {} });
      }
    }

    if (modelName) {
      const pattern = `${modelName}:*`;
      await this.redis.reset(pattern);
      this.logger.debug(`Cache invalidated with pattern: ${pattern}`);
    }

    return result;
  }
}
