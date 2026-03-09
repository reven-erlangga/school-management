import { Test, TestingModule } from '@nestjs/testing';
import { SettingService } from '../setting.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('SettingService', () => {
  let service: SettingService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingService,
        {
          provide: PrismaService,
          useValue: {
            setting: {
              findMany: jest.fn(),
              upsert: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<SettingService>(SettingService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateGroup', () => {
    it('should encrypt sensitive data before saving', async () => {
      const dto = {
        group: 'mail',
        settings: {
          mail_host: 'smtp.gmail.com',
          mail_password: 'secret-password'
        }
      };

      const upsertSpy = jest.spyOn(prisma.setting as any, 'upsert');

      await service.createOrUpdate(dto);

      // Check if mail_password was encrypted (not 'secret-password')
      const passwordCall = upsertSpy.mock.calls.find(call => call[0].where.key === 'mail_password');
      expect(passwordCall[0].update.value).not.toBe('secret-password');
      expect(passwordCall[0].update.is_sensitive).toBe(true);

      // Check if mail_host was NOT encrypted
      const hostCall = upsertSpy.mock.calls.find(call => call[0].where.key === 'mail_host');
      expect(hostCall[0].update.value).toBe('smtp.gmail.com');
      expect(hostCall[0].update.is_sensitive).toBe(false);
    });
  });

  describe('findByGroup', () => {
    it('should mask sensitive data when returning to frontend', async () => {
      jest.spyOn(prisma.setting as any, 'findMany').mockResolvedValue([
        { key: 'mail_host', value: 'smtp.gmail.com', is_sensitive: false },
        { key: 'mail_password', value: 'encrypted-hex-value', is_sensitive: true }
      ]);

      const result = await service.findByGroup('mail');

      expect(result.mail_host).toBe('smtp.gmail.com');
      expect(result.mail_password).toBe('********');
    });
  });
});
