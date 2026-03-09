import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { InitializationStatusEntity, SettingEntity } from './entities/setting.entity';

@Injectable()
export class InitializeService {
  private isInitializedCache: boolean | null = null;
  private lastCheckTime: number = 0;
  private readonly CACHE_TTL = 60000; // 1 minute cache

  constructor(private readonly prisma: PrismaService) {}

  async check(): Promise<InitializationStatusEntity> {
    const categories = ['general', 'vault', 'mail'];
    const results = await Promise.all(
      categories.map(async (group) => {
        if (group === 'vault' && process.env.VAULT_ADDR && process.env.VAULT_TOKEN) {
          return { group, exists: true };
        }
        const count = await (this.prisma as any).setting.count({
          where: { group },
        });
        return { group, exists: count > 0 };
      }),
    );

    const status = results.reduce((acc, curr) => {
      acc[curr.group] = curr.exists;
      return acc;
    }, {} as any);

    status.is_initialized = categories.every((c) => status[c]);
    
    // Update cache
    this.isInitializedCache = status.is_initialized;
    this.lastCheckTime = Date.now();

    return new InitializationStatusEntity(status);
  }

  async isInitialized(): Promise<boolean> {
    if (this.isInitializedCache === true) {
      return true; // Once true, usually stays true unless manually reset (which we don't handle here)
    }

    if (this.isInitializedCache !== null && (Date.now() - this.lastCheckTime < this.CACHE_TTL)) {
      return this.isInitializedCache;
    }

    const status = await this.check();
    return status.is_initialized;
  }

  resetCache() {
    this.isInitializedCache = null;
    this.lastCheckTime = 0;
  }

  async findByKey(key: string): Promise<SettingEntity> {
    const setting = await (this.prisma as any).setting.findFirst({
      where: { key },
    });

    if (!setting) {
      throw new NotFoundException(`Setting with key '${key}' not found`);
    }

    return new SettingEntity(setting);
  }
}
