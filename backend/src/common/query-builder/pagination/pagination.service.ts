import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
  async paginate(model: any, prismaQuery: any, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      model.findMany({
        ...prismaQuery,
        skip,
        take: limit,
      }),
      model.count({
        where: prismaQuery.where,
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }
}
