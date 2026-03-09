import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async findAllTransactions(query: any) {
    const { page = 1, limit = 10, search, category, status, startDate, endDate } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.description = { contains: search };
    }
    if (category) {
      where.category_id = category;
    }
    if (status) {
      where.status = status;
    }
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        include: { category: true },
        orderBy: { date: 'desc' },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    // Calculate summary
    const summary = await this.prisma.transaction.aggregate({
      where,
      _sum: { amount: true },
    });

    return {
      data,
      meta: {
        total,
        page: Number(page),
        last_page: Math.ceil(total / limit),
        summary: summary._sum,
      },
    };
  }

  async findOneTransaction(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: { category: true, invoice: true },
    });
    if (!transaction) throw new NotFoundException('Transaction not found');
    return transaction;
  }

  async findAllInvoices(query: any) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { invoice_no: { contains: search } },
        { client_name: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        include: { transaction: true },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.invoice.count({ where }),
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

  async generateReport(dto: any) {
    // Basic report record creation
    return this.prisma.financeReport.create({
      data: {
        name: dto.name,
        type: dto.type || 'CUSTOM',
        format: dto.format,
        parameters: JSON.stringify(dto.parameters),
        status: 'COMPLETED', // Mocked for now
        file_url: `/reports/mock-report-${Date.now()}.${dto.format.toLowerCase()}`,
      },
    });
  }
}
