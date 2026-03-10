import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateStreamDto, UpdateStreamDto } from './dto/create-stream.dto';

@Injectable()
export class StreamService {
  constructor(private prisma: PrismaService) {}

  async create(createStreamDto: CreateStreamDto) {
    return await (this.prisma as any).stream.create({
      data: createStreamDto,
    });
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    name?: string;
    institute_id?: string;
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.name) {
      where.name = { contains: query.name };
    }
    if (query.institute_id) {
      where.institute_id = query.institute_id;
    }

    const [items, total] = await Promise.all([
      (this.prisma as any).stream.findMany({
        where,
        skip,
        take: limit,
        include: { institute: true },
        orderBy: { created_at: 'desc' },
      }),
      (this.prisma as any).stream.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const stream = await (this.prisma as any).stream.findUnique({
      where: { id },
      include: { institute: true },
    });
    if (!stream) {
      throw new NotFoundException(`Stream with ID ${id} not found`);
    }
    return stream;
  }

  async update(id: string, updateStreamDto: UpdateStreamDto) {
    await this.findOne(id);
    return await (this.prisma as any).stream.update({
      where: { id },
      data: updateStreamDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return await (this.prisma as any).stream.delete({
      where: { id },
    });
  }
}
