import { Test, TestingModule } from '@nestjs/testing';
import { FindByIdService } from './find-by-id.service';
import { NotFoundException } from '@nestjs/common';

describe('FindByIdService', () => {
  let service: FindByIdService;
  const delegate = { findUnique: jest.fn() };

  const mockEntity = { id: 1, name: 'test' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindByIdService],
    }).compile();

    service = module.get<FindByIdService>(FindByIdService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the entity if found', async () => {
    delegate.findUnique.mockResolvedValue(mockEntity);

    const result = await service.findById(delegate, { id: 1 }, 'test');

    expect(result).toEqual(mockEntity);
    expect(delegate.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should throw NotFoundException if entity not found', async () => {
    delegate.findUnique.mockResolvedValue(null);

    await expect(service.findById(delegate, { id: 1 }, 'test')).rejects.toThrow(
      NotFoundException,
    );
    expect(delegate.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
