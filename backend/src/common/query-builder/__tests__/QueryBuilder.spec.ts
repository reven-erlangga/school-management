import { Test, TestingModule } from '@nestjs/testing';
import { QueryBuilder } from '../QueryBuilder';
import { PrismaService } from '../../prisma/prisma.service';
import { ErrorCodes, QueryBuilderError } from '../errors';

const mockPrismaService = {
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    deleteMany: jest.fn(),
    upsert: jest.fn(),
  },
};

describe('QueryBuilder', () => {
  let queryBuilder: QueryBuilder;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueryBuilder,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    queryBuilder = module.get<QueryBuilder>(QueryBuilder);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('find', () => {
    it('should find records with correct parameters', async () => {
      const options = {
        table: 'user',
        where: { id: 1 },
        select: ['id', 'name'],
        limit: 10,
        offset: 0,
      };

      await queryBuilder.find(options);

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        where: { id: 1 },
        select: { id: true, name: true },
        take: 10,
        skip: 0,
        orderBy: undefined,
      });
    });

    it('should throw error if table not found', async () => {
      await expect(
        queryBuilder.find({ table: 'non_existent_table' }),
      ).rejects.toThrow('Table non_existent_table not found in schema');
    });
  });

  describe('create', () => {
    it('should create a single record', async () => {
      const options = {
        table: 'user',
        data: { name: 'John' },
      };

      await queryBuilder.create(options);

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: { name: 'John' },
        select: undefined,
      });
    });

    it('should create multiple records', async () => {
      const options = {
        table: 'user',
        data: [{ name: 'John' }, { name: 'Jane' }],
      };

      await queryBuilder.create(options);

      expect(mockPrismaService.user.createMany).toHaveBeenCalledWith({
        data: [{ name: 'John' }, { name: 'Jane' }],
      });
    });
  });

  describe('update', () => {
    it('should update records', async () => {
      const options = {
        table: 'user',
        where: { id: 1 },
        data: { name: 'Updated' },
      };

      await queryBuilder.update(options);

      expect(mockPrismaService.user.updateMany).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'Updated' },
      });
    });

    it('should soft delete records', async () => {
      const options = {
        table: 'user',
        where: { id: 1 },
        data: { name: 'Updated' }, // data is ignored or merged depending on implementation, here merged
        useSoftDelete: true,
      };

      // Mock Date
      const mockDate = new Date('2023-01-01');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      await queryBuilder.update(options);

      expect(mockPrismaService.user.updateMany).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'Updated', deletedAt: mockDate },
      });
    });
  });

  describe('delete', () => {
    it('should hard delete records', async () => {
      const options = {
        table: 'user',
        where: { id: 1 },
      };

      await queryBuilder.delete(options);

      expect(mockPrismaService.user.deleteMany).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('cursor', () => {
    it('should iterate over records using cursor', async () => {
        const batch1 = [{ id: 1 }, { id: 2 }];
        const batch2 = [{ id: 3 }];
        
        mockPrismaService.user.findMany
            .mockResolvedValueOnce(batch1)
            .mockResolvedValueOnce(batch2)
            .mockResolvedValueOnce([]);

        const iterator = queryBuilder.cursor({
            table: 'user',
            batchSize: 2,
        });

        const results: any[] = [];
        for await (const batch of iterator) {
            results.push(...batch);
        }

        expect(results).toHaveLength(3);
        expect(mockPrismaService.user.findMany).toHaveBeenCalledTimes(2);
        // Verify cursor usage in second call
        expect(mockPrismaService.user.findMany).toHaveBeenNthCalledWith(2, expect.objectContaining({
            cursor: { id: 2 },
            skip: 1,
            take: 2
        }));
    });
  });
});
