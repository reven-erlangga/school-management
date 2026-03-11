import { Injectable, NotFoundException } from '@nestjs/common';

export type UpdateDelegate<T> = {
  update: (args: {
    where: Record<string, unknown>;
    data: Record<string, unknown>;
  }) => Promise<T>;
};

@Injectable()
export class UpdateService {
  async update<T>(
    delegate: UpdateDelegate<T>,
    where: Record<string, unknown>,
    data: Record<string, unknown>,
    modelName?: string,
  ): Promise<T> {
    try {
      return await delegate.update({ where, data });
    } catch (error) {
      const code =
        error && typeof error === 'object' && 'code' in error
          ? (error as { code?: unknown }).code
          : undefined;
      if (code === 'P2025') {
        throw new NotFoundException(
          `Entity${modelName ? ` in ${modelName}` : ''} not found`,
        );
      }
      throw error;
    }
  }
}
