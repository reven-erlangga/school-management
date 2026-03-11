import { Test, TestingModule } from '@nestjs/testing';
import { GeographicalService } from './geographical.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('GeographicalService', () => {
  let service: GeographicalService;

  const prismaMock = {
    country: {
      findFirst: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    state: {
      deleteMany: jest.fn(),
      create: jest.fn(),
    },
    city: {
      createMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeographicalService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<GeographicalService>(GeographicalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
