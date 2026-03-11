import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';

export type UpsertDelegate<T> = {
  upsert: (args: {
    where: Record<string, unknown>;
    create: Record<string, unknown>;
    update: Record<string, unknown>;
  }) => Promise<T>;
};

@Injectable()
export class UpsertService {
  private readonly logger = new Logger(UpsertService.name);

  async upsert<T>(
    delegate: UpsertDelegate<T>,
    where: Record<string, unknown>,
    data: Record<string, unknown>,
    modelName?: string,
  ): Promise<T> {
    try {
      this.logger.log(
        `Upserting${modelName ? ` in ${modelName}` : ''} with where keys: ${Object.keys(where).join(', ')}`,
      );

      const saved = await delegate.upsert({
        where,
        create: data,
        update: data,
      });
      return saved;
    } catch (error) {
      this.logger.error(
        `Error upserting${modelName ? ` in ${modelName}` : ''}: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
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
