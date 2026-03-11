import { Injectable, Logger } from '@nestjs/common';
import { VaultService } from '../../vault/vault.service';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
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
    } catch (e: unknown) {
      const message =
        e instanceof Error
          ? e.message
          : typeof e === 'string'
            ? e
            : JSON.stringify(e);
      await reportProgress(0, `Vault connection check failed: ${message}`);
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
        const cred = (await this.vaultService.readSecret(
          `kv/${appType}`,
        )) as Record<string, unknown> | null;
        const apiUrl =
          cred && typeof cred['TOLGEE_API_URL'] === 'string'
            ? cred['TOLGEE_API_URL']
            : null;
        const apiKey =
          cred && typeof cred['TOLGEE_API_KEY'] === 'string'
            ? cred['TOLGEE_API_KEY']
            : null;
        const vaultProjectIdRaw =
          cred &&
          (typeof cred['TOLGEE_PROJECT_ID'] === 'string' ||
            typeof cred['TOLGEE_PROJECT_ID'] === 'number')
            ? cred['TOLGEE_PROJECT_ID']
            : null;

        if (!apiUrl || !apiKey) {
          await reportProgress(
            baseProgress,
            `[Tolgee Seed] Missing credentials in Vault for ${appType}. Skipping.`,
          );
          continue;
        }

        const client = this.getTolgeeClient(apiUrl, apiKey);
        const resolvedProjectId = await this.resolveProjectId(client);
        const fallbackProjectId =
          vaultProjectIdRaw && !Number.isNaN(Number(vaultProjectIdRaw))
            ? Number(vaultProjectIdRaw)
            : null;
        const projectId = resolvedProjectId ?? fallbackProjectId;

        if (!projectId) {
          await reportProgress(
            baseProgress,
            `[Tolgee Seed] Unable to resolve projectId for ${appType}. Skipping.`,
          );
          continue;
        }
        if (
          resolvedProjectId &&
          fallbackProjectId &&
          resolvedProjectId !== fallbackProjectId
        ) {
          await reportProgress(
            baseProgress,
            `[Tolgee Seed] Vault projectId mismatch for ${appType} (vault=${fallbackProjectId}, apiKey=${resolvedProjectId}). Using apiKey projectId.`,
          );
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
      } catch (e: unknown) {
        const message =
          e instanceof Error
            ? e.message
            : typeof e === 'string'
              ? e
              : JSON.stringify(e);
        await reportProgress(
          baseProgress,
          `[Tolgee Seed] Failed for ${appType}: ${message}`,
        );
      }
    }
  }

  private async safeReadJson(
    filePath: string,
  ): Promise<Record<string, unknown> | null> {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      if (!content || !content.trim()) return null;
      const parsed = JSON.parse(content) as unknown;
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
      return null;
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
      const resp = await client.get<{ projectId?: number }>(
        '/v2/api-keys/current',
      );
      return typeof resp.data?.projectId === 'number'
        ? resp.data.projectId
        : null;
    } catch (e: unknown) {
      const msg = this.getAxiosOrErrorMessage(e);
      this.logger.error(`[Tolgee] Failed to resolve projectId: ${msg}`);
      return null;
    }
  }

  private getAxiosOrErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      const response = error.response as AxiosResponse<unknown> | undefined;
      if (typeof response?.data !== 'undefined') {
        return JSON.stringify(response.data);
      }
      return error.message;
    }
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return JSON.stringify(error);
  }

  private flatten(
    obj: Record<string, unknown>,
    prefix = '',
  ): Record<string, string> {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(obj || {})) {
      const key = prefix ? `${prefix}.${k}` : k;
      if (Array.isArray(v)) {
        out[key] = JSON.stringify(v);
        continue;
      }

      if (this.isPlainObject(v)) {
        Object.assign(out, this.flatten(v, key));
        continue;
      }

      if (v !== undefined && v !== null) {
        if (typeof v === 'string') out[key] = v;
        else if (typeof v === 'number') out[key] = String(v);
        else if (typeof v === 'boolean') out[key] = String(v);
        else if (typeof v === 'bigint') out[key] = String(v);
        else if (typeof v === 'symbol') out[key] = v.toString();
        else out[key] = JSON.stringify(v);
      }
    }
    return out;
  }

  private isPlainObject(value: unknown): value is Record<string, unknown> {
    return Object.prototype.toString.call(value) === '[object Object]';
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
    } catch (e: unknown) {
      const msg = this.getAxiosOrErrorMessage(e);
      throw new Error(`Tolgee import failed: ${msg}`);
    }
  }
}
