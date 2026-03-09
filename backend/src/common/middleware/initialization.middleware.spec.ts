import { Test, TestingModule } from '@nestjs/testing';
import { InitializationMiddleware } from './initialization.middleware';
import { InitializeService } from '../../initialize/initialize.service';
import { ServiceUnavailableException } from '@nestjs/common';

describe('InitializationMiddleware', () => {
  let middleware: InitializationMiddleware;
  let initializeService: InitializeService;

  const mockInitializeService = {
    isInitialized: jest.fn(),
  };

  const mockNext = jest.fn();
  const mockRequest = {};
  const mockResponse: any = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InitializationMiddleware,
        { provide: InitializeService, useValue: mockInitializeService },
      ],
    }).compile();

    middleware = module.get<InitializationMiddleware>(InitializationMiddleware);
    initializeService = module.get<InitializeService>(InitializeService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should call next() if system is initialized', async () => {
    mockInitializeService.isInitialized.mockResolvedValue(true);

    await middleware.use(mockRequest as any, mockResponse as any, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('should return 503 with JSON:API error format if system is not initialized', async () => {
    mockInitializeService.isInitialized.mockResolvedValue(false);

    const statusMock = jest.fn().mockReturnThis();
    const jsonMock = jest.fn();
    mockResponse.status = statusMock;
    mockResponse.json = jsonMock;

    await middleware.use(mockRequest as any, mockResponse as any, mockNext);
    
    expect(mockNext).not.toHaveBeenCalled();
    expect(statusMock).toHaveBeenCalledWith(503);
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
      errors: expect.arrayContaining([
        expect.objectContaining({
          code: 'SYSTEM_NOT_INITIALIZED',
          status: '503',
        })
      ]),
      jsonapi: expect.objectContaining({ version: '1.0' }),
      meta: expect.objectContaining({ timestamp: expect.any(String) }),
    }));
  });

  it('should throw ServiceUnavailableException on timeout or error', async () => {
    mockInitializeService.isInitialized.mockRejectedValue(new Error('Timeout'));

    await expect(
      middleware.use(mockRequest as any, mockResponse as any, mockNext),
    ).rejects.toThrow(Error);

    expect(mockNext).not.toHaveBeenCalled();
  });
});
