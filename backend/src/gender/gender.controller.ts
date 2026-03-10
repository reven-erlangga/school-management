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
import { GenderService } from './gender.service';
import { CreateGenderDto } from './dto/create-gender.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { QueryParams } from '../common/query-builder/interfaces/query-params.interface';

@ApiTags('gender')
@Controller('gender')
export class GenderController {
  constructor(private readonly genderService: GenderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new gender' })
  create(@Body() createGenderDto: CreateGenderDto) {
    return this.genderService.create(createGenderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all genders' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'includes', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'filter', required: false, type: Object })
  findAll(@Query() query: QueryParams) {
    return this.genderService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a gender by ID' })
  @ApiQuery({ name: 'includes', required: false, type: String })
  findOne(@Param('id') id: string, @Query() query: QueryParams) {
    return this.genderService.findOne(id, query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a gender by ID' })
  update(@Param('id') id: string, @Body() updateGenderDto: UpdateGenderDto) {
    return this.genderService.update(id, updateGenderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a gender by ID' })
  remove(@Param('id') id: string) {
    return this.genderService.remove(id);
  }
}
