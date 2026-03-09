import { Test, TestingModule } from '@nestjs/testing';
import { CaslAbilityFactory, Action } from './casl-ability.factory';

describe('CaslAbilityFactory', () => {
  let factory: CaslAbilityFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CaslAbilityFactory],
    }).compile();

    factory = module.get<CaslAbilityFactory>(CaslAbilityFactory);
  });

  it('should be defined', () => {
    expect(factory).toBeDefined();
  });

  it('should allow super_admin to manage all', () => {
    const user = { roles: ['super_admin'], permissions: [] };
    const ability = factory.createForUser(user);
    expect(ability.can(Action.Manage, 'all')).toBe(true);
    expect(ability.can(Action.Read, 'users')).toBe(true);
  });

  it('should allow user with specific permission', () => {
    const user = { roles: ['user'], permissions: ['users.view'] };
    const ability = factory.createForUser(user);
    expect(ability.can(Action.Read, 'users')).toBe(true);
    expect(ability.can(Action.Create, 'users')).toBe(false);
  });

  it('should map view to read', () => {
    const user = { roles: ['user'], permissions: ['users.view'] };
    const ability = factory.createForUser(user);
    expect(ability.can(Action.Read, 'users')).toBe(true);
  });
  
  it('should map edit to update', () => {
    const user = { roles: ['user'], permissions: ['users.edit'] };
    const ability = factory.createForUser(user);
    expect(ability.can(Action.Update, 'users')).toBe(true);
  });
});
