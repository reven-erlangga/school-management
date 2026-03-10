import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { QueryBuilderService } from '../../common/query-builder/query-builder.service';
import { PaginationService } from '../../common/query-builder/pagination/pagination.service';
import {
  StateDropdownQueryDto,
  StateFindAllQueryDto,
} from './dto/state-query.dto';

@Injectable()
export class StateService {
  private static readonly allowedIncludes = ['country', 'cities'];
  private static readonly allowedFields = [
    'id',
    'name',
    'state_code',
    'latitude',
    'longitude',
    'country_id',
    'created_at',
    'updated_at',
  ];
  private static readonly allowedSorts = ['name', 'state_code', 'created_at'];
  private static readonly allowedFilters = ['name', 'state_code', 'country'];

  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QueryBuilderService,
    private readonly pagination: PaginationService,
  ) {}

  async findAll(query: StateFindAllQueryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    if (!query.filter) query.filter = {};
    query.filter.country = { iso3: query.iso3 };

    const prismaQuery = this.qb
      .using('state', query)
      .allowedIncludes(StateService.allowedIncludes)
      .allowedFields(StateService.allowedFields)
      .allowedSorts(StateService.allowedSorts)
      .allowedFilters(StateService.allowedFilters)
      .build();

    return this.pagination.paginate(
      (this.prisma as any).state,
      prismaQuery,
      page,
      limit,
    );
  }

  async findOne(id: string) {
    const state = await (this.prisma as any).state.findUnique({
      where: { id },
      include: {
        country: true,
        cities: true,
      },
    });

    if (!state) {
      throw new NotFoundException('State not found');
    }

    return state;
  }

  async dropdown(query: StateDropdownQueryDto) {
    const limit = Number(query.limit) || 20;

    const prismaQuery: any = {
      where: {
        country: { iso3: query.iso3 },
      },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, state_code: true },
    };

    if (query.search) {
      prismaQuery.where.name = { contains: query.search, mode: 'insensitive' };
    }

    return this.pagination.cursorPaginate(
      (this.prisma as any).state,
      prismaQuery,
      limit,
      query.cursor,
    );
  }
}
