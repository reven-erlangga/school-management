import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { DemographicsService } from './app.demographics.service';

@Controller()
export class DemographicsController {
  constructor(private readonly service: DemographicsService) {}

  // Genders
  @Get('genders')
  async findAllGenders(@Query() query: any) {
    return this.service.findAll('gender', query);
  }

  @Post('genders')
  async createGender(@Body() data: any) {
    return this.service.create('gender', data);
  }

  @Put('genders/:id')
  async updateGender(@Param('id') id: string, @Body() data: any) {
    return this.service.update('gender', id, data);
  }

  @Delete('genders/:id')
  async removeGender(@Param('id') id: string) {
    return this.service.remove('gender', id);
  }

  // Ethnicities
  @Get('ethnicities')
  async findAllEthnicities(@Query() query: any) {
    return this.service.findAll('ethnicity', query);
  }

  @Post('ethnicities')
  async createEthnicity(@Body() data: any) {
    return this.service.create('ethnicity', data);
  }

  @Put('ethnicities/:id')
  async updateEthnicity(@Param('id') id: string, @Body() data: any) {
    return this.service.update('ethnicity', id, data);
  }

  @Delete('ethnicities/:id')
  async removeEthnicity(@Param('id') id: string) {
    return this.service.remove('ethnicity', id);
  }

  // Religions
  @Get('religions')
  async findAllReligions(@Query() query: any) {
    return this.service.findAll('religion', query);
  }

  @Post('religions')
  async createReligion(@Body() data: any) {
    return this.service.create('religion', data);
  }

  @Put('religions/:id')
  async updateReligion(@Param('id') id: string, @Body() data: any) {
    return this.service.update('religion', id, data);
  }

  @Delete('religions/:id')
  async removeReligion(@Param('id') id: string) {
    return this.service.remove('religion', id);
  }

  // Articles
  @Get('articles')
  async findAllArticles(@Query() query: any) {
    return this.service.findAll('article', query);
  }

  @Post('articles')
  async createArticle(@Body() data: any) {
    return this.service.create('article', data);
  }

  @Put('articles/:id')
  async updateArticle(@Param('id') id: string, @Body() data: any) {
    return this.service.update('article', id, data);
  }

  @Delete('articles/:id')
  async removeArticle(@Param('id') id: string) {
    return this.service.remove('article', id);
  }

  // Article Categories
  @Get('article-categories')
  async findAllArticleCategories(@Query() query: any) {
    return this.service.findAll('articleCategory', query);
  }

  @Post('article-categories')
  async createArticleCategory(@Body() data: any) {
    return this.service.create('articleCategory', data);
  }

  @Put('article-categories/:id')
  async updateArticleCategory(@Param('id') id: string, @Body() data: any) {
    return this.service.update('articleCategory', id, data);
  }

  @Delete('article-categories/:id')
  async removeArticleCategory(@Param('id') id: string) {
    return this.service.remove('articleCategory', id);
  }
}
