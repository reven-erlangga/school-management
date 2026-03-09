import { Test, TestingModule } from '@nestjs/testing';
import { MinioService } from './minio.service';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import sharp from 'sharp';
import * as fs from 'fs';

// Mock dependencies with factories
jest.mock('minio', () => {
  return {
    Client: jest.fn().mockImplementation(() => ({
      bucketExists: jest.fn(),
      makeBucket: jest.fn(),
      setBucketPolicy: jest.fn(),
      putObject: jest.fn(),
    })),
  };
});

jest.mock('sharp', () => {
  return jest.fn().mockImplementation(() => ({
    metadata: jest.fn().mockResolvedValue({ width: 100, height: 100, size: 500, format: 'png' }),
    resize: jest.fn().mockReturnThis(),
    jpeg: jest.fn().mockReturnThis(),
    png: jest.fn().mockReturnThis(),
    webp: jest.fn().mockReturnThis(),
    toBuffer: jest.fn().mockResolvedValue(Buffer.from('compressed')),
  }));
});

jest.mock('fluent-ffmpeg', () => {
  return jest.fn().mockImplementation(() => ({
    output: jest.fn().mockReturnThis(),
    videoCodec: jest.fn().mockReturnThis(),
    size: jest.fn().mockReturnThis(),
    outputOptions: jest.fn().mockReturnThis(),
    on: jest.fn().mockImplementation(function(event, callback) {
      if (event === 'end') {
        process.nextTick(() => callback());
      }
      return this;
    }),
    run: jest.fn(),
  }));
});

describe('MinioService', () => {
  let service: MinioService;
  let configService: ConfigService;
  let minioClientMock: any;

  beforeEach(async () => {
    // Spy on fs methods to avoid writing to disk
    // fs is already mocked by jest.mock factory above, so we don't need to spy.
    // We can just use the mocked methods if needed.

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MinioService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue: any) => defaultValue),
          },
        },
      ],
    }).compile();

    service = module.get<MinioService>(MinioService);
    configService = module.get<ConfigService>(ConfigService);
    
    // Get the instance of the mock client from the service
    // Since we mocked the constructor, we can't easily access the instance unless we expose it or spy on the prototype.
    // However, in the previous test we assumed we could control the mock.
    // With factory mock, `new Minio.Client()` returns an object. 
    // We can spy on the prototype or just assume the service uses the one we defined.
    // Actually, `Minio.Client` is a jest.fn().
    // We can get the instance created.
    
    // A better way to control the mock instance is to use `mockImplementation` on the mocked class in `beforeEach` if we want per-test control.
    // But since we used a factory, `Minio.Client` is already a mock.
    
    // We can access the mock instance:
    // @ts-ignore
    const MockClient = Minio.Client;
    // We need to re-apply mock implementation to capture the instance or methods
    // But the factory already did it.
    
    // Let's rely on `minioClientMock` variable if we can inject it.
    // But with factory, we can't easily share variable scope.
    // So we will spy on the methods of the *created instance*.
    // Or we can modify the mock in `beforeEach`.
    
    // Let's redefine the mock in `beforeEach` to capture the methods.
    minioClientMock = {
      bucketExists: jest.fn(),
      makeBucket: jest.fn(),
      setBucketPolicy: jest.fn(),
      putObject: jest.fn(),
    };
    (Minio.Client as unknown as jest.Mock).mockImplementation(() => minioClientMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
    // jest.restoreAllMocks(); // Not needed as we didn't spy
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should initialize bucket if not exists', async () => {
      minioClientMock.bucketExists.mockResolvedValue(false);
      await service.onModuleInit();
      expect(minioClientMock.makeBucket).toHaveBeenCalledWith('public', 'us-east-1');
      expect(minioClientMock.setBucketPolicy).toHaveBeenCalled();
    });

    it('should not create bucket if exists', async () => {
      minioClientMock.bucketExists.mockResolvedValue(true);
      await service.onModuleInit();
      expect(minioClientMock.makeBucket).not.toHaveBeenCalled();
    });
  });

  describe('uploadFile', () => {
    it('should upload image file', async () => {
      const file = {
        buffer: Buffer.from('test'),
        originalname: 'test.png',
        mimetype: 'image/png',
      } as Express.Multer.File;

      await service.onModuleInit(); // Init client
      const result = await service.uploadFile(file);

      expect(minioClientMock.putObject).toHaveBeenCalled();
      expect(result.url).toMatch(/.+\.png$/);
      expect(result.type).toBe('image/png');
    });

    it('should upload normal file', async () => {
        const file = {
          buffer: Buffer.from('test'),
          originalname: 'doc.pdf',
          mimetype: 'application/pdf',
        } as Express.Multer.File;
  
        await service.onModuleInit(); // Init client
        const result = await service.uploadFile(file);
  
        expect(minioClientMock.putObject).toHaveBeenCalled();
        expect(result.type).toBe('application/pdf');
      });
  });
});
