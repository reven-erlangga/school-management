import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateGenderDto } from './dto/create-gender.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';
import { QueryBuilderService } from '../common/query-builder/query-builder.service';
import { PaginationService } from '../common/query-builder/pagination/pagination.service';
import { Gender } from './entities/gender.entity';
import { QueryParams } from '../common/query-builder/interfaces/query-params.interface';

@Injectable()
export class GenderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queryBuilderService: QueryBuilderService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createGenderDto: CreateGenderDto) {
    const existing = await (this.prisma as any).gender.findUnique({
      where: { key: createGenderDto.key },
    });

    if (existing) {
      throw new ConflictException(`Gender with key ${createGenderDto.key} already exists`);
    }

    const gender = await (this.prisma as any).gender.create({
      data: {
        key: createGenderDto.key,
        name: JSON.stringify(createGenderDto.name),
        description: createGenderDto.description ? JSON.stringify(createGenderDto.description) : null,
      },
    });

    return {
      ...gender,
      name: JSON.parse(gender.name),
      description: gender.description ? JSON.parse(gender.description) : null,
    };
  }

  async findAll(query: QueryParams) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const prismaQuery = this.queryBuilderService
      .using('gender', query)
      .allowedIncludes(Gender.allowedIncludes)
      .allowedFields(Gender.allowedFields)
      .allowedSorts(Gender.allowedSorts)
      .allowedFilters(Gender.allowedFilters)
      .build();

    const result = await this.paginationService.paginate(
      (this.prisma as any).gender,
      prismaQuery,
      page,
      limit,
    );

    return {
      ...result,
      data: result.data.map((gender: any) => ({
        ...gender,
        name: JSON.parse(gender.name),
        description: gender.description ? JSON.parse(gender.description) : null,
      })),
    };
  }

  async findOne(id: string, query: QueryParams) {
    const prismaQuery = this.queryBuilderService
      .using('gender', query)
      .allowedIncludes(Gender.allowedIncludes)
      .allowedFields(Gender.allowedFields)
      .build();

    const gender = await (this.prisma as any).gender.findUnique({
      where: { id },
      ...prismaQuery,
    });

    if (!gender) {
      throw new NotFoundException(`Gender with ID ${id} not found`);
    }

    return {
      ...gender,
      name: JSON.parse(gender.name),
      description: gender.description ? JSON.parse(gender.description) : null,
    };
  }

  async update(id: string, updateGenderDto: UpdateGenderDto) {
    const gender = await (this.prisma as any).gender.findUnique({
      where: { id },
    });

    if (!gender) {
      throw new NotFoundException(`Gender with ID ${id} not found`);
    }

    const data: any = {};
    if (updateGenderDto.key) data.key = updateGenderDto.key;
    if (updateGenderDto.name) data.name = JSON.stringify(updateGenderDto.name);
    if (updateGenderDto.description) data.description = JSON.stringify(updateGenderDto.description);

    const updated = await (this.prisma as any).gender.update({
      where: { id },
      data,
    });

    return {
      ...updated,
      name: JSON.parse(updated.name),
      description: updated.description ? JSON.parse(updated.description) : null,
    };
  }

  async remove(id: string) {
    const gender = await (this.prisma as any).gender.findUnique({
      where: { id },
    });

    if (!gender) {
      throw new NotFoundException(`Gender with ID ${id} not found`);
    }

    await (this.prisma as any).gender.delete({
      where: { id },
    });

    return { message: `Gender with ID ${id} deleted successfully` };
  }
}
