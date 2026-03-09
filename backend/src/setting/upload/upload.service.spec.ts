import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';
import { SettingService } from '../setting.service';
import { MinioService } from '../../common/minio/minio.service';
import { BadRequestException } from '@nestjs/common';
import sharp from 'sharp';

// Mock sharp
jest.mock('sharp');

describe('UploadService', () => {
  let service: UploadService;
  let settingService: SettingService;
  let minioService: MinioService;

  const mockFile = {
    buffer: Buffer.from('test'),
    originalname: 'test.png',
    mimetype: 'image/png',
    size: 1000,
  } as Express.Multer.File;

  beforeEach(async () => {
    // Reset sharp mock
    (sharp as unknown as jest.Mock).mockReset();
    // Default implementation
    (sharp as unknown as jest.Mock).mockImplementation(() => ({
      metadata: jest.fn().mockResolvedValue({ width: 200, height: 200 }),
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        {
          provide: SettingService,
          useValue: {
            createOrUpdate: jest.fn(),
          },
        },
        {
          provide: MinioService,
          useValue: {
            uploadFile: jest.fn().mockResolvedValue({
              url: 'http://localhost/test.png',
              name: 'test.png',
              type: 'image/png',
              size: 1000,
            }),
          },
        },
        {
          provide: 'REQUEST',
          useValue: {
            protocol: 'http',
            get: jest.fn().mockReturnValue('localhost'),
          },
        },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
    settingService = module.get<SettingService>(SettingService);
    minioService = module.get<MinioService>(MinioService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleUpload', () => {
    it('should throw error if file is missing', async () => {
      await expect(service.handleUpload('general', 'logo', null)).rejects.toThrow(BadRequestException);
    });

    it('should upload logo successfully', async () => {
      const result = await service.handleUpload('general', 'logo', mockFile);
      expect(result.data.url).toBe('http://localhost/test.png');
      expect(settingService.createOrUpdate).toHaveBeenCalled();
    });

    it('should validate logo size', async () => {
      const largeFile = { ...mockFile, size: 3 * 1024 * 1024 }; // 3MB
      await expect(service.handleUpload('general', 'logo', largeFile)).rejects.toThrow(BadRequestException);
    });

    it('should validate logo dimensions', async () => {
        (sharp as unknown as jest.Mock).mockImplementationOnce(() => ({
            metadata: jest.fn().mockResolvedValue({ width: 300, height: 300 }), // Wrong size
        }));
        await expect(service.handleUpload('general', 'logo', mockFile)).rejects.toThrow(BadRequestException);
    });

    it('should validate logo aspect ratio', async () => {
        (sharp as unknown as jest.Mock).mockImplementationOnce(() => ({
            metadata: jest.fn().mockResolvedValue({ width: 200, height: 100 }), // Not 1:1
        }));
        await expect(service.handleUpload('general', 'logo', mockFile)).rejects.toThrow(BadRequestException);
    });

    it('should upload favicon successfully', async () => {
        (sharp as unknown as jest.Mock).mockImplementationOnce(() => ({
            metadata: jest.fn().mockResolvedValue({ width: 32, height: 32 }),
        }));
        const result = await service.handleUpload('general', 'favicon', mockFile);
        expect(result.data.url).toBe('http://localhost/test.png');
    });

    it('should validate favicon dimensions', async () => {
        (sharp as unknown as jest.Mock).mockImplementationOnce(() => ({
            metadata: jest.fn().mockResolvedValue({ width: 100, height: 100 }), // Invalid size
        }));
        await expect(service.handleUpload('general', 'favicon', mockFile)).rejects.toThrow(BadRequestException);
    });
  });
});
