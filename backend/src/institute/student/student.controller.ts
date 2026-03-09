import { Controller, Get, Param, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { QueryParams } from '../../common/query-builder/interfaces/query-params.interface';

@ApiTags('institutes')
@Controller('institutes/:id/students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all students in an institute' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'includes', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'filter', required: false, type: Object })
  findAll(@Param('id') id: string, @Query() query: QueryParams) {
    return this.studentService.findAllByInstitute(id, query);
  }
}
