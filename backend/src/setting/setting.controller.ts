import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SettingService } from './setting.service';
import { VaultService } from '../common/vault/vault.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Settings')
@Controller('settings')
export class SettingController {
  constructor(
    private readonly settingService: SettingService,
    private readonly vaultService: VaultService,
  ) {}

  @Get('public-config')
  @ApiOperation({ summary: 'Get public configuration from Vault' })
  async getPublicConfig() {
    // We do NOT expose sensitive keys (like Tolgee API Key) here anymore.
    // Frontend should use the /translations endpoint which proxies requests securely.
    return {
      // Add other public configs here if needed, but avoid keys
      message: "Public configuration endpoint",
    };
  }

  @Get(':group')
  findByGroup(@Param('group') group: string) {
    return this.settingService.findByGroup(group);
  }

  @Post(':group')
  createOrUpdate(@Param('group') group: string, @Body() dto: Record<string, any>) {
    return this.settingService.createOrUpdate(group, dto);
  }
}
