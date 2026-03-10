import { Test, TestingModule } from '@nestjs/testing';
import { CursorPaginateService } from './cursor-paginate.service';

describe('CursorPaginateService', () => {
  let service: CursorPaginateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CursorPaginateService],
    }).compile();

    service = module.get<CursorPaginateService>(CursorPaginateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
