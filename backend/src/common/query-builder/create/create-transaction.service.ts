import { Injectable } from '@nestjs/common';
import {
  DataSource,
  DeepPartial,
  EntityManager,
  EntityTarget,
  ObjectLiteral,
} from 'typeorm';

export interface CreateTransactionOptions<Dto, Entity extends ObjectLiteral> {
  dto: Dto;
  entity: EntityTarget<Entity>;
  manager?: EntityManager;
  mapper: (dto: Dto) => DeepPartial<Entity>;
  afterSave?: (savedEntity: Entity, manager: EntityManager) => Promise<void>;
}

@Injectable()
export class CreateTransactionService {
  constructor(private readonly dataSource: DataSource) {}

  async create<Dto, Entity extends ObjectLiteral>(
    options: CreateTransactionOptions<Dto, Entity>,
  ): Promise<Entity> {
    const { dto, entity, manager, mapper, afterSave } = options;

    const execute = async (transactionManager: EntityManager) => {
      const repo = transactionManager.getRepository(entity);
      const entityData = mapper(dto);

      // Create entity instance
      const createdEntity = repo.create(entityData);

      // FORCE assignment: repo.create sometimes misses fields if they don't match strict class definitions or are complex types
      Object.assign(createdEntity, entityData);

      const savedEntity = await repo.save(createdEntity);

      if (afterSave) {
        await afterSave(savedEntity, transactionManager);
      }

      return savedEntity;
    };

    if (manager) {
      return execute(manager);
    }

    return this.dataSource.transaction(execute);
  }
}
