import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { InstituteService } from './institute.service';
import {
  CreateInstituteDto,
  UpdateInstituteDto,
} from './dto/create-institute.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { QueryParams } from '../common/query-builder/interfaces/query-params.interface';

@ApiTags('institutes')
@Controller('institutes')
export class InstituteController {
  constructor(private readonly instituteService: InstituteService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new institute' })
  create(@Body() createInstituteDto: CreateInstituteDto) {
    return this.instituteService.create(createInstituteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all institutes with filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'includes', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'filter', required: false, type: Object })
  findAll(@Query() query: QueryParams) {
    return this.instituteService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an institute by ID' })
  @ApiQuery({ name: 'includes', required: false, type: String })
  findOne(@Param('id') id: string, @Query() query: QueryParams) {
    return this.instituteService.findOne(id, query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an institute by ID' })
  update(
    @Param('id') id: string,
    @Body() updateInstituteDto: UpdateInstituteDto,
  ) {
    return this.instituteService.update(id, updateInstituteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an institute by ID' })
  remove(@Param('id') id: string) {
    return this.instituteService.remove(id);
  }
}
