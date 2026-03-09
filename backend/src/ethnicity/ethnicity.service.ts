import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateEthnicityDto } from './dto/create-ethnicity.dto';
import { UpdateEthnicityDto } from './dto/update-ethnicity.dto';
import { QueryBuilderService } from '../common/query-builder/query-builder.service';
import { PaginationService } from '../common/query-builder/pagination/pagination.service';
import { Ethnicity } from './entities/ethnicity.entity';
import { QueryParams } from '../common/query-builder/interfaces/query-params.interface';

@Injectable()
export class EthnicityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queryBuilderService: QueryBuilderService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createEthnicityDto: CreateEthnicityDto) {
    const existing = await (this.prisma as any).ethnicity.findUnique({
      where: { key: createEthnicityDto.key },
    });

    if (existing) {
      throw new ConflictException(`Ethnicity with key ${createEthnicityDto.key} already exists`);
    }

    return (this.prisma as any).ethnicity.create({
      data: createEthnicityDto,
    });
  }

  async findAll(query: QueryParams) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const prismaQuery = this.queryBuilderService
      .using('ethnicity', query)
      .allowedIncludes(Ethnicity.allowedIncludes)
      .allowedFields(Ethnicity.allowedFields)
      .allowedSorts(Ethnicity.allowedSorts)
      .allowedFilters(Ethnicity.allowedFilters)
      .build();

    return this.paginationService.paginate(
      (this.prisma as any).ethnicity,
      prismaQuery,
      page,
      limit,
    );
  }

  async findOne(id: string, query: QueryParams) {
    const prismaQuery = this.queryBuilderService
      .using('ethnicity', query)
      .allowedIncludes(Ethnicity.allowedIncludes)
      .allowedFields(Ethnicity.allowedFields)
      .build();

    const ethnicity = await (this.prisma as any).ethnicity.findUnique({
      where: { id },
      ...prismaQuery,
    });

    if (!ethnicity) {
      throw new NotFoundException(`Ethnicity with ID ${id} not found`);
    }

    return ethnicity;
  }

  async update(id: string, updateEthnicityDto: UpdateEthnicityDto) {
    const ethnicity = await (this.prisma as any).ethnicity.findUnique({
      where: { id },
    });

    if (!ethnicity) {
      throw new NotFoundException(`Ethnicity with ID ${id} not found`);
    }

    return (this.prisma as any).ethnicity.update({
      where: { id },
      data: updateEthnicityDto,
    });
  }

  async remove(id: string) {
    const ethnicity = await (this.prisma as any).ethnicity.findUnique({
      where: { id },
    });

    if (!ethnicity) {
      throw new NotFoundException(`Ethnicity with ID ${id} not found`);
    }

    await (this.prisma as any).ethnicity.delete({
      where: { id },
    });

    return { message: `Ethnicity with ID ${id} deleted successfully` };
  }
}
