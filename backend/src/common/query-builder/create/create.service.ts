import { Injectable } from '@nestjs/common';

export type CreateDelegate<T> = {
  create: (args: { data: Record<string, unknown> }) => Promise<T>;
};

@Injectable()
export class CreateService {
  async create<T>(
    delegate: CreateDelegate<T>,
    data: Record<string, unknown>,
  ): Promise<T> {
    if (!delegate) {
      throw new Error('Model delegate is required');
    }
    return delegate.create({ data });
  }
}
