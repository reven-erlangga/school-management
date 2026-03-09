import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { QueryBuilderService } from '../../common/query-builder/query-builder.service';
import { PaginationService } from '../../common/query-builder/pagination/pagination.service';
import { Teacher } from './entities/teacher.entity';
import { QueryParams } from '../../common/query-builder/interfaces/query-params.interface';

@Injectable()
export class TeacherService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queryBuilderService: QueryBuilderService,
    private readonly paginationService: PaginationService,
  ) {}

  async findAllByInstitute(instituteId: string, query: QueryParams) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    // Force filter by institute_id
    if (!query.filter) query.filter = {};
    query.filter.institute_id = instituteId;

    const prismaQuery = this.queryBuilderService
      .using('teacher', query)
      .allowedIncludes(Teacher.allowedIncludes)
      .allowedFields(Teacher.allowedFields)
      .allowedSorts(Teacher.allowedSorts)
      .allowedFilters(Teacher.allowedFilters)
      .build();

    return this.paginationService.paginate(
      (this.prisma as any).teacher,
      prismaQuery,
      page,
      limit,
    );
  }
}
