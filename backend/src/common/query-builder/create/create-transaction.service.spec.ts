import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionService } from './create-transaction.service';
import { DataSource, EntityManager, Repository } from 'typeorm';

describe('CreateTransactionService', () => {
  let service: CreateTransactionService;
  let dataSource: DataSource;
  let manager: EntityManager;
  let repository: Repository<any>;

  beforeEach(async () => {
    repository = {
      create: jest.fn((data) => data),
      save: jest.fn((data) => Promise.resolve({ id: 1, ...data })),
    } as any;

    manager = {
      getRepository: jest.fn(() => repository),
    } as any;

    dataSource = {
      transaction: jest.fn((cb) => cb(manager)),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTransactionService,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    service = module.get<CreateTransactionService>(CreateTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an entity within a transaction', async () => {
    const dto = { name: 'Test' };
    const entityClass = class TestEntity {};
    const mapper = (d: typeof dto) => ({ name: d.name }) as any;
    const afterSave = jest.fn();

    const result = await service.create({
      dto,
      entity: entityClass,
      mapper,
      afterSave,
    });

    expect(dataSource.transaction).toHaveBeenCalled();
    expect(manager.getRepository).toHaveBeenCalledWith(entityClass);
    expect(repository.create).toHaveBeenCalledWith({ name: 'Test' });
    expect(repository.save).toHaveBeenCalledWith({ name: 'Test' });
    expect(afterSave).toHaveBeenCalledWith({ id: 1, name: 'Test' }, manager);
    expect(result).toEqual({ id: 1, name: 'Test' });
  });

  it('should use provided manager if available', async () => {
    const dto = { name: 'Test' };
    const entityClass = class TestEntity {};
    const mapper = (d: typeof dto) => ({ name: d.name }) as any;

    const result = await service.create({
      dto,
      entity: entityClass,
      mapper,
      manager,
    });

    expect(dataSource.transaction).not.toHaveBeenCalled();
    expect(manager.getRepository).toHaveBeenCalledWith(entityClass);
    expect(result).toEqual({ id: 1, name: 'Test' });
  });
});
