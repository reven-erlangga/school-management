import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { QueryBuilderService } from '../../common/query-builder/query-builder.service';
import { PaginationService } from '../../common/query-builder/pagination/pagination.service';
import { Staff } from './entities/staff.entity';
import { QueryParams } from '../../common/query-builder/interfaces/query-params.interface';

@Injectable()
export class StaffService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queryBuilderService: QueryBuilderService,
    private readonly paginationService: PaginationService,
  ) {}

  async findAllByInstitute(instituteId: string, query: QueryParams) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const prismaQuery = this.queryBuilderService
      .using('staff', query)
      .allowedIncludes(Staff.allowedIncludes)
      .allowedFields(Staff.allowedFields)
      .allowedSorts(Staff.allowedSorts)
      .allowedFilters(Staff.allowedFilters)
      .build();

    // Force filter by institute_id via many-to-many join table
    if (!prismaQuery.where) prismaQuery.where = {};
    prismaQuery.where.staffInstitutes = {
      some: {
        institute_id: instituteId,
      },
    };

    return this.paginationService.paginate(
      (this.prisma as any).staff,
      prismaQuery,
      page,
      limit,
    );
  }
}
