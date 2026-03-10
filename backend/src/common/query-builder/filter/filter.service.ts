import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder, ObjectLiteral, Brackets } from 'typeorm';
import { QueryParams } from '../interfaces/query-params.interface';

@Injectable()
export class FilterService {
  apply<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    query: QueryParams,
    filters: string[],
  ): void {
    this.normalizeFilter(query);

    if (!query.filter) {
      return;
    }
    const alias = queryBuilder.alias;
    const metadata = queryBuilder.expressionMap.mainAlias?.metadata;

    Object.keys(query.filter).forEach((key) => {
      if (filters.includes(key)) {
        const value = query.filter![key] as unknown;
        const column = metadata?.findColumnWithPropertyName(key);
        const isJson =
          column && (column.type === 'json' || column.type === 'jsonb');
        if (isJson) {
          const values =
            typeof value === 'string' ? value.split(',') : [value as string];
          queryBuilder.andWhere(
            new Brackets((qb) => {
              values.forEach((v, i) => {
                const paramName = `${key}_regex_${i}`;
                qb.orWhere(
                  `EXISTS (
                        SELECT 1 
                        FROM jsonb_each_text(${alias}.${key}) 
                        WHERE value ~* :${paramName}
                    )`,
                  { [paramName]: `^${v}` },
                );
              });
            }),
          );
        } else if (typeof value === 'string' && value.includes(',')) {
          const values = value.split(',');
          queryBuilder.andWhere(`${alias}.${key} IN (:...${key})`, {
            [key]: values,
          });
        } else {
          queryBuilder.andWhere(`${alias}.${key} = :${key}`, {
            [key]: value,
          });
        }
      }
    });
  }

  private normalizeFilter(query: QueryParams): void {
    if (!query.filter) {
      query.filter = {};
      Object.keys(query).forEach((key) => {
        const match = key.match(/^filter\[(.*?)\]$/);
        if (match) {
          query.filter![match[1]] = query[key] as unknown;
        }
      });
      if (Object.keys(query.filter).length === 0) {
        delete query.filter;
      }
    }
  }
}
