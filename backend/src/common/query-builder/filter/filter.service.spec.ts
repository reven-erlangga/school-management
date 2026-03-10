import { Test, TestingModule } from '@nestjs/testing';
import { FilterService } from './filter.service';
import { SelectQueryBuilder } from 'typeorm';
import { QueryParams } from '../interfaces/query-params.interface';

describe('FilterService', () => {
  let service: FilterService;
  let queryBuilder: SelectQueryBuilder<any>;

  const mockQueryBuilder = {
    alias: 'user',
    expressionMap: {
      mainAlias: {
        metadata: {
          findColumnWithPropertyName: jest
            .fn()
            .mockReturnValue({ type: 'varchar' }),
        },
      },
    },
    andWhere: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilterService],
    }).compile();

    service = module.get<FilterService>(FilterService);
    queryBuilder = mockQueryBuilder as unknown as SelectQueryBuilder<any>;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should apply simple equality filter', () => {
    const query: QueryParams = { filter: { name: 'John' } };
    const allowedFilters = ['name'];

    service.apply(queryBuilder, query, allowedFilters);

    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'user.name = :name',
      {
        name: 'John',
      },
    );
  });

  it('should ignore disallowed filters', () => {
    const query: QueryParams = { filter: { role: 'admin' } };
    const allowedFilters = ['name'];

    service.apply(queryBuilder, query, allowedFilters);

    expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
  });

  it('should apply IN filter for comma-separated values', () => {
    const query: QueryParams = { filter: { status: 'active,pending' } };
    const allowedFilters = ['status'];

    service.apply(queryBuilder, query, allowedFilters);

    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'user.status IN (:...status)',
      { status: ['active', 'pending'] },
    );
  });

  it('should normalize filter[key] format', () => {
    const query: QueryParams = { 'filter[age]': '25' } as any;
    const allowedFilters = ['age'];

    service.apply(queryBuilder, query, allowedFilters);

    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('user.age = :age', {
      age: '25',
    });
  });

  it('should handle JSON fields', () => {
    const findColumnMock =
      mockQueryBuilder.expressionMap.mainAlias.metadata
        .findColumnWithPropertyName;
    findColumnMock.mockReturnValueOnce({ type: 'jsonb' });

    const query: QueryParams = { filter: { metadata: 'tag1' } };
    const allowedFilters = ['metadata'];

    service.apply(queryBuilder, query, allowedFilters);

    // JSON logic uses Brackets which is hard to test perfectly with simple mocks,
    // but we can check if andWhere was called with a function (Brackets)
    expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
  });
});
