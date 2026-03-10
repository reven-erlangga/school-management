import { Test, TestingModule } from '@nestjs/testing';
import { DeleteService } from './delete.service';
import { NotFoundException } from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';

describe('DeleteService', () => {
  let service: DeleteService;
  let redis: RedisService;

  const mockRedis: Partial<RedisService> = {
    reset: jest.fn().mockResolvedValue(undefined),
  };

  const mockModel = {
    updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    delete: jest.fn().mockResolvedValue({}),
    deleteMany: jest.fn().mockResolvedValue({ count: 2 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteService,
        { provide: RedisService, useValue: mockRedis },
      ],
    }).compile();

    service = module.get<DeleteService>(DeleteService);
    redis = module.get<RedisService>(RedisService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should soft delete by default and invalidate cache', async () => {
    await service.remove(mockModel, { id: '1', modelName: 'country' });
    expect(mockModel.updateMany).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { deletedAt: expect.any(Date) },
    });
    expect(mockRedis.reset).toHaveBeenCalledWith('country:*');
  });

  it('should hard delete when soft is false', async () => {
    await service.remove(mockModel, { id: '1', soft: false, modelName: 'x' });
    expect(mockModel.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(mockRedis.reset).toHaveBeenCalledWith('x:*');
  });

  it('should throw NotFoundException if no rows affected', async () => {
    (mockModel.updateMany as jest.Mock).mockResolvedValueOnce({ count: 0 });
    await expect(
      service.remove(mockModel, { id: '999', modelName: 'country' }),
    ).rejects.toThrow(NotFoundException);
  });
});
