import { Test, TestingModule } from '@nestjs/testing';
import { GenderService } from './gender.service';
import { QueryBuilderService } from '../../query-builder/query-builder.service';

describe('GenderService', () => {
  let service: GenderService;

  const qbMock = {
    using: jest.fn().mockReturnThis(),
    upsert: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenderService,
        { provide: QueryBuilderService, useValue: qbMock },
      ],
    }).compile();

    service = module.get<GenderService>(GenderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
