import { Test, TestingModule } from '@nestjs/testing';
import { IncludeService } from './include.service';
import { SelectQueryBuilder } from 'typeorm';
import { QueryParams } from '../interfaces/query-params.interface';

describe('IncludeService', () => {
  let service: IncludeService;
  let queryBuilder: SelectQueryBuilder<any>;

  const mockQueryBuilder = {
    alias: 'user',
    expressionMap: {
      aliases: [] as { name: string }[],
    },
    leftJoin: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncludeService],
    }).compile();

    service = module.get<IncludeService>(IncludeService);
    queryBuilder = mockQueryBuilder as unknown as SelectQueryBuilder<any>;
    jest.clearAllMocks();
    mockQueryBuilder.expressionMap.aliases = [];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should apply allowed includes', () => {
    const query: QueryParams = { includes: 'profile,posts' };
    const allowedIncludes = ['profile', 'posts'];

    service.apply(queryBuilder, query, allowedIncludes);

    expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith(
      'user.profile',
      'profile',
    );
    expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith(
      'user.posts',
      'posts',
    );
  });

  it('should ignore disallowed includes', () => {
    const query: QueryParams = { includes: 'secrets' };
    const allowedIncludes = ['profile'];

    service.apply(queryBuilder, query, allowedIncludes);

    expect(mockQueryBuilder.leftJoin).not.toHaveBeenCalled();
  });

  it('should handle nested includes', () => {
    const query: QueryParams = { includes: 'profile.address' };
    const allowedIncludes = ['profile.address'];

    service.apply(queryBuilder, query, allowedIncludes);

    expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith(
      'user.profile',
      'profile',
    );
    expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith(
      'profile.address',
      'address',
    );
  });

  it('should map snake_case includes to camelCase relations', () => {
    const query: QueryParams = { includes: 'sub_specializations' };
    const allowedIncludes = ['subSpecializations'];

    service.apply(queryBuilder, query, allowedIncludes);

    expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith(
      'user.subSpecializations',
      'subSpecializations',
    );
  });

  it('should not join if alias already exists', () => {
    mockQueryBuilder.expressionMap.aliases = [{ name: 'profile' }];
    const query: QueryParams = { includes: 'profile' };
    const allowedIncludes = ['profile'];

    service.apply(queryBuilder, query, allowedIncludes);

    expect(mockQueryBuilder.leftJoin).not.toHaveBeenCalled();
  });
});
