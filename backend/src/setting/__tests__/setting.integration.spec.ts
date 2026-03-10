import { Test, TestingModule } from '@nestjs/testing';
import { SettingService } from '../setting.service';
import { QueryBuilderModule } from '../../common/query-builder/query-builder.module';
import { QueryBuilder } from '../../common/query-builder/QueryBuilder';
import { PrismaService } from '../../common/prisma/prisma.service';
import { InitializeService } from '../../initialize/initialize.service';
import { ConfigService } from '@nestjs/config';

import { RedisService } from '../../common/redis/redis.service';

describe('SettingService Integration', () => {
  let service: SettingService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingService,
        PrismaService,
        InitializeService,
        ConfigService,
        QueryBuilder,
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            reset: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SettingService>(SettingService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    // Cleanup
    await prisma.setting.deleteMany({ where: { group: 'test_group' } });
    await prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and retrieve settings', async () => {
    const group = 'test_group';
    const settings = {
      site_name: 'Test School',
      site_url: 'http://test.com',
      secret_key: 'sensitive_value',
    };

    // Create
    await service.createOrUpdate(group, settings);

    // Retrieve
    const retrieved = await service.findByGroup(group);

    expect(retrieved.site_name).toBe('Test School');
    expect(retrieved.site_url).toBe('http://test.com');
    // sensitive_value should be masked because 'secret_key' isn't in the default sensitive list,
    // BUT we can check if it was stored.
    // Let's add a sensitive key test
  });

  it('should handle sensitive keys correctly', async () => {
    const group = 'test_group';
    const settings = {
      api_key: 'super_secret_api_key',
    };

    // Create
    await service.createOrUpdate(group, settings);

    // Retrieve public (should be masked)
    const publicSettings = await service.findByGroup(group);
    expect(publicSettings.api_key).toBe('****');

    // Retrieve internal (should be decrypted)
    const internalSettings = await service.getInternalByGroup(group);
    expect(internalSettings.api_key).toBe('super_secret_api_key');
  });

  it('should find by key', async () => {
    const result = await service.findByKey('site_name');
    // Since we created it in previous test
    // Note: key is unique per group, but 'key' column itself might not be unique globally?
    // Schema definition: @@id([group, key]) usually.
    // If findByKey uses 'key' in where, it might return multiple if different groups use same key.
    // But SettingService.findByKey returns first one.
    expect(result).toBeDefined();
    expect(result.key).toBe('site_name');
  });
});
