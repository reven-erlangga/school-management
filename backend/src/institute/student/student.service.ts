import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { QueryBuilderService } from '../../common/query-builder/query-builder.service';
import { PaginationService } from '../../common/query-builder/pagination/pagination.service';
import { Student } from './entities/student.entity';
import { QueryParams } from '../../common/query-builder/interfaces/query-params.interface';

@Injectable()
export class StudentService {
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
      .using('student', query)
      .allowedIncludes(Student.allowedIncludes)
      .allowedFields(Student.allowedFields)
      .allowedSorts(Student.allowedSorts)
      .allowedFilters(Student.allowedFilters)
      .build();

    return this.paginationService.paginate(
      (this.prisma as any).student,
      prismaQuery,
      page,
      limit,
    );
  }
}
