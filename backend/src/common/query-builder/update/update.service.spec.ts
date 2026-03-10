import { Test, TestingModule } from '@nestjs/testing';
import { UpdateService } from './update.service';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

interface TestEntity {
  id: number;
  name: string;
  firstName?: string;
  first_name?: string;
}

describe('UpdateService', () => {
  let service: UpdateService;
  let repository: Repository<TestEntity>;

  const mockQueryBuilder = {
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  const mockRepository = {
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    findOne: jest.fn().mockResolvedValue({ id: 1, name: 'updated' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateService],
    }).compile();

    service = module.get<UpdateService>(UpdateService);
    repository = mockRepository as unknown as Repository<TestEntity>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update an entity with snake_case transformation', async () => {
    const data = { firstName: 'John' };
    const result = await service.update(repository, 1, data);

    expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
    expect(mockQueryBuilder.update).toHaveBeenCalled();
    expect(mockQueryBuilder.set).toHaveBeenCalledWith({ first_name: 'John' });
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('id = :id', { id: 1 });
    expect(mockQueryBuilder.execute).toHaveBeenCalled();
    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual({ id: 1, name: 'updated' });
  });

  it('should throw NotFoundException if no rows affected', async () => {
    mockQueryBuilder.execute.mockResolvedValueOnce({ affected: 0 });
    await expect(service.update(repository, 999, {})).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw NotFoundException if entity not found after update', async () => {
    mockRepository.findOne.mockResolvedValueOnce(null);
    await expect(service.update(repository, 1, {})).rejects.toThrow(
      NotFoundException,
    );
  });
});
