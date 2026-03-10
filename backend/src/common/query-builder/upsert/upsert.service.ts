import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository, ObjectLiteral, FindOptionsWhere } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class UpsertService {
  private readonly logger = new Logger(UpsertService.name);

  async upsert<T extends ObjectLiteral>(
    repository: Repository<T>,
    data: QueryDeepPartialEntity<T>,
    conflictPaths: string[],
  ): Promise<T> {
    try {
      this.logger.log(
        `Upserting entity in ${repository.metadata.tableName} with conflict paths: ${conflictPaths.join(', ')}`,
      );

      // Construct where condition from conflict paths
      const whereCondition: FindOptionsWhere<T> = {};
      for (const path of conflictPaths) {
        if (path in data) {
          (whereCondition as unknown as Record<string, unknown>)[path] = (
            data as Record<string, unknown>
          )[path];
        }
      }

      // Check if entity exists
      const existingEntity = await repository.findOne({
        where: whereCondition,
      });

      if (existingEntity) {
        this.logger.log(
          `Entity found in ${repository.metadata.tableName}, updating...`,
        );
        // Update existing entity
        const mergedEntity = repository.merge(
          existingEntity,
          data as unknown as T,
        );
        const savedEntity = await repository.save(mergedEntity);
        return savedEntity;
      }

      this.logger.log(
        `Entity not found in ${repository.metadata.tableName}, creating...`,
      );
      // Create new entity
      const newEntity = repository.create(data as unknown as T);
      const savedEntity = await repository.save(newEntity);
      return savedEntity;
    } catch (error) {
      this.logger.error(
        `Error upserting entity in ${repository.metadata.tableName}: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
        error instanceof Error ? error.stack : undefined,
      );

      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Upsert operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
