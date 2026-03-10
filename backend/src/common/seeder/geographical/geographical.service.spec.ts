import { Test, TestingModule } from '@nestjs/testing';
import { GeographicalService } from './geographical.service';

describe('GeographicalService', () => {
  let service: GeographicalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeographicalService],
    }).compile();

    service = module.get<GeographicalService>(GeographicalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
