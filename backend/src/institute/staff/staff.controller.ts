import { Controller, Get, Param, Query } from '@nestjs/common';
import { StaffService } from './staff.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { QueryParams } from '../../common/query-builder/interfaces/query-params.interface';

@ApiTags('institutes')
@Controller('institutes/:id/staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  @ApiOperation({ summary: 'Get all staff in an institute' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'includes', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'filter', required: false, type: Object })
  findAll(@Param('id') id: string, @Query() query: QueryParams) {
    return this.staffService.findAllByInstitute(id, query);
  }
}
