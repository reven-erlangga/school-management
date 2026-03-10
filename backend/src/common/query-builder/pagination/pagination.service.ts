import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
  async paginate(
    model: any,
    prismaQuery: any,
    page: number = 1,
    limit: number = 10,
  ) {
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

  async cursorPaginate(
    model: any,
    prismaQuery: any,
    limit: number = 20,
    cursor?: string,
  ) {
    const take = limit + 1;

    const results = await model.findMany({
      ...prismaQuery,
      take,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const hasNext = results.length > limit;
    const data = hasNext ? results.slice(0, limit) : results;
    const next_cursor =
      hasNext && data.length > 0 ? data[data.length - 1].id : null;

    return {
      data,
      meta: {
        next_cursor,
        limit,
      },
    };
  }
}
