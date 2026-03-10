import { Test, TestingModule } from '@nestjs/testing';
import { InitializeService } from './initialize.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('InitializeService', () => {
  let service: InitializeService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    setting: {
      count: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InitializeService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<InitializeService>(InitializeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('check', () => {
    it('should return initialization status', async () => {
      // Mock counts for general, tolgee, mail
      mockPrismaService.setting.count
        .mockResolvedValueOnce(1) // general
        .mockResolvedValueOnce(1) // tolgee
        .mockResolvedValueOnce(0); // mail

      const result = await service.check();

      expect(result).toEqual({
        general: true,
        tolgee: true,
        mail: false,
        is_initialized: false,
      });
      expect(mockPrismaService.setting.count).toHaveBeenCalledTimes(3);
    });

    it('should return is_initialized true when all exist', async () => {
      mockPrismaService.setting.count.mockResolvedValue(1);

      const result = await service.check();

      expect(result.is_initialized).toBe(true);
    });
  });

  describe('findByKey', () => {
    it('should return setting when found', async () => {
      const mockSetting = {
        group: 'general',
        key: 'site_name',
        value: 'Test School',
        is_sensitive: false,
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockPrismaService.setting.findFirst.mockResolvedValue(mockSetting);

      const result = await service.findByKey('site_name');
      expect(result).toEqual(mockSetting);
    });

    it('should throw NotFoundException when not found', async () => {
      mockPrismaService.setting.findFirst.mockResolvedValue(null);

      await expect(service.findByKey('invalid_key')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
