import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InitializeService } from './initialize.service';
import {
  InitializationStatusEntity,
  SettingEntity,
} from './entities/setting.entity';
import { toResponse } from '../common/query-builder/interfaces/response.interface';

@ApiTags('Initialize')
@Controller('initialize')
export class InitializeController {
  constructor(private readonly initializeService: InitializeService) {}

  @Get('check')
  @ApiOperation({ summary: 'Check initialization status of settings' })
  @ApiResponse({
    status: 200,
    description: 'Initialization status',
    type: InitializationStatusEntity,
  })
  async check() {
    const result = await this.initializeService.check();
    return toResponse(result);
  }

  @Get(':key')
  @ApiOperation({ summary: 'Get setting by key' })
  @ApiResponse({
    status: 200,
    description: 'Setting details',
    type: SettingEntity,
  })
  @ApiResponse({ status: 404, description: 'Setting not found' })
  async findByKey(@Param('key') key: string) {
    const result = await this.initializeService.findByKey(key);
    return toResponse(result);
  }
}
