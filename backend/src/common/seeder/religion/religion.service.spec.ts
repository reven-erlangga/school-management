import { Test, TestingModule } from '@nestjs/testing';
import { ReligionService } from './religion.service';
import { QueryBuilderService } from '../../query-builder/query-builder.service';

describe('ReligionService', () => {
  let service: ReligionService;

  const qbMock = {
    using: jest.fn().mockReturnThis(),
    upsert: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReligionService,
        { provide: QueryBuilderService, useValue: qbMock },
      ],
    }).compile();

    service = module.get<ReligionService>(ReligionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
