import { Test, TestingModule } from '@nestjs/testing';
import { StateController } from './state.controller';
import { StateService } from './state.service';

describe('StateController', () => {
  let controller: StateController;
  let service: StateService;

  const mockStateService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    dropdown: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StateController],
      providers: [{ provide: StateService, useValue: mockStateService }],
    }).compile();

    controller = module.get<StateController>(StateController);
    service = module.get<StateService>(StateService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll returns wrapped response', async () => {
    mockStateService.findAll.mockResolvedValueOnce({
      data: [{ id: '1', name: 'Jawa Barat' }],
      meta: { total: 1, page: 1, last_page: 1 },
    });

    const res: any = await controller.findAll({ iso3: 'IDN' } as any);

    expect(service.findAll).toHaveBeenCalledWith({ iso3: 'IDN' });
    expect(res.data).toEqual([{ id: '1', name: 'Jawa Barat' }]);
  });

  it('findOne returns wrapped response', async () => {
    mockStateService.findOne.mockResolvedValueOnce({
      id: '1',
      name: 'Jawa Barat',
    });

    const res: any = await controller.findOne('1');

    expect(service.findOne).toHaveBeenCalledWith('1');
    expect(res.data).toEqual({ id: '1', name: 'Jawa Barat' });
  });

  it('dropdown returns wrapped response', async () => {
    mockStateService.dropdown.mockResolvedValueOnce({
      data: [{ id: '1', name: 'Jawa Barat', state_code: 'JB' }],
      meta: { next_cursor: null, limit: 20 },
    });

    const res: any = await controller.dropdown({
      iso3: 'IDN',
      limit: 20,
    } as any);

    expect(service.dropdown).toHaveBeenCalledWith({ iso3: 'IDN', limit: 20 });
    expect(res.data).toEqual([
      { id: '1', name: 'Jawa Barat', state_code: 'JB' },
    ]);
  });
});
