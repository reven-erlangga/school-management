import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { QueryBuilderService } from '../common/query-builder/query-builder.service';
import { PaginationService } from '../common/query-builder/pagination/pagination.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private queryBuilder: QueryBuilderService,
    private pagination: PaginationService,
  ) {}

  async findAll(query: any) {
    const { page = 1, limit = 10 } = query;

    const prismaQuery = this.queryBuilder
      .using('user', query)
      .allowedFilters(['username', 'email', 'status'])
      .allowedSorts(['username', 'created_at'])
      .allowedFields(['id', 'username', 'email', 'created_at'])
      .build();

    // Custom search logic if provided
    if (query.search) {
      prismaQuery.where = {
        ...prismaQuery.where,
        OR: [
          { username: { contains: query.search, mode: 'insensitive' } },
          { email: { contains: query.search, mode: 'insensitive' } },
        ],
      };
    }

    return this.pagination.paginate(
      (this.prisma as any).user,
      prismaQuery,
      Number(page),
      Number(limit),
    );
  }
}
