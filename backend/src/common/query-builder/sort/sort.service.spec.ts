import { Test, TestingModule } from '@nestjs/testing';
import { SortService } from './sort.service';
import { SelectQueryBuilder } from 'typeorm';
import { QueryParams } from '../interfaces/query-params.interface';

describe('SortService', () => {
  let service: SortService;
  let queryBuilder: SelectQueryBuilder<any>;

  const mockQueryBuilder = {
    alias: 'user',
    addOrderBy: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SortService],
    }).compile();

    service = module.get<SortService>(SortService);
    queryBuilder = mockQueryBuilder as unknown as SelectQueryBuilder<any>;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should apply allowed sorts', () => {
    const query: QueryParams = { sort: 'name,-createdAt' };
    const allowedSorts = ['name', 'createdAt'];

    service.apply(queryBuilder, query, allowedSorts);

    expect(mockQueryBuilder.addOrderBy).toHaveBeenCalledWith(
      'user.name',
      'ASC',
    );
    expect(mockQueryBuilder.addOrderBy).toHaveBeenCalledWith(
      'user.createdAt',
      'DESC',
    );
  });

  it('should ignore disallowed sorts', () => {
    const query: QueryParams = { sort: 'password' };
    const allowedSorts = ['name'];

    service.apply(queryBuilder, query, allowedSorts);

    expect(mockQueryBuilder.addOrderBy).not.toHaveBeenCalled();
  });

  it('should do nothing if sort param is missing', () => {
    const query: QueryParams = {};
    const allowedSorts = ['name'];

    service.apply(queryBuilder, query, allowedSorts);

    expect(mockQueryBuilder.addOrderBy).not.toHaveBeenCalled();
  });
});
