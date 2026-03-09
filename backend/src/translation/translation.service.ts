import { Injectable, Logger, ServiceUnavailableException, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common';
import { VaultService } from '../common/vault/vault.service';

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);

  constructor(
    private vaultService: VaultService
  ) {}

  /**
   * Determine the appropriate API Key based on the 'X-App-Type' header
   * Header value: 'portal' or 'landing' (default)
   */
  private async getTolgeeConfig(appType: string = 'landing') {
    // Try to get from Vault first (preferred for secrets)
    // Structure in Vault: kv/data/landing -> { TOLGEE_API_KEY: "..." }
    const vaultPath = `kv/data/${appType}`;
    const vaultConfig = await this.vaultService.readSecret(vaultPath);
    
    if (!vaultConfig) {
      throw new ServiceUnavailableException(`Vault configuration for ${appType} not found at ${vaultPath}`);
    }

    if (!vaultConfig.TOLGEE_API_KEY || !vaultConfig.TOLGEE_API_URL) {
      throw new InternalServerErrorException(`Incomplete Tolgee configuration in Vault for ${appType}. Missing TOLGEE_API_KEY or TOLGEE_API_URL.`);
    }

    return {
      apiUrl: vaultConfig.TOLGEE_API_URL.trim(),
      apiKey: vaultConfig.TOLGEE_API_KEY.trim(),
    };
  }

  async getLanguages(appType: string) {
    const { apiUrl, apiKey } = await this.getTolgeeConfig(appType);

    if (!apiKey) {
      return ['en', 'id']; // Fallback
    }

    try {
      const baseUrl = apiUrl.replace(/\/$/, '');
      const response = await fetch(`${baseUrl}/v2/projects/languages`, {
        headers: { 'X-API-Key': apiKey },
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`[Translation] Failed to fetch languages: ${response.status} ${errorText}`);
        throw new HttpException(
          `Tolgee Error: ${response.statusText} - ${errorText}`,
          response.status
        );
      }

      const data = await response.json();
      const languages = data._embedded?.languages || [];
      return languages.map((l: any) => l.tag);
    } catch (error) {
      this.logger.error('Failed to fetch Tolgee languages:', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch languages from Tolgee');
    }
  }

  private flattenObject(obj: any, prefix = ''): Record<string, string> {
    const result: Record<string, string> = {};
    for (const k in obj) {
      const newKey = prefix ? `${prefix}.${k}` : k;
      if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
        Object.assign(result, this.flattenObject(obj[k], newKey));
      } else {
        result[newKey] = String(obj[k]);
      }
    }
    return result;
  }

  async getTranslations(lang: string, appType: string) {
    const { apiUrl, apiKey } = await this.getTolgeeConfig(appType);

    if (!apiKey) {
      this.logger.warn(`[Translation] Tolgee API Key missing for ${appType}`);
      throw new InternalServerErrorException(`Tolgee API Key missing for ${appType}`);
    }

    // Mask API Key for logging (show first 4 chars)
    // DEBUG: Showing full key as requested
    this.logger.log(`[Translation] Using Config -> URL: ${apiUrl}, Key: ${apiKey}`);

    try {
      const baseUrl = apiUrl.replace(/\/$/, '');
      // Requesting flat JSON from Tolgee
      const url = `${baseUrl}/v2/projects/export?languages=${lang}&format=JSON&zip=false&nested=false`;
      this.logger.log(`[Translation] Fetching translations from Tolgee (${appType}): ${url}`);

      const response = await fetch(url, {
        headers: { 'X-API-Key': apiKey },
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`[Translation] Tolgee export failed: ${response.status} ${errorText}`);
        
        // Propagate the error to the client instead of returning empty object
        throw new HttpException(
          {
            message: 'Failed to fetch translations from Tolgee',
            tolgee_status: response.status,
            tolgee_error: errorText
          },
          response.status
        );
      }

      const data = await response.json();
      
      const actualData = data[lang] ? data[lang] : data;
      const flattened = this.flattenObject(actualData);
      return flattened;
    } catch (error) {
      this.logger.error(`[Translation] Error fetching translations: ${error.message}`, error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(`Failed to fetch translations: ${error.message}`);
    }
  }
}
