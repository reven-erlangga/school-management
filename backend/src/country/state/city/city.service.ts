import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { QueryBuilderService } from '../../../common/query-builder/query-builder.service';
import { PaginationService } from '../../../common/query-builder/pagination/pagination.service';
import {
  CityDropdownQueryDto,
  CityFindAllQueryDto,
} from './dto/city-query.dto';

@Injectable()
export class CityService {
  private static readonly allowedIncludes = ['state', 'state.country'];
  private static readonly allowedFields = [
    'id',
    'name',
    'latitude',
    'longitude',
    'state_id',
    'created_at',
    'updated_at',
  ];
  private static readonly allowedSorts = ['name', 'created_at'];
  private static readonly allowedFilters = ['name', 'state'];

  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QueryBuilderService,
    private readonly pagination: PaginationService,
  ) {}

  async findAll(query: CityFindAllQueryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    if (!query.filter) query.filter = {};
    query.filter.state = { state_code: query.state_code };

    const prismaQuery = this.qb
      .using('city', query)
      .allowedIncludes(CityService.allowedIncludes)
      .allowedFields(CityService.allowedFields)
      .allowedSorts(CityService.allowedSorts)
      .allowedFilters(CityService.allowedFilters)
      .build();

    return this.pagination.paginate(
      (this.prisma as any).city,
      prismaQuery,
      page,
      limit,
    );
  }

  async findOne(id: string) {
    const city = await (this.prisma as any).city.findUnique({
      where: { id },
      include: {
        state: {
          include: { country: true },
        },
      },
    });

    if (!city) {
      throw new NotFoundException('City not found');
    }

    return city;
  }

  async dropdown(query: CityDropdownQueryDto) {
    const limit = Number(query.limit) || 20;

    const prismaQuery: any = {
      where: {
        state: { state_code: query.state_code },
      },
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    };

    if (query.search) {
      prismaQuery.where.name = { contains: query.search, mode: 'insensitive' };
    }

    return this.pagination.cursorPaginate(
      (this.prisma as any).city,
      prismaQuery,
      limit,
      query.cursor,
    );
  }
}
