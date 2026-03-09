import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { QueryBuilderService } from '../common/query-builder/query-builder.service';
import { PaginationService } from '../common/query-builder/pagination/pagination.service';
import { CreateUnitDto, UpdateUnitDto } from './dto/create-unit.dto';

@Injectable()
export class UnitService {
  constructor(
    private prisma: PrismaService,
    private queryBuilder: QueryBuilderService,
    private pagination: PaginationService,
  ) {}

  async create(createUnitDto: CreateUnitDto) {
    return await (this.prisma as any).unit.create({
      data: createUnitDto,
    });
  }

  async findAll(query: any) {
    const { page = 1, limit = 10 } = query;

    const prismaQuery = this.queryBuilder
      .using('unit', query)
      .allowedFilters(['name', 'institute_id', 'status'])
      .allowedSorts(['name', 'created_at'])
      .allowedIncludes(['institute'])
      .build();

    if (query.search) {
      prismaQuery.where = {
        ...prismaQuery.where,
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
        ],
      };
    }

    return this.pagination.paginate(
      (this.prisma as any).unit,
      prismaQuery,
      Number(page),
      Number(limit),
    );
  }

  async findOne(id: string) {
    const unit = await (this.prisma as any).unit.findUnique({
      where: { id },
      include: { institute: true },
    });
    if (!unit) {
      throw new NotFoundException(`Unit with ID ${id} not found`);
    }
    return unit;
  }

  async update(id: string, updateUnitDto: UpdateUnitDto) {
    await this.findOne(id);
    return await (this.prisma as any).unit.update({
      where: { id },
      data: updateUnitDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return await (this.prisma as any).unit.delete({
      where: { id },
    });
  }
}
