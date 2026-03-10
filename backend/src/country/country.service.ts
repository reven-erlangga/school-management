import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { QueryBuilderService } from '../common/query-builder/query-builder.service';
import {
  CountryDropdownQueryDto,
  CountryFindAllQueryDto,
} from './dto/country-query.dto';

@Injectable()
export class CountryService {
  private static readonly allowedIncludes = ['states', 'states.cities'];
  private static readonly allowedFields = [
    'id',
    'name',
    'iso3',
    'iso2',
    'phone_code',
    'capital',
    'currency',
    'currency_symbol',
    'tld',
    'native',
    'region',
    'subregion',
    'timezones',
    'translations',
    'latitude',
    'longitude',
    'emoji',
    'emojiU',
    'created_at',
    'updated_at',
  ];
  private static readonly allowedSorts = ['name', 'iso3', 'iso2', 'region'];
  private static readonly allowedFilters = [
    'name',
    'iso3',
    'iso2',
    'region',
    'subregion',
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QueryBuilderService,
  ) {}

  async findAll(query: CountryFindAllQueryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    return this.qb
      .using('country', query)
      .allowedIncludes(CountryService.allowedIncludes)
      .allowedFields(CountryService.allowedFields)
      .allowedSorts(CountryService.allowedSorts)
      .allowedFilters(CountryService.allowedFilters)
      .paginate(page, limit);
  }

  async findOne(id: string) {
    const country = await this.qb
      .using('country', {})
      .allowedIncludes(CountryService.allowedIncludes)
      .include(['states', 'states.cities'])
      .findById(id);

    if (!country) {
      throw new NotFoundException('Country not found');
    }

    return country;
  }

  async dropdown(query: CountryDropdownQueryDto) {
    const limit = Number(query.limit) || 20;

    return this.qb
      .using('country', {})
      .allowedFields(['id', 'name', 'iso3'])
      .allowedSorts(['name'])
      .allowedFilters(['name'])
      .field(['id', 'name', 'iso3'])
      .sort('name')
      .filter(
        query.search
          ? { name: { contains: query.search, mode: 'insensitive' } }
          : {},
      )
      .cursorPaginate(limit, query.cursor);
  }
}
