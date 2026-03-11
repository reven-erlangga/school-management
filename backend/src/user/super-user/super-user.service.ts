import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSuperUserDto } from './super-user.dto';
import { QueryBuilderService } from '../../common/query-builder/query-builder.service';

@Injectable()
export class SuperUserService {
  constructor(private readonly qb: QueryBuilderService) {}

  async create(dto: CreateSuperUserDto) {
    const email = dto.email.trim().toLowerCase();
    const username = email;

    const existing = (await this.qb
      .using('user', {})
      .findOne({ username })) as unknown as { id: string } | null;
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const role = (await this.qb
      .using('role', {})
      .findOne({ name: 'super_admin' })) as unknown as { id: string } | null;
    if (!role) {
      throw new NotFoundException('Required role "super_admin" not found');
    }

    const user = (await this.qb.using('user', {}).create({
      username,
      password: dto.password,
    })) as unknown as { id: string; username: string };

    await this.qb.using('userRole', {}).upsert(
      {
        user_id_role_id: {
          user_id: user.id,
          role_id: role.id,
        },
      },
      {
        user_id: user.id,
        role_id: role.id,
      },
    );

    return {
      id: user.id,
      username: user.username,
      email,
      name: dto.name,
      roles: ['super_admin'],
    };
  }
}
