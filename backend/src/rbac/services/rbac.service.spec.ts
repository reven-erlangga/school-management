import { Test, TestingModule } from '@nestjs/testing';
import { RbacService } from './rbac.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('RbacService', () => {
  let service: RbacService;
  let prisma: PrismaService;

  const mockPrismaService = {
    module: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
    permission: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
    role: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
    rolePermission: {
      createMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RbacService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<RbacService>(RbacService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createModule', () => {
    it('should throw ConflictException if module name exists', async () => {
      mockPrismaService.module.findUnique.mockResolvedValue({ id: '1', name: 'test' });
      await expect(service.createModule({ name: 'test' })).rejects.toThrow(ConflictException);
    });

    it('should create module if name is unique', async () => {
      mockPrismaService.module.findUnique.mockResolvedValue(null);
      mockPrismaService.module.create.mockResolvedValue({ id: '1', name: 'test' });
      const result = await service.createModule({ name: 'test' });
      expect(result).toEqual({ id: '1', name: 'test' });
    });
  });

  describe('checkPermission', () => {
    it('should return true if role has permission', async () => {
      mockPrismaService.role.findUnique.mockResolvedValue({
        id: 'r1',
        name: 'admin',
        rolePermissions: [
          { permission: { name: 'user.view' } }
        ]
      });
      const result = await service.checkPermission('admin', 'user.view');
      expect(result).toBe(true);
    });

    it('should return false if role does not have permission', async () => {
      mockPrismaService.role.findUnique.mockResolvedValue({
        id: 'r1',
        name: 'user',
        rolePermissions: []
      });
      const result = await service.checkPermission('user', 'user.create');
      expect(result).toBe(false);
    });
  });
});
