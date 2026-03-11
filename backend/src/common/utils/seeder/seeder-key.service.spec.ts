import { Test, TestingModule } from '@nestjs/testing';
import { SeederKeyService } from './seeder-key.service';
import { getQueueToken } from '@nestjs/bullmq';
import { SEEDER_QUEUE } from '../../seeder/queue/queue.config';

describe('SeederKeyService', () => {
  let service: SeederKeyService;
  const mockQueue = {
    getJob: jest.fn<Promise<unknown>, [string]>(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeederKeyService,
        { provide: getQueueToken(SEEDER_QUEUE), useValue: mockQueue },
      ],
    }).compile();

    service = module.get<SeederKeyService>(SeederKeyService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('generates an 8-char key', async () => {
    mockQueue.getJob.mockResolvedValueOnce(null);
    const key = await service.generateUniqueKey();
    expect(typeof key).toBe('string');
    expect(key).toHaveLength(8);
  });
});
