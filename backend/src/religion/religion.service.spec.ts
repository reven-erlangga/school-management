import { Test, TestingModule } from '@nestjs/testing';
import { ReligionService } from './religion.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ReligionService', () => {
  let service: ReligionService;
  let prisma: PrismaService;

  const mockPrisma = {
    religion: {
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
        ReligionService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ReligionService>(ReligionService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a religion', async () => {
      const dto = { key: 'islam', name: 'Islam' };
      mockPrisma.religion.findUnique.mockResolvedValue(null);
      mockPrisma.religion.create.mockResolvedValue({ id: '1', ...dto });

      const result = await service.create(dto);
      expect(result).toEqual({ id: '1', ...dto });
      expect(prisma.religion.create).toHaveBeenCalledWith({ data: dto });
    });

    it('should throw ConflictException if key exists', async () => {
      const dto = { key: 'islam', name: 'Islam' };
      mockPrisma.religion.findUnique.mockResolvedValue({ id: '1', ...dto });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated religions', async () => {
      const data = [{ id: '1', key: 'islam', name: 'Islam' }];
      mockPrisma.religion.findMany.mockResolvedValue(data);
      mockPrisma.religion.count.mockResolvedValue(1);

      const result = await service.findAll(1, 10);
      expect(result).toEqual({
        data,
        meta: { total: 1, page: 1, last_page: 1 },
      });
    });
  });

  describe('findOne', () => {
    it('should return a religion', async () => {
      const data = { id: '1', key: 'islam', name: 'Islam' };
      mockPrisma.religion.findUnique.mockResolvedValue(data);

      const result = await service.findOne('1');
      expect(result).toEqual(data);
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.religion.findUnique.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a religion', async () => {
      const dto = { name: 'Updated' };
      mockPrisma.religion.findUnique.mockResolvedValue({ id: '1', key: 'islam' });
      mockPrisma.religion.update.mockResolvedValue({ id: '1', key: 'islam', ...dto });

      const result = await service.update('1', dto);
      expect(result.name).toBe('Updated');
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
