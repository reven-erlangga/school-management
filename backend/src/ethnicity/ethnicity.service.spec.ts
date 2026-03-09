import { Test, TestingModule } from '@nestjs/testing';
import { EthnicityService } from './ethnicity.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('EthnicityService', () => {
  let service: EthnicityService;
  let prisma: PrismaService;

  const mockPrisma = {
    ethnicity: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EthnicityService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<EthnicityService>(EthnicityService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an ethnicity', async () => {
      const dto = { key: 'java', name: 'Javanese' };
      mockPrisma.ethnicity.findUnique.mockResolvedValue(null);
      mockPrisma.ethnicity.create.mockResolvedValue({ id: '1', ...dto });

      const result = await service.create(dto);
      expect(result).toEqual({ id: '1', ...dto });
      expect(prisma.ethnicity.create).toHaveBeenCalledWith({ data: dto });
    });

    it('should throw ConflictException if key exists', async () => {
      const dto = { key: 'java', name: 'Javanese' };
      mockPrisma.ethnicity.findUnique.mockResolvedValue({ id: '1', ...dto });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated ethnicities', async () => {
      const data = [{ id: '1', key: 'java', name: 'Javanese' }];
      mockPrisma.ethnicity.findMany.mockResolvedValue(data);
      mockPrisma.ethnicity.count.mockResolvedValue(1);

      const result = await service.findAll(1, 10);
      expect(result).toEqual({
        data,
        meta: { total: 1, page: 1, last_page: 1 },
      });
    });
  });

  describe('findOne', () => {
    it('should return an ethnicity', async () => {
      const data = { id: '1', key: 'java', name: 'Javanese' };
      mockPrisma.ethnicity.findUnique.mockResolvedValue(data);

      const result = await service.findOne('1');
      expect(result).toEqual(data);
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.ethnicity.findUnique.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an ethnicity', async () => {
      const dto = { name: 'Updated' };
      mockPrisma.ethnicity.findUnique.mockResolvedValue({ id: '1', key: 'java' });
      mockPrisma.ethnicity.update.mockResolvedValue({ id: '1', key: 'java', ...dto });

      const result = await service.update('1', dto);
      expect(result.name).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should delete an ethnicity', async () => {
      mockPrisma.ethnicity.findUnique.mockResolvedValue({ id: '1' });
      mockPrisma.ethnicity.delete.mockResolvedValue({ id: '1' });

      const result = await service.remove('1');
      expect(result.message).toContain('deleted');
    });
  });
});
