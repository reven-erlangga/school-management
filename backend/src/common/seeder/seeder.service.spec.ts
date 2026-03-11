import { Test, TestingModule } from '@nestjs/testing';
import { SeederService } from './seeder.service';
import { getQueueToken } from '@nestjs/bullmq';
import { SEEDER_QUEUE, SEED_JOB } from './queue/queue.config';
import { SeederKeyService } from '../utils/seeder/seeder-key.service';

describe('SeederService', () => {
  let service: SeederService;

  const mockQueue = {
    add: jest
      .fn<
        Promise<{ id: string }>,
        [string, Record<string, unknown>, { jobId: string }]
      >()
      .mockResolvedValue({ id: 'job-1' }),
    getJob: jest.fn<Promise<unknown>, [string]>(),
  };

  const mockSeederKeyService = {
    generateUniqueKey: jest.fn<Promise<string>, []>(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeederService,
        { provide: getQueueToken(SEEDER_QUEUE), useValue: mockQueue },
        { provide: SeederKeyService, useValue: mockSeederKeyService },
      ],
    }).compile();

    service = module.get<SeederService>(SeederService);

    jest.clearAllMocks();
  });

  it('enqueues a job and returns key', async () => {
    mockSeederKeyService.generateUniqueKey.mockResolvedValueOnce('abcd1234');
    const result = await service.run();

    expect(mockQueue.add).toHaveBeenCalledTimes(1);
    const [name, payload, opts] = mockQueue.add.mock.calls[0];
    expect(name).toBe(SEED_JOB);
    const typedPayload = payload as { type?: unknown; timestamp?: unknown };
    expect(typedPayload.type).toBe('all');
    expect(typeof typedPayload.timestamp).toBe('string');
    expect(opts).toEqual({ jobId: 'abcd1234' });

    expect(result).toEqual({
      key: 'abcd1234',
      message: 'Seeder job started for type - all',
    });
  });

  it('returns null when job is not found', async () => {
    mockQueue.getJob.mockResolvedValueOnce(null);
    const status = await service.checkStatus('missing');
    expect(status).toBeNull();
  });

  it('returns job status when job exists', async () => {
    const mockJob = {
      id: 'job-1',
      getState: jest.fn<Promise<string>, []>().mockResolvedValue('active'),
      progress: { percent: 10, step: 'translations' },
      returnvalue: null,
      failedReason: null,
    };
    mockQueue.getJob.mockResolvedValueOnce(mockJob);

    const status = await service.checkStatus('job-1');
    expect(status).toEqual({
      key: 'job-1',
      state: 'active',
      progress: { percent: 10, step: 'translations' },
      result: null,
      failedReason: null,
    });
  });
});
