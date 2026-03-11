import { Test, TestingModule } from '@nestjs/testing';
import { FindOneService } from './find-one.service';
import { RedisService } from '../../redis/redis.service';

describe('FindOneService', () => {
  let service: FindOneService;
  let redis: RedisService;

  const mockRedis: Partial<RedisService> = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const mockModel = {
    findUnique: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindOneService,
        { provide: RedisService, useValue: mockRedis },
      ],
    }).compile();

    service = module.get<FindOneService>(FindOneService);
    redis = module.get<RedisService>(RedisService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns result without cache when useCache=false', async () => {
    mockModel.findUnique.mockResolvedValue({ id: '1' });
    const res = await service.findOne(mockModel, {
      where: { id: '1' },
    });
    expect(res).toEqual({ id: '1' });
    expect(mockRedis.get).not.toHaveBeenCalled();
    expect(mockRedis.set).not.toHaveBeenCalled();
  });

  it('hits cache when present', async () => {
    (mockRedis.get as jest.Mock).mockResolvedValue({ id: '1', name: 'Cached' });
    const res = await service.findOne(mockModel, {
      where: { id: '1' },
      useCache: true,
      modelName: 'country',
    });
    expect(res).toEqual({ id: '1', name: 'Cached' });
    expect(mockModel.findUnique).not.toHaveBeenCalled();
  });

  it('sets cache on miss', async () => {
    (mockRedis.get as jest.Mock).mockResolvedValue(null);
    mockModel.findUnique.mockResolvedValue({ id: '1' });
    await service.findOne(mockModel, {
      where: { id: '1' },
      select: { id: true },
      include: undefined,
      useCache: true,
      ttl: 120,
      modelName: 'country',
    });
    expect(mockModel.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
      select: { id: true },
    });
    expect(mockRedis.set).toHaveBeenCalled();
  });
});
