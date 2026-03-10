import { Injectable, Logger } from '@nestjs/common';
import { VaultService } from '../../vault/vault.service';
import axios, { AxiosInstance } from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);
  private tolgeeClients: Record<string, AxiosInstance> = {};

  constructor(private readonly vaultService: VaultService) {}

  async seed(
    onProgress?: (progress: number, message: string) => Promise<void>,
  ) {
    const reportProgress = async (progress: number, message: string) => {
      this.logger.log(message);
      if (onProgress) {
        await onProgress(progress, message);
      }
    };

    try {
      const status = await this.vaultService.ping();
      if (status.reachable && status.authenticated) {
        await reportProgress(0, `Vault connected: OK (${status.address})`);
      } else if (status.reachable) {
        await reportProgress(
          0,
          `Vault reachable but not authenticated (${status.address}): ${status.error ?? 'unknown'}`,
        );
      } else {
        await reportProgress(
          0,
          `Vault connection failed (${status.address}): ${status.error ?? 'unknown'}`,
        );
      }
    } catch (e: any) {
      await reportProgress(
        0,
        `Vault connection check failed: ${e?.message ?? e}`,
      );
    }

    // 2. Perform Seeding
    await reportProgress(10, 'seeding translation');
    // Delay to ensure log is picked up
    await new Promise((resolve) => setTimeout(resolve, 300));
    await reportProgress(12, '- english');
    await new Promise((resolve) => setTimeout(resolve, 300));
    await reportProgress(12, '- indonesia');
    await new Promise((resolve) => setTimeout(resolve, 300));

    await this.seedTranslationsToTolgeeAndVault(reportProgress);

    await reportProgress(100, 'Translations seed completed');
  }

  private async seedTranslationsToTolgeeAndVault(
    reportProgress: (progress: number, message: string) => Promise<void>,
  ) {
    const assetsDir = path.resolve(process.cwd(), 'assets', 'translation');
    const apps = ['portal', 'landing'];

    const commonEnPath = path.join(assetsDir, 'common', 'en.json');
    const commonIdPath = path.join(assetsDir, 'common', 'id.json');
    const commonEn = (await this.safeReadJson(commonEnPath)) || {};
    const commonId = (await this.safeReadJson(commonIdPath)) || {};

    const totalApps = apps.length;

    for (let i = 0; i < totalApps; i++) {
      const appType = apps[i];
      const baseProgress = 20 + Math.round((i / totalApps) * 70);

      try {
        const cred = await this.vaultService.readSecret(`kv/${appType}`);
        if (!cred?.TOLGEE_API_URL || !cred?.TOLGEE_API_KEY) {
          await reportProgress(
            baseProgress,
            `[Tolgee Seed] Missing credentials in Vault for ${appType}. Skipping.`,
          );
          continue;
        }

        const client = this.getTolgeeClient(
          cred.TOLGEE_API_URL,
          cred.TOLGEE_API_KEY,
        );
        const projectId = cred.TOLGEE_PROJECT_ID
          ? Number(cred.TOLGEE_PROJECT_ID)
          : await this.resolveProjectId(client);

        if (!projectId) {
          await reportProgress(
            baseProgress,
            `[Tolgee Seed] Unable to resolve projectId for ${appType}. Skipping.`,
          );
          continue;
        }

        const appEnPath = path.join(assetsDir, appType, 'en.json');
        const appIdPath = path.join(assetsDir, appType, 'id.json');
        const appEn = (await this.safeReadJson(appEnPath)) || {};
        const appId = (await this.safeReadJson(appIdPath)) || {};

        const commonEnFlat = this.flatten(commonEn, 'common');
        const commonIdFlat = this.flatten(commonId, 'common');

        const appEnFlat = this.flatten(appEn, '');
        const appIdFlat = this.flatten(appId, '');

        const mergedEn = { ...commonEnFlat, ...appEnFlat };
        const mergedId = { ...commonIdFlat, ...appIdFlat };

        const allKeys = new Set([
          ...Object.keys(mergedEn),
          ...Object.keys(mergedId),
        ]);
        const combinedPayload: Record<string, Record<string, string>> = {};

        for (const key of allKeys) {
          combinedPayload[key] = {};
          if (mergedEn[key]) combinedPayload[key]['en'] = mergedEn[key];
          if (mergedId[key]) combinedPayload[key]['id'] = mergedId[key];
        }

        if (Object.keys(combinedPayload).length > 0) {
          await this.importKeys(client, projectId, combinedPayload);
        }

        const existing = cred || {};
        const merged = { ...existing, TOLGEE_PROJECT_ID: String(projectId) };
        await this.vaultService.writeSecret(`kv/${appType}`, merged);
      } catch (e: any) {
        await reportProgress(
          baseProgress,
          `[Tolgee Seed] Failed for ${appType}: ${e?.message ?? e}`,
        );
      }
    }
  }

  private async safeReadJson(
    filePath: string,
  ): Promise<Record<string, any> | null> {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      if (!content || !content.trim()) return null;
      return JSON.parse(content);
    } catch {
      return null;
    }
  }

  private getTolgeeClient(apiUrl: string, apiKey: string): AxiosInstance {
    const base = apiUrl.replace(/\/$/, '');
    const cacheKey = `${base}::${apiKey}`;

    if (!this.tolgeeClients[cacheKey]) {
      this.tolgeeClients[cacheKey] = axios.create({
        baseURL: base,
        headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' },
        timeout: 20000,
      });
    }
    return this.tolgeeClients[cacheKey];
  }

  private async resolveProjectId(
    client: AxiosInstance,
  ): Promise<number | null> {
    try {
      const resp = await client.get('/v2/api-keys/current');
      const projectId = resp?.data?.projectId ?? null;
      return projectId;
    } catch (e: any) {
      const msg = e?.response?.data
        ? JSON.stringify(e.response.data)
        : e?.message;
      this.logger.error(`[Tolgee] Failed to resolve projectId: ${msg}`);
      return null;
    }
  }

  private flatten(
    obj: Record<string, any>,
    prefix = '',
  ): Record<string, string> {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(obj || {})) {
      const key = prefix ? `${prefix}.${k}` : k;
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        Object.assign(out, this.flatten(v, key));
      } else if (v !== undefined && v !== null) {
        out[key] = String(v);
      }
    }
    return out;
  }

  private async importKeys(
    client: AxiosInstance,
    projectId: number,
    payload: Record<string, Record<string, string>>,
  ) {
    const keysPayload = Object.entries(payload).map(([name, translations]) => ({
      name,
      translations,
      tags: [],
    }));

    if (keysPayload.length === 0) {
      return;
    }

    try {
      await client.post(`/v2/projects/${projectId}/keys/import`, {
        keys: keysPayload,
      });
      this.logger.log(
        `[Tolgee] Imported ${keysPayload.length} keys (with translations) into project ${projectId}`,
      );
    } catch (e: any) {
      const msg = e?.response?.data
        ? JSON.stringify(e.response.data)
        : e?.message;
      throw new Error(`Tolgee import failed: ${msg}`);
    }
  }
}
