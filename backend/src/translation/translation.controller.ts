import { Controller, Get, Param, Headers, Req } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { ApiTags, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { toResponse } from '../common/query-builder/interfaces/response.interface';

@ApiTags('Translations')
@Controller('translations')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Get('languages')
  @ApiOperation({ summary: 'Get available languages' })
  @ApiHeader({
    name: 'X-App-Type',
    description: 'Application type (portal/landing)',
    required: false,
  })
  async getLanguages(@Headers('X-App-Type') appType: string = 'landing') {
    const languages = await this.translationService.getLanguages(appType);
    return toResponse(languages);
  }

  @Get(':lang')
  @ApiOperation({ summary: 'Get translations for a language' })
  @ApiHeader({
    name: 'X-App-Type',
    description: 'Application type (portal/landing)',
    required: false,
  })
  async getTranslations(
    @Param('lang') lang: string,
    @Headers('X-App-Type') appType: string = 'landing'
  ) {
    const translations = await this.translationService.getTranslations(lang, appType);
    return toResponse(translations);
  }
}
