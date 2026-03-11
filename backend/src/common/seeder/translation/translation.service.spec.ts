import { Test, TestingModule } from '@nestjs/testing';
import { TranslationService } from './translation.service';
import { VaultService } from '../../vault/vault.service';

describe('TranslationService', () => {
  let service: TranslationService;

  const vaultMock = {
    ping: jest.fn(),
    readSecret: jest.fn(),
    writeSecret: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranslationService,
        { provide: VaultService, useValue: vaultMock },
      ],
    }).compile();

    service = module.get<TranslationService>(TranslationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
