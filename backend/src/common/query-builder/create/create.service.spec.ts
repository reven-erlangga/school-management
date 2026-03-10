import { Test, TestingModule } from '@nestjs/testing';
import { CreateService } from './create.service';
import { Repository } from 'typeorm';

describe('CreateService', () => {
  let service: CreateService;
  let repository: Repository<any>;

  const mockQueryBuilder = {
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({ identifiers: [{ id: 1 }] }),
  };

  const mockRepository = {
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    findOne: jest.fn().mockResolvedValue({ id: 1, name: 'test' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateService,
        {
          provide: 'Repository', // We won't inject Repository directly into CreateService constructor, but we pass it as arg
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CreateService>(CreateService);

    repository = mockRepository as any;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an entity with snake_case transformation', async () => {
    const data = { firstName: 'John', lastName: 'Doe' };

    const result = await service.create(repository, data);

    expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
    expect(mockQueryBuilder.insert).toHaveBeenCalled();
    expect(mockQueryBuilder.values).toHaveBeenCalledWith({
      first_name: 'John',
      last_name: 'Doe',
    });
    expect(mockQueryBuilder.execute).toHaveBeenCalled();
    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual({ id: 1, name: 'test' });
  });

  it('should throw error if creation fails', async () => {
    mockQueryBuilder.execute.mockResolvedValueOnce({ identifiers: [] });
    await expect(service.create(repository, {})).rejects.toThrow(
      'Failed to create entity',
    );
  });
});
