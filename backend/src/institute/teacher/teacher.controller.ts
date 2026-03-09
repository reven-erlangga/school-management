import { Controller, Get, Param, Query } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { QueryParams } from '../../common/query-builder/interfaces/query-params.interface';

@ApiTags('institutes')
@Controller('institutes/:id/teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  @ApiOperation({ summary: 'Get all teachers in an institute' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'includes', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'filter', required: false, type: Object })
  findAll(@Param('id') id: string, @Query() query: QueryParams) {
    return this.teacherService.findAllByInstitute(id, query);
  }
}
