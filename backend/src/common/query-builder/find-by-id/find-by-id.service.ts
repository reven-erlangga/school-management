import { Injectable, NotFoundException } from '@nestjs/common';

export type FindUniqueDelegate<T> = {
  findUnique: (args: { where: Record<string, unknown> }) => Promise<T | null>;
};

@Injectable()
export class FindByIdService {
  async findById<T>(
    delegate: FindUniqueDelegate<T>,
    where: Record<string, unknown>,
    modelName?: string,
  ): Promise<T> {
    const entity = await delegate.findUnique({ where });

    if (!entity) {
      throw new NotFoundException(
        `Entity${modelName ? ` in ${modelName}` : ''} not found`,
      );
    }

    return entity;
  }
}
