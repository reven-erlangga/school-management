import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PoliciesGuard } from '../common/casl/policies.guard';
import { CheckPolicies } from '../common/casl/check-policies.decorator';
import { AppAbility, Action } from '../common/casl/casl-ability.factory';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'users'))
  @ApiOperation({ summary: 'List all users with filters' })
  findAll(@Query() query: any) {
    return this.userService.findAll(query);
  }
}
