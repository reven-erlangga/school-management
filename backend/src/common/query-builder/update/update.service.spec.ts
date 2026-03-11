import { Test, TestingModule } from '@nestjs/testing';
import { UpdateService } from './update.service';
import { NotFoundException } from '@nestjs/common';

describe('UpdateService', () => {
  let service: UpdateService;
  const delegate = {
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateService],
    }).compile();

    service = module.get<UpdateService>(UpdateService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update an entity via delegate', async () => {
    delegate.update.mockResolvedValueOnce({ id: '1', name: 'updated' });
    const result = await service.update(
      delegate,
      { id: '1' },
      { name: 'updated' },
      'test',
    );
    expect(delegate.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { name: 'updated' },
    });
    expect(result).toEqual({ id: '1', name: 'updated' });
  });

  it('should throw NotFoundException on Prisma not found error', async () => {
    delegate.update.mockRejectedValueOnce({ code: 'P2025' });
    await expect(
      service.update(delegate, { id: '1' }, { name: 'x' }, 'test'),
    ).rejects.toThrow(NotFoundException);
  });
});
