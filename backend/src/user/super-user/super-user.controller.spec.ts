import { Test, TestingModule } from '@nestjs/testing';
import { SuperUserController } from './super-user.controller';
import { SuperUserService } from './super-user.service';

describe('SuperUserController', () => {
  let controller: SuperUserController;
  let service: SuperUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuperUserController],
      providers: [
        {
          provide: SuperUserService,
          useValue: {
            create: jest.fn().mockResolvedValue({
              id: 'u1',
              username: 'admin@domain.com',
              email: 'admin@domain.com',
              name: 'Super Admin',
              roles: ['super_admin'],
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<SuperUserController>(SuperUserController);
    service = module.get<SuperUserService>(SuperUserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should wrap response with toResponse', async () => {
    const res: any = await controller.create({
      name: 'Super Admin',
      email: 'admin@domain.com',
      password: 'StrongPassword123',
    } as any);
    expect(service.create).toHaveBeenCalled();
    expect(res).toHaveProperty('data');
    expect(res).toHaveProperty('meta');
    expect(res.data.username).toBe('admin@domain.com');
  });
});
