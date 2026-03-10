import { Test, TestingModule } from '@nestjs/testing';
import { InitializeController } from './initialize.controller';
import { InitializeService } from './initialize.service';
import {
  InitializationStatusEntity,
  SettingEntity,
} from './entities/setting.entity';

describe('InitializeController', () => {
  let controller: InitializeController;
  let service: InitializeService;

  const mockService = {
    check: jest.fn(),
    findByKey: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InitializeController],
      providers: [{ provide: InitializeService, useValue: mockService }],
    }).compile();

    controller = module.get<InitializeController>(InitializeController);
    service = module.get<InitializeService>(InitializeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should return status', async () => {
      const mockStatus = new InitializationStatusEntity({
        general: true,
        mail: false,
        tolgee: true,
        is_initialized: false,
      });
      mockService.check.mockResolvedValue(mockStatus);

      const result = await controller.check();
      expect(result.data).toEqual(mockStatus);
      expect(result.meta).toHaveProperty('timestamp');
    });
  });

  describe('findByKey', () => {
    it('should return setting', async () => {
      const mockSetting = new SettingEntity({
        group: 'general',
        key: 'site_name',
        value: 'Test',
      });
      mockService.findByKey.mockResolvedValue(mockSetting);

      const result = await controller.findByKey('site_name');
      expect(result.data).toEqual(mockSetting);
    });
  });
});
