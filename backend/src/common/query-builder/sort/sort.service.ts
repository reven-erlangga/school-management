import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';
import { QueryParams } from '../interfaces/query-params.interface';

@Injectable()
export class SortService {
  apply<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    query: QueryParams,
    sorts: string[],
  ): void {
    if (!query.sort) {
      return;
    }

    const sortParams = query.sort.split(',');
    const alias = queryBuilder.alias;

    sortParams.forEach((param) => {
      const direction = param.startsWith('-') ? 'DESC' : 'ASC';
      const field = param.startsWith('-') ? param.substring(1) : param;

      if (sorts.includes(field)) {
        queryBuilder.addOrderBy(`${alias}.${field}`, direction);
      }
    });
  }
}
