import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { toResponse } from '../common/query-builder/interfaces/response.interface';
import { CountryService } from './country.service';
import {
  CountryDropdownQueryDto,
  CountryFindAllQueryDto,
} from './dto/country-query.dto';

@ApiTags('Countries')
@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve all countries (pagination, sorting, filtering)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'includes', required: false, type: String })
  @ApiQuery({ name: 'fields', required: false, type: String })
  @ApiQuery({ name: 'filter', required: false, type: Object })
  async findAll(@Query() query: CountryFindAllQueryDto) {
    const result = await this.countryService.findAll(query);
    return toResponse(result.data, result.meta);
  }

  @Get('dropdown')
  @ApiOperation({ summary: 'Country dropdown (cursor pagination)' })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  async dropdown(@Query() query: CountryDropdownQueryDto) {
    const result = await this.countryService.dropdown(query);
    return toResponse(result.data, result.meta);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a country by id (complete details)' })
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string) {
    const country = await this.countryService.findOne(id);
    return toResponse(country);
  }
}
