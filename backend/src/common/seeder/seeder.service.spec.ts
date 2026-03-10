import { Test, TestingModule } from '@nestjs/testing';
import { SeederService } from './seeder.service';
import { getQueueToken } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { SEEDER_QUEUE, SEED_JOB } from './queue/queue.config';

jest.mock('uuid', () => ({ v4: () => 'job-uuid' }));

describe('SeederService', () => {
  let service: SeederService;
  let queue: Queue;

  const mockQueue = {
    add: jest.fn().mockResolvedValue({ id: 'job-1' }),
    getJob: jest.fn(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeederService,
        { provide: getQueueToken(SEEDER_QUEUE), useValue: mockQueue },
      ],
    }).compile();

    service = module.get<SeederService>(SeederService);
    queue = module.get<Queue>(getQueueToken(SEEDER_QUEUE));

    jest.clearAllMocks();
  });

  it('enqueues a job with provided type', async () => {
    const result = await service.runSeeder('all');

    expect(queue.add).toHaveBeenCalledWith(
      SEED_JOB,
      expect.objectContaining({
        type: 'all',
        timestamp: expect.any(String),
      }),
      expect.objectContaining({
        jobId: 'job-uuid',
      }),
    );

    expect(result).toEqual({
      jobId: 'job-1',
      message: 'Seeder job started for type - all',
    });
  });

  it('returns null when job is not found', async () => {
    (mockQueue.getJob as jest.Mock).mockResolvedValueOnce(null);
    const status = await service.getJobStatus('missing');
    expect(status).toBeNull();
  });

  it('returns job status when job exists', async () => {
    const mockJob = {
      id: 'job-1',
      getState: jest.fn().mockResolvedValue('active'),
      progress: { percent: 10, step: 'translations' },
      returnvalue: null,
      failedReason: null,
    };
    (mockQueue.getJob as jest.Mock).mockResolvedValueOnce(mockJob);

    const status = await service.getJobStatus('job-1');
    expect(status).toEqual({
      id: 'job-1',
      state: 'active',
      progress: { percent: 10, step: 'translations' },
      result: null,
      failedReason: null,
    });
  });
});
