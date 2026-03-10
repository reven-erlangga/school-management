import { Test, TestingModule } from '@nestjs/testing';
import { UpsertService } from './upsert.service';
import { Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';

interface TestEntity {
  id?: number;
  name: string;
  email: string;
}

const mockRepository = {
  metadata: {
    tableName: 'test_table',
  },
  findOne: jest.fn(),
  merge: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
};

describe('UpsertService', () => {
  let service: UpsertService;
  let repository: Repository<TestEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpsertService,
        { provide: Repository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<UpsertService>(UpsertService);
    repository = module.get<Repository<TestEntity>>(Repository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('upsert', () => {
    const data: TestEntity = { name: 'test', email: 'test@example.com' };
    const conflictPaths = ['email'];
    const existingEntity: TestEntity = {
      id: 1,
      name: 'old',
      email: 'test@example.com',
    };

    it('should update existing entity if found', async () => {
      mockRepository.findOne.mockResolvedValue(existingEntity);
      const mergedEntity = { ...existingEntity, ...data };
      mockRepository.merge.mockReturnValue(mergedEntity);
      mockRepository.save.mockResolvedValue(mergedEntity);

      const result = await service.upsert(repository, data, conflictPaths);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(mockRepository.merge).toHaveBeenCalledWith(existingEntity, data);
      expect(mockRepository.save).toHaveBeenCalledWith(mergedEntity);
      expect(result).toEqual(mergedEntity);
    });

    it('should create new entity if not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(data);
      mockRepository.save.mockResolvedValue({ id: 2, ...data });

      const result = await service.upsert(repository, data, conflictPaths);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(mockRepository.create).toHaveBeenCalledWith(data);
      expect(mockRepository.save).toHaveBeenCalledWith(data);
      expect(result).toEqual({ id: 2, ...data });
    });

    it('should throw InternalServerErrorException on find error', async () => {
      mockRepository.findOne.mockRejectedValue(new Error('DB Error'));

      await expect(
        service.upsert(repository, data, conflictPaths),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw InternalServerErrorException on save error', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(data);
      mockRepository.save.mockRejectedValue(new Error('Save Error'));

      await expect(
        service.upsert(repository, data, conflictPaths),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
