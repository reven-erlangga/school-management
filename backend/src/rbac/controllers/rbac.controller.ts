import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RbacService } from '../services/rbac.service';
import { RbacSeederService } from '../services/rbac-seeder.service';
import { CreateModuleDto } from '../dto/create-module.dto';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { CreateRoleDto } from '../dto/create-role.dto';

@ApiTags('RBAC')
@Controller('rbac')
export class RbacController {
  constructor(
    private readonly rbacService: RbacService,
    private readonly seederService: RbacSeederService,
  ) {}

  @Post('seed')
  @ApiOperation({ summary: 'Seed RBAC data' })
  seed() {
    return this.seederService.seed();
  }

  // --- Module Endpoints ---

  @Post('modules')
  @ApiOperation({ summary: 'Create a new module' })
  createModule(@Body() dto: CreateModuleDto) {
    return this.rbacService.createModule(dto);
  }

  @Get('modules')
  @ApiOperation({ summary: 'Get all modules' })
  findAllModules() {
    return this.rbacService.findAllModules();
  }

  @Get('modules/:id')
  @ApiOperation({ summary: 'Get module by id' })
  findOneModule(@Param('id') id: string) {
    return this.rbacService.findOneModule(id);
  }

  @Delete('modules/:id')
  @ApiOperation({ summary: 'Delete module by id' })
  deleteModule(@Param('id') id: string) {
    return this.rbacService.deleteModule(id);
  }

  // --- Permission Endpoints ---

  @Post('permissions')
  @ApiOperation({ summary: 'Create a new permission' })
  createPermission(@Body() dto: CreatePermissionDto) {
    return this.rbacService.createPermission(dto);
  }

  @Get('permissions')
  @ApiOperation({ summary: 'Get all permissions' })
  findAllPermissions() {
    return this.rbacService.findAllPermissions();
  }

  @Get('permissions/:id')
  @ApiOperation({ summary: 'Get permission by id' })
  findOnePermission(@Param('id') id: string) {
    return this.rbacService.findOnePermission(id);
  }

  @Delete('permissions/:id')
  @ApiOperation({ summary: 'Delete permission by id' })
  deletePermission(@Param('id') id: string) {
    return this.rbacService.deletePermission(id);
  }

  // --- Role Endpoints ---

  @Post('roles')
  @ApiOperation({ summary: 'Create a new role' })
  createRole(@Body() dto: CreateRoleDto) {
    return this.rbacService.createRole(dto);
  }

  @Get('roles')
  @ApiOperation({ summary: 'Get all roles' })
  findAllRoles() {
    return this.rbacService.findAllRoles();
  }

  @Get('roles/:id')
  @ApiOperation({ summary: 'Get role by id' })
  findOneRole(@Param('id') id: string) {
    return this.rbacService.findOneRole(id);
  }

  @Delete('roles/:id')
  @ApiOperation({ summary: 'Delete role by id' })
  deleteRole(@Param('id') id: string) {
    return this.rbacService.deleteRole(id);
  }

  @Put('roles/:id/permissions')
  @ApiOperation({ summary: 'Assign permissions to a role' })
  assignPermissions(
    @Param('id') id: string,
    @Body('permission_ids') permissionIds: string[],
  ) {
    return this.rbacService.assignPermissionsToRole(id, permissionIds);
  }
}
