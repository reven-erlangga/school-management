import { Test, TestingModule } from '@nestjs/testing';
import { BannerService } from './banner.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { BannerType } from './dto/create-banner.dto';
import { NotFoundException } from '@nestjs/common';

describe('BannerService', () => {
  let service: BannerService;
  let prisma: PrismaService;

  const mockPrisma = {
    banner: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    bannerInstitute: {
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BannerService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<BannerService>(BannerService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a general banner', async () => {
      const dto = {
        type: BannerType.GENERAL,
        title: 'General Banner',
        image: { url: 'test.jpg' },
      };
      mockPrisma.banner.create.mockResolvedValue({
        id: '1',
        ...dto,
        image: JSON.stringify(dto.image),
      });

      const result = await service.create(dto);
      expect(result.id).toBe('1');
      expect((prisma as any).banner.create).toHaveBeenCalled();
    });

    it('should create an institute banner', async () => {
      const dto = {
        type: BannerType.INSTITUTE,
        title: 'Inst Banner',
        image: { url: 'test.jpg' },
        institute_ids: ['inst-1'],
      };
      mockPrisma.banner.create.mockResolvedValue({
        id: '1',
        ...dto,
        image: JSON.stringify(dto.image),
      });

      const result = await service.create(dto);
      expect(result.id).toBe('1');
      expect((prisma as any).banner.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all banners', async () => {
      mockPrisma.banner.findMany.mockResolvedValue([
        { id: '1', type: 'GENERAL', image: JSON.stringify({ url: 'test.jpg' }) },
      ]);

      const result = await service.findAll({});
      expect(result).toHaveLength(1);
      expect(result[0].image).toEqual({ url: 'test.jpg' });
    });
  });

  describe('findOne', () => {
    it('should return a banner', async () => {
      mockPrisma.banner.findUnique.mockResolvedValue({
        id: '1',
        type: 'GENERAL',
        image: JSON.stringify({ url: 'test.jpg' }),
      });

      const result = await service.findOne('1');
      expect(result.id).toBe('1');
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.banner.findUnique.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a banner', async () => {
      const dto = { title: 'Updated' };
      mockPrisma.banner.update.mockResolvedValue({
        id: '1',
        title: 'Updated',
        image: JSON.stringify({ url: 'test.jpg' }),
      });

      const result = await service.update('1', dto);
      expect(result.title).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should delete a banner', async () => {
      mockPrisma.banner.delete.mockResolvedValue({ id: '1' });
      const result = await service.remove('1');
      expect(result.message).toContain('success');
    });
  });
});
