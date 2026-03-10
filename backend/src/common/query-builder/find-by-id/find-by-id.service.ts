import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, ObjectLiteral, FindOptionsWhere } from 'typeorm';

@Injectable()
export class FindByIdService {
  async findById<T extends ObjectLiteral>(
    repository: Repository<T>,
    id: string | number,
  ): Promise<T> {
    const entity = await repository.findOne({
      where: { id } as unknown as FindOptionsWhere<T>,
    });

    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }

    return entity;
  }
}
