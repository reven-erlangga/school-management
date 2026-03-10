import { Test, TestingModule } from '@nestjs/testing';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';

describe('CountryController', () => {
  let controller: CountryController;
  let service: CountryService;

  const mockCountryService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    dropdown: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountryController],
      providers: [{ provide: CountryService, useValue: mockCountryService }],
    }).compile();

    controller = module.get<CountryController>(CountryController);
    service = module.get<CountryService>(CountryService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll returns wrapped response', async () => {
    mockCountryService.findAll.mockResolvedValueOnce({
      data: [{ id: '1', name: 'Indonesia' }],
      meta: { total: 1, page: 1, last_page: 1 },
    });

    const res: any = await controller.findAll({ page: 1, limit: 10 } as any);

    expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    expect(res.data).toEqual([{ id: '1', name: 'Indonesia' }]);
    expect(res.meta).toMatchObject({ total: 1, page: 1, last_page: 1 });
  });

  it('findOne returns wrapped response', async () => {
    mockCountryService.findOne.mockResolvedValueOnce({ id: '1', name: 'IDN' });

    const res: any = await controller.findOne('1');

    expect(service.findOne).toHaveBeenCalledWith('1');
    expect(res.data).toEqual({ id: '1', name: 'IDN' });
  });

  it('dropdown returns wrapped response', async () => {
    mockCountryService.dropdown.mockResolvedValueOnce({
      data: [{ id: '1', name: 'Indonesia', iso3: 'IDN' }],
      meta: { next_cursor: null, limit: 20 },
    });

    const res: any = await controller.dropdown({ limit: 20 } as any);

    expect(service.dropdown).toHaveBeenCalledWith({ limit: 20 });
    expect(res.data).toEqual([{ id: '1', name: 'Indonesia', iso3: 'IDN' }]);
    expect(res.meta).toMatchObject({ next_cursor: null, limit: 20 });
  });
});
