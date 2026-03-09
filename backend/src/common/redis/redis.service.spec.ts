import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

// Mock ioredis
jest.mock('ioredis');

describe('RedisService', () => {
  let service: RedisService;
  let configService: ConfigService;
  let redisClientMock: any;

  beforeEach(async () => {
    // Reset mocks
    redisClientMock = {
      on: jest.fn(),
      disconnect: jest.fn(),
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      exists: jest.fn(),
      scanStream: jest.fn(),
      pipeline: jest.fn(),
    };

    (Redis as unknown as jest.Mock).mockImplementation(() => redisClientMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue: any) => {
              if (key === 'REDIS_HOST') return 'localhost';
              if (key === 'REDIS_PORT') return 6379;
              return defaultValue;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
    configService = module.get<ConfigService>(ConfigService);
    
    // Trigger onModuleInit manually as it creates the client
    service.onModuleInit();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('set', () => {
    it('should set a value without TTL', async () => {
      const key = 'test-key';
      const value = { foo: 'bar' };
      
      await service.set(key, value);
      
      expect(redisClientMock.set).toHaveBeenCalledWith(key, JSON.stringify(value));
    });

    it('should set a value with TTL', async () => {
      const key = 'test-key';
      const value = { foo: 'bar' };
      const ttl = 60;
      
      await service.set(key, value, ttl);
      
      expect(redisClientMock.set).toHaveBeenCalledWith(key, JSON.stringify(value), 'EX', ttl);
    });
  });

  describe('get', () => {
    it('should return null if key does not exist', async () => {
      redisClientMock.get.mockResolvedValue(null);
      
      const result = await service.get('missing-key');
      expect(result).toBeNull();
    });

    it('should return parsed value if key exists', async () => {
      const value = { foo: 'bar' };
      redisClientMock.get.mockResolvedValue(JSON.stringify(value));
      
      const result = await service.get('existing-key');
      expect(result).toEqual(value);
    });

    it('should handle errors gracefully', async () => {
      redisClientMock.get.mockRejectedValue(new Error('Redis error'));
      
      const result = await service.get('error-key');
      expect(result).toBeNull();
    });
  });

  describe('del', () => {
    it('should delete a key', async () => {
      await service.del('test-key');
      expect(redisClientMock.del).toHaveBeenCalledWith('test-key');
    });
  });

  describe('exists', () => {
    it('should return true if key exists', async () => {
      redisClientMock.exists.mockResolvedValue(1);
      const result = await service.exists('existing-key');
      expect(result).toBe(true);
    });

    it('should return false if key does not exist', async () => {
      redisClientMock.exists.mockResolvedValue(0);
      const result = await service.exists('missing-key');
      expect(result).toBe(false);
    });
  });

  describe('reset', () => {
    it('should scan and delete keys matching pattern', async () => {
      const streamMock = {
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            callback(['key1', 'key2']);
          }
          if (event === 'end') {
            callback();
          }
        }),
      };
      redisClientMock.scanStream.mockReturnValue(streamMock);
      
      const pipelineMock = {
        del: jest.fn(),
        exec: jest.fn(),
      };
      redisClientMock.pipeline.mockReturnValue(pipelineMock);

      await service.reset('pattern:*');

      expect(redisClientMock.scanStream).toHaveBeenCalledWith({ match: 'pattern:*', count: 100 });
      expect(pipelineMock.del).toHaveBeenCalledWith('key1');
      expect(pipelineMock.del).toHaveBeenCalledWith('key2');
      expect(pipelineMock.exec).toHaveBeenCalled();
    });
  });
});
