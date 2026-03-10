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
import { ReligionService } from './religion.service';
import { CreateReligionDto } from './dto/create-religion.dto';
import { UpdateReligionDto } from './dto/update-religion.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { QueryParams } from '../common/query-builder/interfaces/query-params.interface';

@ApiTags('religion')
@Controller('religion')
export class ReligionController {
  constructor(private readonly religionService: ReligionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new religion' })
  create(@Body() createReligionDto: CreateReligionDto) {
    return this.religionService.create(createReligionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all religions with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'includes', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'filter', required: false, type: Object })
  findAll(@Query() query: QueryParams) {
    return this.religionService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a religion by ID' })
  @ApiQuery({ name: 'includes', required: false, type: String })
  findOne(@Param('id') id: string, @Query() query: QueryParams) {
    return this.religionService.findOne(id, query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a religion by ID' })
  update(
    @Param('id') id: string,
    @Body() updateReligionDto: UpdateReligionDto,
  ) {
    return this.religionService.update(id, updateReligionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a religion by ID' })
  remove(@Param('id') id: string) {
    return this.religionService.remove(id);
  }
}
