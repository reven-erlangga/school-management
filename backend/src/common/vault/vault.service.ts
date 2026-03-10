import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { SettingService } from '../../setting/setting.service';

@Injectable()
export class VaultService {
  private readonly logger = new Logger(VaultService.name);
  private client: AxiosInstance;

  constructor(
    @Inject(forwardRef(() => SettingService))
    private readonly settingService: SettingService,
  ) {}

  private async getClient(): Promise<AxiosInstance> {
    const config = await this.settingService.getVaultConfig();

    if (!config.address || !config.token) {
      throw new Error(
        'Vault configuration not found. Please configure Vault settings.',
      );
    }

    // Always create a new instance or check if config changed (for simplicity, creating new one)
    // Ideally, we cache this but invalidate if settings change.
    // Given the scope, creating a lightweight axios instance is fine.
    return axios.create({
      baseURL: config.address,
      headers: {
        'X-Vault-Token': config.token,
        'Content-Type': 'application/json',
      },
    });
  }

  async ping(): Promise<{
    address: string;
    reachable: boolean;
    authenticated: boolean;
    error?: string;
  }> {
    const config = await this.settingService.getVaultConfig();
    const address = config.address || 'http://vault:8200';

    try {
      const base = address.replace(/\/$/, '');
      const plainClient = axios.create({ baseURL: base, timeout: 8000 });
      await plainClient.get('/v1/sys/health');

      if (!config.token) {
        return {
          address: base,
          reachable: true,
          authenticated: false,
          error: 'missing_token',
        };
      }

      const authClient = axios.create({
        baseURL: base,
        timeout: 8000,
        headers: { 'X-Vault-Token': config.token },
      });
      await authClient.get('/v1/auth/token/lookup-self');

      return { address: base, reachable: true, authenticated: true };
    } catch (e: any) {
      const msg = e?.response?.data
        ? JSON.stringify(e.response.data)
        : e?.message;
      return {
        address,
        reachable: false,
        authenticated: false,
        error: msg,
      };
    }
  }

  /**
   * Read secret from Vault
   * @param path Path to secret (e.g. 'secret/data/tolgee' or 'kv/landing')
   */
  async readSecret(path: string): Promise<any> {
    try {
      const client = await this.getClient();
      // Ensure path handles KV v2 'data' prefix correctly
      // Standard KV v2 read path: <mount>/data/<path>

      let normalizedPath = path;

      // Handle user-provided v1 prefix or leading slashes
      if (normalizedPath.startsWith('/')) {
        normalizedPath = normalizedPath.substring(1);
      }
      if (normalizedPath.startsWith('v1/')) {
        normalizedPath = normalizedPath.substring(3);
      }

      if (path.startsWith('secret/')) {
        if (!path.includes('/data/')) {
          normalizedPath = path.replace('secret/', 'secret/data/');
        }
      } else if (path.startsWith('kv/')) {
        if (!path.includes('/data/')) {
          normalizedPath = path.replace('kv/', 'kv/data/');
        }
      } else {
        // Default to 'secret' mount if no mount specified
        normalizedPath = `secret/data/${path}`;
      }

      const response = await client.get(`v1/${normalizedPath}`);
      return response.data?.data?.data; // KV v2 structure: data.data.data
    } catch (error) {
      this.logger.error(
        `Failed to read secret from Vault: ${path} - Error: ${error.message}`,
      );
      if (error.config) {
        this.logger.error(
          `Vault Request URL: ${error.config.baseURL}/${error.config.url}`,
        );
      }
      return null;
    }
  }

  /**
   * Write secret to Vault
   * @param path Path to secret
   * @param data Data object to store
   */
  async writeSecret(path: string, data: any): Promise<boolean> {
    try {
      const client = await this.getClient();

      let normalizedPath = path;

      if (path.startsWith('secret/')) {
        if (!path.includes('/data/')) {
          normalizedPath = path.replace('secret/', 'secret/data/');
        }
      } else if (path.startsWith('kv/')) {
        if (!path.includes('/data/')) {
          normalizedPath = path.replace('kv/', 'kv/data/');
        }
      } else {
        normalizedPath = `secret/data/${path}`;
      }

      await client.post(`v1/${normalizedPath}`, {
        data: data, // KV v2 expects data wrapped in 'data' object
      });

      return true;
    } catch (error) {
      this.logger.error(
        `Failed to write secret to Vault: ${path}`,
        error.message,
      );
      throw error;
    }
  }
}
