import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder, ObjectLiteral, Brackets } from 'typeorm';
import { CursorPaginationResult } from '../interfaces/pagination.interface';
import { QueryParams } from '../interfaces/query-params.interface';

@Injectable()
export class CursorPaginateService {
  async paginate<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    query: QueryParams,
    limit: number = 15,
    cursor?: string,
  ): Promise<CursorPaginationResult<T>> {
    const l = limit < 1 ? 15 : limit;
    const alias = queryBuilder.alias;
    let sortField = 'created_at';
    let sortDirection: 'ASC' | 'DESC' = 'DESC';

    if (query.sort) {
      const sortParams = query.sort.split(',');
      const firstSort = sortParams[0];
      sortDirection = firstSort.startsWith('-') ? 'DESC' : 'ASC';
      sortField = firstSort.startsWith('-')
        ? firstSort.substring(1)
        : firstSort;
    } else {
      queryBuilder.addOrderBy(`${alias}.created_at`, 'DESC');
    }

    queryBuilder.addOrderBy(`${alias}.id`, sortDirection);

    if (cursor) {
      try {
        const decoded = JSON.parse(
          Buffer.from(cursor, 'base64').toString('utf-8'),
        ) as { value: unknown; id: unknown };
        const cursorValue = decoded.value;
        const cursorId = decoded.id;
        const operator = sortDirection === 'DESC' ? '<' : '>';

        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where(`${alias}.${sortField} ${operator} :cursorValue`, {
              cursorValue,
            }).orWhere(
              new Brackets((subQb) => {
                subQb
                  .where(`${alias}.${sortField} = :cursorValue`, {
                    cursorValue,
                  })
                  .andWhere(`${alias}.id ${operator} :cursorId`, { cursorId });
              }),
            );
          }),
        );
      } catch {
        // Ignore
      }
    }

    queryBuilder.take(l + 1);

    const data = await queryBuilder.getMany();
    let nextCursor: string | null = null;

    if (data.length > l) {
      const nextItem = data[l - 1];
      data.pop();
      const value = nextItem[sortField] as unknown;
      const id = nextItem['id'] as unknown;
      nextCursor = Buffer.from(JSON.stringify({ value, id })).toString(
        'base64',
      );
    }

    return {
      data,
      meta: {
        perPage: Number(l),
        nextCursor: nextCursor,
      },
    };
  }
}
