import { Test, TestingModule } from '@nestjs/testing';
import { FieldService } from './field.service';
import { SelectQueryBuilder } from 'typeorm';
import { QueryParams } from '../interfaces/query-params.interface';

describe('FieldService', () => {
  let service: FieldService;
  let queryBuilder: SelectQueryBuilder<any>;

  const mockQueryBuilder = {
    alias: 'user',
    expressionMap: {
      aliases: [{ name: 'user' }, { name: 'profile' }],
    },
    select: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FieldService],
    }).compile();

    service = module.get<FieldService>(FieldService);
    queryBuilder = mockQueryBuilder as unknown as SelectQueryBuilder<any>;
    jest.clearAllMocks();
    mockQueryBuilder.expressionMap.aliases = [
      { name: 'user' },
      { name: 'profile' },
    ];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should select allowed fields for main alias', () => {
    const query: QueryParams = { fields: 'name,email' };
    const allowedFields = ['id', 'name', 'email', 'password'];

    service.apply(queryBuilder, query, allowedFields);

    // Should include id automatically
    expect(mockQueryBuilder.select).toHaveBeenCalledWith([
      'user.name',
      'user.email',
      'user.id',
      'profile', // joined alias included by default if not specified in fields
    ]);
  });

  it('should filter out disallowed fields', () => {
    const query: QueryParams = { fields: 'name,password,admin' };
    const allowedFields = ['id', 'name']; // password and admin not allowed

    service.apply(queryBuilder, query, allowedFields);

    expect(mockQueryBuilder.select).toHaveBeenCalledWith([
      'user.name',
      'user.id',
      'profile',
    ]);
  });

  it('should handle relation fields', () => {
    const query: QueryParams = {
      fields: {
        user: 'name',
        profile: 'bio',
      },
    } as any;
    const allowedFields = ['id', 'name'];

    service.apply(queryBuilder, query, allowedFields);

    expect(mockQueryBuilder.select).toHaveBeenCalledWith([
      'user.name',
      'user.id',
      'profile',
      'profile.bio',
    ]);
  });

  it('should map snake_case nested fields to relation alias fields', () => {
    mockQueryBuilder.expressionMap.aliases = [
      { name: 'user' },
      { name: 'subSpecializations' },
    ];

    const query: QueryParams = {
      fields: 'name, sub_specializations.name',
    } as any;
    const allowedFields = ['id', 'name'];

    service.apply(queryBuilder, query, allowedFields);

    expect(mockQueryBuilder.select).toHaveBeenCalledWith([
      'user.name',
      'user.id',
      'subSpecializations',
      'subSpecializations.name',
    ]);
  });

  it('should handle array format for fields', () => {
    const query: QueryParams = {
      fields: ['name', 'email'],
    } as any;
    const allowedFields = ['id', 'name', 'email'];

    service.apply(queryBuilder, query, allowedFields);

    expect(mockQueryBuilder.select).toHaveBeenCalledWith([
      'user.name',
      'user.email',
      'user.id',
      'profile',
    ]);
  });

  it('should merge root fields with alias-specific fields syntax', () => {
    const query: QueryParams = {
      fields: 'name',
      'fields[profile]': 'bio',
    } as any;
    const allowedFields = ['id', 'name'];

    service.apply(queryBuilder, query, allowedFields);

    expect(mockQueryBuilder.select).toHaveBeenCalledWith([
      'user.name',
      'user.id',
      'profile',
      'profile.bio',
    ]);
  });
});
