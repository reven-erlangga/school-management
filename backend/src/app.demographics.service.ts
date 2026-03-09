import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './common/prisma/prisma.service';

@Injectable()
export class DemographicsService {
  constructor(private prisma: PrismaService) {}

  async findAll(model: string, query: any) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      if (model === 'article') {
        where.title = { contains: search };
      } else {
        where.name = { contains: search };
      }
    }

    const [data, total] = await Promise.all([
      (this.prisma as any)[model].findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        orderBy: model === 'article' ? { title: 'asc' } : { name: 'asc' },
      }),
      (this.prisma as any)[model].count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page: Number(page),
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async create(model: string, data: any) {
    return (this.prisma as any)[model].create({
      data,
    });
  }

  async update(model: string, id: string, data: any) {
    return (this.prisma as any)[model].update({
      where: { id },
      data,
    });
  }

  async remove(model: string, id: string) {
    return (this.prisma as any)[model].delete({
      where: { id },
    });
  }
}
