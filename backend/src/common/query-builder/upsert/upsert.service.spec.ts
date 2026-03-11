import { Test, TestingModule } from '@nestjs/testing';
import { UpsertService } from './upsert.service';
import { InternalServerErrorException } from '@nestjs/common';

interface TestEntity {
  id?: number;
  name: string;
  email: string;
}

const mockDelegate = {
  upsert: jest.fn(),
};

describe('UpsertService', () => {
  let service: UpsertService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpsertService],
    }).compile();

    service = module.get<UpsertService>(UpsertService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('upsert', () => {
    const data: TestEntity = { name: 'test', email: 'test@example.com' };
    const where = { email: 'test@example.com' };

    it('should call delegate.upsert and return result', async () => {
      mockDelegate.upsert.mockResolvedValueOnce({ id: 1, ...data });

      const result = await service.upsert(
        mockDelegate,
        where,
        data as unknown as Record<string, unknown>,
        'user',
      );

      expect(mockDelegate.upsert).toHaveBeenCalledWith({
        where,
        create: data,
        update: data,
      });
      expect(result).toEqual({ id: 1, ...data });
    });

    it('should throw InternalServerErrorException on upsert error', async () => {
      mockDelegate.upsert.mockRejectedValueOnce(new Error('DB Error'));

      await expect(
        service.upsert(
          mockDelegate,
          where,
          data as unknown as Record<string, unknown>,
          'user',
        ),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
