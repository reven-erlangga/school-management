import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateReligionDto } from './dto/create-religion.dto';
import { UpdateReligionDto } from './dto/update-religion.dto';
import { QueryBuilderService } from '../common/query-builder/query-builder.service';
import { PaginationService } from '../common/query-builder/pagination/pagination.service';
import { Religion } from './entities/religion.entity';
import { QueryParams } from '../common/query-builder/interfaces/query-params.interface';

@Injectable()
export class ReligionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queryBuilderService: QueryBuilderService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createReligionDto: CreateReligionDto) {
    const existing = await (this.prisma as any).religion.findUnique({
      where: { key: createReligionDto.key },
    });

    if (existing) {
      throw new ConflictException(`Religion with key ${createReligionDto.key} already exists`);
    }

    return (this.prisma as any).religion.create({
      data: createReligionDto,
    });
  }

  async findAll(query: QueryParams) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const prismaQuery = this.queryBuilderService
      .using('religion', query)
      .allowedIncludes(Religion.allowedIncludes)
      .allowedFields(Religion.allowedFields)
      .allowedSorts(Religion.allowedSorts)
      .allowedFilters(Religion.allowedFilters)
      .build();

    return this.paginationService.paginate(
      (this.prisma as any).religion,
      prismaQuery,
      page,
      limit,
    );
  }

  async findOne(id: string, query: QueryParams) {
    const prismaQuery = this.queryBuilderService
      .using('religion', query)
      .allowedIncludes(Religion.allowedIncludes)
      .allowedFields(Religion.allowedFields)
      .build();

    const religion = await (this.prisma as any).religion.findUnique({
      where: { id },
      ...prismaQuery,
    });

    if (!religion) {
      throw new NotFoundException(`Religion with ID ${id} not found`);
    }

    return religion;
  }

  async update(id: string, updateReligionDto: UpdateReligionDto) {
    const religion = await (this.prisma as any).religion.findUnique({
      where: { id },
    });

    if (!religion) {
      throw new NotFoundException(`Religion with ID ${id} not found`);
    }

    return (this.prisma as any).religion.update({
      where: { id },
      data: updateReligionDto,
    });
  }

  async remove(id: string) {
    const religion = await (this.prisma as any).religion.findUnique({
      where: { id },
    });

    if (!religion) {
      throw new NotFoundException(`Religion with ID ${id} not found`);
    }

    await (this.prisma as any).religion.delete({
      where: { id },
    });

    return { message: `Religion with ID ${id} deleted successfully` };
  }
}
