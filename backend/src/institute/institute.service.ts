import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateInstituteDto } from './dto/create-institute.dto';
import { QueryBuilderService } from '../common/query-builder/query-builder.service';
import { PaginationService } from '../common/query-builder/pagination/pagination.service';
import { Institute } from './entities/institute.entity';
import { QueryParams } from '../common/query-builder/interfaces/query-params.interface';

@Injectable()
export class InstituteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queryBuilderService: QueryBuilderService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createInstituteDto: CreateInstituteDto) {
    const { 
      accountType, 
      existingAdminId, 
      adminFullName, 
      adminEmail, 
      adminPhone,
      ...instituteData 
    } = createInstituteDto;

    let adminId = existingAdminId;

    // Logic for creating a new admin if needed
    if (accountType === 'new') {
      const newUser = await (this.prisma as any).user.create({
        data: {
          username: adminEmail,
          password: 'password', // Default password
          // In a real app, you'd store more profile info here or in a separate Profile table
        },
      });
      adminId = newUser.id;
    }

    return await (this.prisma as any).institute.create({
      data: {
        name: instituteData.name,
        description: instituteData.description,
        address: instituteData.address,
        type: instituteData.type || 'school',
        status: 'active',
        admin_id: adminId,
      },
    });
  }

  async findAll(query: QueryParams) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const prismaQuery = this.queryBuilderService
      .using('institute', query)
      .allowedIncludes(Institute.allowedIncludes)
      .allowedFields(Institute.allowedFields)
      .allowedSorts(Institute.allowedSorts)
      .allowedFilters(Institute.allowedFilters)
      .build();

    const result = await this.paginationService.paginate(
      (this.prisma as any).institute,
      prismaQuery,
      page,
      limit,
    );

    // Enhance items with admin names if possible
    const enhancedData = await Promise.all(result.data.map(async (item: any) => {
      let adminName = 'Not assigned';
      if (item.admin_id) {
        const user = await (this.prisma as any).user.findUnique({
          where: { id: item.admin_id },
          select: { username: true }
        });
        if (user) adminName = user.username;
      }
      return { ...item, admin_name: adminName };
    }));

    return {
      ...result,
      data: enhancedData,
    };
  }

  async findOne(id: string, query: QueryParams) {
    const prismaQuery = this.queryBuilderService
      .using('institute', query)
      .allowedIncludes(Institute.allowedIncludes)
      .allowedFields(Institute.allowedFields)
      .build();

    const institute = await (this.prisma as any).institute.findUnique({
      where: { id },
      ...prismaQuery,
    });

    if (!institute) {
      throw new NotFoundException(`Institute with ID ${id} not found`);
    }

    let adminName = 'Not assigned';
    if (institute.admin_id) {
      const user = await (this.prisma as any).user.findUnique({
        where: { id: institute.admin_id },
        select: { username: true }
      });
      if (user) adminName = user.username;
    }

    return { ...institute, admin_name: adminName };
  }

  async update(id: string, updateInstituteDto: any) {
    const institute = await (this.prisma as any).institute.findUnique({
      where: { id },
    });

    if (!institute) {
      throw new NotFoundException(`Institute with ID ${id} not found`);
    }

    return await (this.prisma as any).institute.update({
      where: { id },
      data: updateInstituteDto,
    });
  }

  async remove(id: string) {
    const institute = await (this.prisma as any).institute.findUnique({
      where: { id },
    });

    if (!institute) {
      throw new NotFoundException(`Institute with ID ${id} not found`);
    }

    await (this.prisma as any).institute.delete({
      where: { id },
    });

    return { message: `Institute with ID ${id} deleted successfully` };
  }
}
