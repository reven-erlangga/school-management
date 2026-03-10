import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';
import { QueryParams } from '../interfaces/query-params.interface';

@Injectable()
export class IncludeService {
  apply<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    query: QueryParams,
    includes: string[],
  ): void {
    if (!query.includes) {
      return;
    }

    const requestedIncludes = query.includes.split(',');
    const mainAlias = queryBuilder.alias;

    requestedIncludes.forEach((inc) => {
      const trimmed = inc.trim();
      if (!trimmed) {
        return;
      }

      const camelInclude = trimmed
        .split('.')
        .map((part) =>
          part.replace(/_([a-zA-Z0-9])/g, (_, c: string) => c.toUpperCase()),
        )
        .join('.');

      if (includes.includes(camelInclude)) {
        const parts = camelInclude.split('.');
        let currentAlias = mainAlias;

        parts.forEach((part) => {
          const relation = `${currentAlias}.${part}`;
          const alias = part;
          const uniqueAlias = alias;

          const hasAlias = queryBuilder.expressionMap.aliases.some(
            (a) => a.name === uniqueAlias,
          );

          if (!hasAlias) {
            // Use leftJoin to allow sparse field selection later
            queryBuilder.leftJoin(relation, uniqueAlias);
          }

          currentAlias = uniqueAlias;
        });
      }
    });
  }
}
