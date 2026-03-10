import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { toResponse } from '../../../common/query-builder/interfaces/response.interface';
import { CityService } from './city.service';
import {
  CityDropdownQueryDto,
  CityFindAllQueryDto,
} from './dto/city-query.dto';

@ApiTags('Cities')
@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve all cities by state code (pagination, sorting)',
  })
  @ApiQuery({ name: 'state_code', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'includes', required: false, type: String })
  @ApiQuery({ name: 'fields', required: false, type: String })
  @ApiQuery({ name: 'filter', required: false, type: Object })
  async findAll(@Query() query: CityFindAllQueryDto) {
    const result = await this.cityService.findAll(query);
    return toResponse(result.data, result.meta);
  }

  @Get('dropdown')
  @ApiOperation({ summary: 'City dropdown by state code (cursor pagination)' })
  @ApiQuery({ name: 'state_code', required: true, type: String })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  async dropdown(@Query() query: CityDropdownQueryDto) {
    const result = await this.cityService.dropdown(query);
    return toResponse(result.data, result.meta);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a city by id (complete details)' })
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string) {
    const city = await this.cityService.findOne(id);
    return toResponse(city);
  }
}
