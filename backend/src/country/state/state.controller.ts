import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { toResponse } from '../../common/query-builder/interfaces/response.interface';
import { StateService } from './state.service';
import {
  StateDropdownQueryDto,
  StateFindAllQueryDto,
} from './dto/state-query.dto';

@ApiTags('States')
@Controller('states')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve all states by country iso3 (pagination, sorting)',
  })
  @ApiQuery({ name: 'iso3', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'includes', required: false, type: String })
  @ApiQuery({ name: 'fields', required: false, type: String })
  @ApiQuery({ name: 'filter', required: false, type: Object })
  async findAll(@Query() query: StateFindAllQueryDto) {
    const result = await this.stateService.findAll(query);
    return toResponse(result.data, result.meta);
  }

  @Get('dropdown')
  @ApiOperation({
    summary: 'State dropdown by country iso3 (cursor pagination)',
  })
  @ApiQuery({ name: 'iso3', required: true, type: String })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  async dropdown(@Query() query: StateDropdownQueryDto) {
    const result = await this.stateService.dropdown(query);
    return toResponse(result.data, result.meta);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a state by id (complete details)' })
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string) {
    const state = await this.stateService.findOne(id);
    return toResponse(state);
  }
}
