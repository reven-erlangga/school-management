import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateModuleDto } from '../dto/create-module.dto';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { CreateRoleDto } from '../dto/create-role.dto';

@Injectable()
export class RbacService {
  constructor(private prisma: PrismaService) {}

  // --- Module Operations ---

  async createModule(dto: CreateModuleDto) {
    const existing = await (this.prisma as any).module.findUnique({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException(
        `Module with name ${dto.name} already exists`,
      );
    }
    return (this.prisma as any).module.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        group: dto.group,
        page: dto.page,
        path: dto.path,
        icon: dto.icon,
        meta: dto.meta,
        config: dto.config,
        endpoints: dto.endpoints,
        forms: dto.forms,
      },
    });
  }

  async findAllModules() {
    const modules = await (this.prisma as any).module.findMany({
      where: { parent_id: null },
      include: {
        permissions: true,
        subModules: {
          include: { permissions: true },
        },
      },
    });

    const transformedModules = modules.map((module) => {
      let parsedConfig = module.config || {};
      let parsedMeta = module.meta || {};
      let parsedEndpoints = module.endpoints || [];
      let parsedForms = module.forms || [];
      try {
        if (module.config && typeof module.config === 'string') {
          parsedConfig = JSON.parse(module.config);
        }
        if (module.meta && typeof module.meta === 'string') {
          parsedMeta = JSON.parse(module.meta);
        }
        if (module.endpoints && typeof module.endpoints === 'string') {
          parsedEndpoints = JSON.parse(module.endpoints);
        }
        if (module.forms && typeof module.forms === 'string') {
          parsedForms = JSON.parse(module.forms);
        }
      } catch (e) {
        console.error(`Failed to parse JSON for ${module.slug}:`, e);
      }

      const subModules = (module.subModules || []).map((sub) => {
        let parsedSubConfig = sub.config || {};
        let parsedSubMeta = sub.meta || {};
        let parsedSubEndpoints = sub.endpoints || [];
        let parsedSubForms = sub.forms || [];
        try {
          if (sub.config && typeof sub.config === 'string') {
            parsedSubConfig = JSON.parse(sub.config);
          }
          if (sub.meta && typeof sub.meta === 'string') {
            parsedSubMeta = JSON.parse(sub.meta);
          }
          if (sub.endpoints && typeof sub.endpoints === 'string') {
            parsedSubEndpoints = JSON.parse(sub.endpoints);
          }
          if (sub.forms && typeof sub.forms === 'string') {
            parsedSubForms = JSON.parse(sub.forms);
          }
        } catch (e) {
          console.error(`Failed to parse JSON for sub-module ${sub.slug}:`, e);
        }
        return {
          ...sub,
          config: parsedSubConfig,
          meta: parsedSubMeta,
          endpoints: parsedSubEndpoints,
          forms: parsedSubForms,
        };
      });

      return {
        ...module,
        config: parsedConfig,
        meta: parsedMeta,
        endpoints: parsedEndpoints,
        forms: parsedForms,
        subModules,
      };
    });

    return transformedModules;
  }

  async findOneModule(id: string) {
    const module = await (this.prisma as any).module.findUnique({
      where: { id },
      include: { permissions: true },
    });
    if (!module) throw new NotFoundException('Module not found');
    return module;
  }

  async deleteModule(id: string) {
    await this.findOneModule(id);
    return (this.prisma as any).module.delete({ where: { id } });
  }

  // --- Permission Operations ---

  async createPermission(dto: CreatePermissionDto) {
    const module = await (this.prisma as any).module.findUnique({
      where: { id: dto.module_id },
    });
    if (!module) throw new NotFoundException('Module not found');

    const existing = await (this.prisma as any).permission.findUnique({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException(
        `Permission with name ${dto.name} already exists`,
      );
    }

    return (this.prisma as any).permission.create({
      data: {
        name: dto.name,
        description: dto.description,
        module_id: dto.module_id,
      },
    });
  }

  async findAllPermissions() {
    return (this.prisma as any).permission.findMany({
      include: { module: true },
    });
  }

  async findOnePermission(id: string) {
    const permission = await (this.prisma as any).permission.findUnique({
      where: { id },
      include: { module: true },
    });
    if (!permission) throw new NotFoundException('Permission not found');
    return permission;
  }

  async deletePermission(id: string) {
    await this.findOnePermission(id);
    return (this.prisma as any).permission.delete({ where: { id } });
  }

  // --- Role Operations ---

  async createRole(dto: CreateRoleDto) {
    const existing = await (this.prisma as any).role.findUnique({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException(`Role with name ${dto.name} already exists`);
    }

    const role = await (this.prisma as any).role.create({
      data: {
        name: dto.name,
        description: dto.description,
        group: dto.group,
      },
    });

    if (dto.permission_ids && dto.permission_ids.length > 0) {
      await (this.prisma as any).rolePermission.createMany({
        data: dto.permission_ids.map((pId) => ({
          role_id: role.id,
          permission_id: pId,
        })),
      });
    }

    return this.findOneRole(role.id);
  }

  async findAllRoles() {
    return (this.prisma as any).role.findMany({
      include: {
        rolePermissions: {
          include: { permission: true },
        },
      },
    });
  }

  async findOneRole(id: string) {
    const role = await (this.prisma as any).role.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: { permission: true },
        },
      },
    });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async deleteRole(id: string) {
    await this.findOneRole(id);
    return (this.prisma as any).role.delete({ where: { id } });
  }

  async assignPermissionsToRole(roleId: string, permissionIds: string[]) {
    await this.findOneRole(roleId);

    // Clear existing permissions first
    await (this.prisma as any).rolePermission.deleteMany({
      where: { role_id: roleId },
    });

    // Assign new ones
    if (permissionIds.length > 0) {
      await (this.prisma as any).rolePermission.createMany({
        data: permissionIds.map((pId) => ({
          role_id: roleId,
          permission_id: pId,
        })),
      });
    }

    return this.findOneRole(roleId);
  }

  // --- Authorization Logic (Delegated to nestjs-rbac) ---

  // You can still keep this for manual checks if needed, but the guard is preferred
  async checkPermission(
    roleName: string,
    permissionName: string,
  ): Promise<boolean> {
    // This is now handled by the library, but if you need manual checks,
    // you would typically inject the RbacService from nestjs-rbac here.
    return false; // Or implement using library logic
  }
}
