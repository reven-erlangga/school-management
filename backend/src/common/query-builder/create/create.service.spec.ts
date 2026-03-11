import { Test, TestingModule } from '@nestjs/testing';
import { CreateService } from './create.service';

describe('CreateService', () => {
  let service: CreateService;
  const delegate = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateService],
    }).compile();

    service = module.get<CreateService>(CreateService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an entity via delegate', async () => {
    delegate.create.mockResolvedValueOnce({ id: '1', name: 'test' });

    const result = await service.create(delegate, { name: 'test' });

    expect(delegate.create).toHaveBeenCalledWith({ data: { name: 'test' } });
    expect(result).toEqual({ id: '1', name: 'test' });
  });

  it('should throw if delegate is missing', async () => {
    await expect(
      service.create(undefined as any, { name: 'x' }),
    ).rejects.toThrow('Model delegate is required');
  });
});
