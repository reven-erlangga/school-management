import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDto, BannerType } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('banner')
@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create a new banner (General or Institute-specific)',
  })
  create(@Body() createBannerDto: CreateBannerDto) {
    return this.bannerService.create(createBannerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all banners with filters' })
  @ApiQuery({ name: 'type', required: false, enum: BannerType })
  @ApiQuery({ name: 'institute_id', required: false, type: String })
  @ApiQuery({ name: 'is_active', required: false, type: Boolean })
  findAll(
    @Query('type') type?: BannerType,
    @Query('institute_id') institute_id?: string,
    @Query('is_active') is_active?: boolean,
  ) {
    return this.bannerService.findAll({ type, institute_id, is_active });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a banner by ID' })
  findOne(@Param('id') id: string) {
    return this.bannerService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a banner by ID' })
  update(@Param('id') id: string, @Body() updateBannerDto: UpdateBannerDto) {
    return this.bannerService.update(id, updateBannerDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a banner by ID' })
  remove(@Param('id') id: string) {
    return this.bannerService.remove(id);
  }
}
