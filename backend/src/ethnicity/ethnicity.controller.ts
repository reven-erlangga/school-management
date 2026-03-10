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
import { EthnicityService } from './ethnicity.service';
import { CreateEthnicityDto } from './dto/create-ethnicity.dto';
import { UpdateEthnicityDto } from './dto/update-ethnicity.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { QueryParams } from '../common/query-builder/interfaces/query-params.interface';

@ApiTags('ethnicity')
@Controller('ethnicity')
export class EthnicityController {
  constructor(private readonly ethnicityService: EthnicityService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ethnicity' })
  create(@Body() createEthnicityDto: CreateEthnicityDto) {
    return this.ethnicityService.create(createEthnicityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all ethnicities with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'includes', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'filter', required: false, type: Object })
  findAll(@Query() query: QueryParams) {
    return this.ethnicityService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an ethnicity by ID' })
  @ApiQuery({ name: 'includes', required: false, type: String })
  findOne(@Param('id') id: string, @Query() query: QueryParams) {
    return this.ethnicityService.findOne(id, query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an ethnicity by ID' })
  update(
    @Param('id') id: string,
    @Body() updateEthnicityDto: UpdateEthnicityDto,
  ) {
    return this.ethnicityService.update(id, updateEthnicityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an ethnicity by ID' })
  remove(@Param('id') id: string) {
    return this.ethnicityService.remove(id);
  }
}
