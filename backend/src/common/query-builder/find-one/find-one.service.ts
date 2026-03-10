import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class FindOneService {
  private readonly logger = new Logger(FindOneService.name);

  constructor(private readonly redis: RedisService) {}

  async findOne(
    model: any,
    params: {
      where: Record<string, any>;
      select?: Record<string, boolean>;
      include?: Record<string, any>;
      useCache?: boolean;
      ttl?: number;
      modelName?: string;
    },
  ): Promise<any | null> {
    const {
      where,
      select,
      include,
      useCache = false,
      ttl = 300,
      modelName,
    } = params;

    if (!model) {
      throw new Error('Model delegate is required');
    }

    const cacheKey =
      useCache && modelName
        ? this.generateCacheKey(modelName, where, select, include)
        : null;

    if (useCache && cacheKey) {
      const cached = await this.redis.get<any>(cacheKey);
      if (cached !== null) {
        this.logger.debug(`Cache HIT for key: ${cacheKey}`);
        return cached;
      }
    }

    const result = await model.findUnique({
      where,
      ...(select ? { select } : {}),
      ...(include ? { include } : {}),
    });

    if (useCache && cacheKey) {
      await this.redis.set(cacheKey, result, ttl);
    }

    return result;
  }

  private generateCacheKey(
    modelName: string,
    where: Record<string, any>,
    select?: Record<string, boolean>,
    include?: Record<string, any>,
  ) {
    const payload = JSON.stringify({ where, select, include });
    const hash = crypto
      .createHash('sha256')
      .update(payload)
      .digest('hex')
      .slice(0, 16);
    return `${modelName}:find-one:${hash}`;
  }
}
