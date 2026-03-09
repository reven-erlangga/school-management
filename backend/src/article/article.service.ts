import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from '../common/prisma/prisma.service';
import { QueryBuilderService } from '../common/query-builder/query-builder.service';
import { PaginationService } from '../common/query-builder/pagination/pagination.service';

@Injectable()
export class ArticleService {
  constructor(
    private prisma: PrismaService,
    private queryBuilder: QueryBuilderService,
    private pagination: PaginationService,
  ) {}

  create(createArticleDto: CreateArticleDto) {
    return 'This action adds a new article';
  }

  findAll(query: any) {
    const { page = 1, limit = 10 } = query;

    const prismaQuery = this.queryBuilder
      .using('article', query)
      .allowedFilters(['title', 'status', 'category_id'])
      .allowedSorts(['title', 'created_at'])
      .allowedIncludes(['category', 'author'])
      .build();

    if (query.search) {
      prismaQuery.where = {
        ...prismaQuery.where,
        OR: [
          { title: { contains: query.search, mode: 'insensitive' } },
          { content: { contains: query.search, mode: 'insensitive' } },
        ],
      };
    }

    return this.pagination.paginate(
      (this.prisma as any).article,
      prismaQuery,
      Number(page),
      Number(limit),
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
