import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { toResponse } from '../../common/query-builder/interfaces/response.interface';
import { SuperUserService } from './super-user.service';
import { CreateSuperUserDto } from './super-user.dto';

@ApiTags('Users')
@Controller('users/super-admin')
export class SuperUserController {
  constructor(private readonly superUserService: SuperUserService) {}

  @Post()
  @ApiOperation({ summary: 'Create Super Admin user and assign role' })
  @ApiResponse({ status: 200 })
  async create(@Body() dto: CreateSuperUserDto) {
    const result = await this.superUserService.create(dto);
    return toResponse(result);
  }
}
