import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { InitializeService } from '../initialize/initialize.service';
import { QueryBuilder } from '../common/query-builder/QueryBuilder';

@Injectable()
export class SettingService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-secret-key', 'salt', 32);
  private readonly iv = crypto.scryptSync(process.env.ENCRYPTION_IV || 'default-iv-secret', 'salt', 16);

  private readonly sensitiveKeys = [
    'password',
    'api_key',
    'xendit_api_key',
    'xendit_webhook_secret',
    'mail_password',
    'vault_token', // Added Vault Token
  ];

  constructor(
    private queryBuilder: QueryBuilder,
    private initializeService: InitializeService
  ) { }

  private encrypt(text: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  private decrypt(encryptedText: string): string {
    try {
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (e) {
      return ''; // Return empty if decryption fails
    }
  }

  private maskValue(value: string): string {
    if (!value || value === '') return '';
    if (value.length <= 4) return '****';
    return value.substring(0, 4) + '****';
  }

  async findByGroup(group: string) {
    const settings = await this.queryBuilder.find({
      table: 'setting',
      where: { group },
    });

    const result: Record<string, any> = {};
    settings.forEach((s: any) => {
      let value = s.value;
      const isActuallySensitive = s.is_sensitive || this.sensitiveKeys.includes(s.key);

      if (isActuallySensitive && value) {
        // If it's marked as sensitive but we get it from DB, we should decrypt if possible
        // If decryption fails (because it was stored as plain text), decrypt() returns empty or original
        const decrypted = s.is_sensitive ? this.decrypt(value) : value;
        value = this.maskValue(decrypted);
      }
      result[s.key] = value;
    });

    return result;
  }

  async getInternalByGroup(group: string) {
    const settings = await this.queryBuilder.find({
      table: 'setting',
      where: { group },
    });

    const result: Record<string, any> = {};
    settings.forEach((s: any) => {
      let value = s.value;
      if (s.is_sensitive && value) {
        value = this.decrypt(value);
      }
      result[s.key] = value;
    });

    return result;
  }

  // New method as requested: findByKey(key)
  async findByKey(key: string) {
    const results = await this.queryBuilder.find({
      table: 'setting',
      where: { key },
    });
    return results.length > 0 ? results[0] : null;
  }

  // New method as requested: findByType(type, options) - assuming 'group' maps to 'type' or just generic search
  async findByType(type: string, options?: { page?: number; limit?: number }) {
    return await this.queryBuilder.find({
      table: 'setting',
      where: { group: type },
      limit: options?.limit,
      offset: options?.page && options?.limit ? (options.page - 1) * options.limit : undefined,
    });
  }

  async createOrUpdate(group: string, dto: Record<string, any>) {
    for (const [key, value] of Object.entries(dto)) {
      // Skip updating if the value is null or undefined
      if (value === null || value === undefined) {
        continue;
      }

      const isSensitive = this.sensitiveKeys.includes(key);
      let finalValue = typeof value === 'object' ? JSON.stringify(value) : String(value);

      if (isSensitive) {
        // If it's a masked value (ends with ****), skip updating to preserve original
        if (finalValue.endsWith('****')) {
          continue;
        }

        if (finalValue !== '') {
          finalValue = this.encrypt(finalValue);
        }
      }

      await this.queryBuilder.createOrUpdate({
        table: 'setting',
        where: {
          group_key: {
            group,
            key,
          },
        },
        data: {
          group,
          key,
          value: finalValue,
          is_sensitive: isSensitive,
        },
      });
    }

    // Invalidate initialization cache
    this.initializeService.resetCache();

    return this.findByGroup(group);
  }

  /**
   * Retrieve decrypted Vault configuration
   */
  async getVaultConfig(): Promise<{ address: string; token: string }> {
    const settings = await this.getInternalByGroup('vault');
    return {
      // Prioritize environment variables over database settings
      address: process.env.VAULT_ADDR || settings['vault_address'] || 'http://vault:8200',
      token: process.env.VAULT_TOKEN || settings['vault_token'],
    };
  }
}
