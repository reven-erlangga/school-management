import { Test, TestingModule } from '@nestjs/testing';
import { CityController } from './city.controller';
import { CityService } from './city.service';

describe('CityController', () => {
  let controller: CityController;
  let service: CityService;

  const mockCityService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    dropdown: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CityController],
      providers: [{ provide: CityService, useValue: mockCityService }],
    }).compile();

    controller = module.get<CityController>(CityController);
    service = module.get<CityService>(CityService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll returns wrapped response', async () => {
    mockCityService.findAll.mockResolvedValueOnce({
      data: [{ id: '1', name: 'Bandung' }],
      meta: { total: 1, page: 1, last_page: 1 },
    });

    const res: any = await controller.findAll({ state_code: 'JB' } as any);

    expect(service.findAll).toHaveBeenCalledWith({ state_code: 'JB' });
    expect(res.data).toEqual([{ id: '1', name: 'Bandung' }]);
  });

  it('findOne returns wrapped response', async () => {
    mockCityService.findOne.mockResolvedValueOnce({ id: '1', name: 'Bandung' });

    const res: any = await controller.findOne('1');

    expect(service.findOne).toHaveBeenCalledWith('1');
    expect(res.data).toEqual({ id: '1', name: 'Bandung' });
  });

  it('dropdown returns wrapped response', async () => {
    mockCityService.dropdown.mockResolvedValueOnce({
      data: [{ id: '1', name: 'Bandung' }],
      meta: { next_cursor: null, limit: 20 },
    });

    const res: any = await controller.dropdown({
      state_code: 'JB',
      limit: 20,
    } as any);

    expect(service.dropdown).toHaveBeenCalledWith({
      state_code: 'JB',
      limit: 20,
    });
    expect(res.data).toEqual([{ id: '1', name: 'Bandung' }]);
  });
});
