import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, ObjectLiteral, FindOptionsWhere } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { transformKeysToSnakeCase } from '../../utils/transform.util';

@Injectable()
export class UpdateService {
  async update<T extends ObjectLiteral>(
    repository: Repository<T>,
    id: string | number,
    data: QueryDeepPartialEntity<T>,
  ): Promise<T> {
    const transformedData = transformKeysToSnakeCase<Record<string, any>>(
      data as Record<string, any>,
    );

    const result = await repository
      .createQueryBuilder()
      .update()
      .set(transformedData)
      .where('id = :id', { id })
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }

    const entity = await repository.findOne({
      where: { id } as unknown as FindOptionsWhere<T>,
    });
    if (!entity) {
      throw new NotFoundException(
        `Entity with ID ${id} not found after update`,
      );
    }
    return entity;
  }
}
