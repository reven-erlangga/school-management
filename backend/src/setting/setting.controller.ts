import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SettingService } from './setting.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { toResponse } from '../common/query-builder/interfaces/response.interface';

@ApiTags('Settings')
@Controller('settings')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get(':group')
  @ApiOperation({
    summary: 'Get settings by group (sensitive values are masked)',
  })
  @ApiResponse({ status: 200 })
  findByGroup(@Param('group') group: string) {
    return this.settingService
      .findByGroup(group)
      .then((data) => toResponse(data));
  }

  @Post(':group')
  @ApiOperation({
    summary:
      'Create or update settings by group (auto-encrypts sensitive keys)',
  })
  @ApiResponse({ status: 200 })
  createOrUpdate(
    @Param('group') group: string,
    @Body() dto: Record<string, any>,
  ) {
    return this.settingService
      .createOrUpdate(group, dto)
      .then((data) => toResponse(data));
  }
}
