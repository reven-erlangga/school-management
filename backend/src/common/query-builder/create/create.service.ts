import { Injectable } from '@nestjs/common';
import {
  Repository,
  ObjectLiteral,
  DeepPartial,
  FindOptionsWhere,
} from 'typeorm';
import { transformKeysToSnakeCase } from '../../utils/transform.util';

@Injectable()
export class CreateService {
  async create<T extends ObjectLiteral>(
    repository: Repository<T>,
    data: DeepPartial<T>,
  ): Promise<T> {
    const transformedData = transformKeysToSnakeCase<Record<string, any>>(
      data as Record<string, any>,
    );
    const result = await repository
      .createQueryBuilder()
      .insert()
      .values(transformedData)
      .execute();

    const id = result.identifiers[0];
    if (id) {
      const entity = await repository.findOne({
        where: id as unknown as FindOptionsWhere<T>,
      });
      if (entity) {
        return entity;
      }
    }
    // Fallback or throw error if creation failed to return ID
    throw new Error('Failed to create entity');
  }
}
