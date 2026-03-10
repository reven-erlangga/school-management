import { Test, TestingModule } from '@nestjs/testing';
import { FindByIdService } from './find-by-id.service';
import { Repository, FindOptionsWhere } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('FindByIdService', () => {
  let service: FindByIdService;
  let repository: Repository<{ id: number; name: string }>;

  const mockEntity = { id: 1, name: 'test' };

  const mockRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindByIdService],
    }).compile();

    service = module.get<FindByIdService>(FindByIdService);

    repository = mockRepository as any;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the entity if found', async () => {
    mockRepository.findOne.mockResolvedValue(mockEntity);

    const result = await service.findById(repository, 1);

    expect(result).toEqual(mockEntity);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 } as unknown as FindOptionsWhere<{
        id: number;
        name: string;
      }>,
    });
  });

  it('should throw NotFoundException if entity not found', async () => {
    mockRepository.findOne.mockResolvedValue(null);

    await expect(service.findById(repository, 1)).rejects.toThrow(
      NotFoundException,
    );
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 } as unknown as FindOptionsWhere<{
        id: number;
        name: string;
      }>,
    });
  });
});
