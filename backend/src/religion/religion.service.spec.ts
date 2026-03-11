import { Test, TestingModule } from '@nestjs/testing';
import { ReligionService } from './religion.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { QueryBuilderService } from '../common/query-builder/query-builder.service';
import { PaginationService } from '../common/query-builder/pagination/pagination.service';

describe('ReligionService', () => {
  let service: ReligionService;

  const mockPrisma = {
    religion: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const qbMock = {
    using: jest.fn().mockReturnThis(),
    allowedIncludes: jest.fn().mockReturnThis(),
    allowedFields: jest.fn().mockReturnThis(),
    allowedSorts: jest.fn().mockReturnThis(),
    allowedFilters: jest.fn().mockReturnThis(),
    build: jest.fn().mockReturnValue({}),
  };

  const paginationMock = {
    paginate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReligionService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: QueryBuilderService, useValue: qbMock },
        { provide: PaginationService, useValue: paginationMock },
      ],
    }).compile();

    service = module.get<ReligionService>(ReligionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a religion', async () => {
      const dto = { key: 'islam', name: { en: 'Islam', id: 'Islam' } };
      mockPrisma.religion.findUnique.mockResolvedValue(null);
      mockPrisma.religion.create.mockResolvedValue({ id: '1', ...dto });

      await expect(service.create(dto as any)).resolves.toEqual({
        id: '1',
        ...dto,
      });
      expect(mockPrisma.religion.create).toHaveBeenCalledWith({ data: dto });
    });

    it('should throw ConflictException if key exists', async () => {
      const dto = { key: 'islam', name: { en: 'Islam', id: 'Islam' } };
      mockPrisma.religion.findUnique.mockResolvedValue({ id: '1', ...dto });

      await expect(service.create(dto as any)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated religions', async () => {
      const data = [
        { id: '1', key: 'islam', name: { en: 'Islam', id: 'Islam' } },
      ];
      const meta = { total: 1, page: 1, last_page: 1 };
      paginationMock.paginate.mockResolvedValueOnce({ data, meta });

      await expect(service.findAll({ page: 1, limit: 10 } as any)).resolves.toEqual(
        { data, meta },
      );
    });
  });

  describe('findOne', () => {
    it('should return a religion', async () => {
      const data = {
        id: '1',
        key: 'islam',
        name: { en: 'Islam', id: 'Islam' },
      };
      mockPrisma.religion.findUnique.mockResolvedValue(data);

      await expect(service.findOne('1', {} as any)).resolves.toEqual(data);
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.religion.findUnique.mockResolvedValue(null);
      await expect(service.findOne('1', {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a religion', async () => {
      const dto = { name: { en: 'Updated', id: 'Diubah' } };
      mockPrisma.religion.findUnique.mockResolvedValue({
        id: '1',
        key: 'islam',
      });
      mockPrisma.religion.update.mockResolvedValue({
        id: '1',
        key: 'islam',
        ...dto,
      });

      await expect(service.update('1', dto as any)).resolves.toMatchObject({
        name: dto.name,
      });
    });
  });

  describe('remove', () => {
    it('should delete a religion', async () => {
      mockPrisma.religion.findUnique.mockResolvedValue({ id: '1' });
      mockPrisma.religion.delete.mockResolvedValue({ id: '1' });

      const result = await service.remove('1');
      expect(result.message).toContain('deleted');
    });
  });
});
