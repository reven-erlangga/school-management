import { Test, TestingModule } from '@nestjs/testing';
import { SuperUserService } from './super-user.service';
import { QueryBuilderService } from '../../common/query-builder/query-builder.service';

describe('SuperUserService', () => {
  let service: SuperUserService;
  let qb: {
    using: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
    upsert: jest.Mock;
  };

  beforeEach(async () => {
    const qbMock = {
      using: jest.fn().mockReturnThis(),
      findOne: jest.fn(),
      create: jest.fn(),
      upsert: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuperUserService,
        { provide: QueryBuilderService, useValue: qbMock },
      ],
    }).compile();

    service = module.get<SuperUserService>(SuperUserService);
    qb = qbMock;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create super admin successfully', async () => {
    qb.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce({
      id: 'role1',
    });
    qb.create.mockResolvedValue({
      id: 'u1',
      username: 'admin@domain.com',
    });
    qb.upsert.mockResolvedValue({});

    const result = await service.create({
      name: 'Super Admin',
      email: 'admin@domain.com',
      password: 'StrongPassword123',
    });

    expect(qb.using).toHaveBeenCalledWith('user', {});
    expect(qb.findOne).toHaveBeenCalledWith({ username: 'admin@domain.com' });
    expect(qb.findOne).toHaveBeenCalledWith({ name: 'super_admin' });
    expect(qb.create).toHaveBeenCalled();
    expect(qb.upsert).toHaveBeenCalledWith(
      {
        user_id_role_id: {
          user_id: 'u1',
          role_id: 'role1',
        },
      },
      { user_id: 'u1', role_id: 'role1' },
    );
    expect(result.roles).toEqual(['super_admin']);
  });
});
