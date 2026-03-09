import { Injectable } from '@nestjs/common';
import { IDynamicStorageRbac, IStorageRbac } from 'nestjs-rbac';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class RbacStorageService implements IDynamicStorageRbac {
  constructor(private readonly prisma: PrismaService) {}

  async getRbac(): Promise<IStorageRbac> {
    const roles = await (this.prisma as any).role.findMany();
    const permissions = await (this.prisma as any).permission.findMany({
      include: { module: true },
    });
    const rolePermissions = await (this.prisma as any).rolePermission.findMany({
      include: {
        role: true,
        permission: true,
      },
    });

    // Format permissions into { permissionName: ['action1', 'action2'] }
    // In our case, the action is usually the suffix after the dot, e.g., 'create' in 'teacher.create'
    // But nestjs-rbac allows us to map them directly. 
    // Let's simplify: the permission name is the key, and we can just use a default action like 'execute' or similar.
    // Or better: module name is permission, and actions are create, view, edit, delete.
    
    const rbacPermissions: Record<string, string[]> = {};
    permissions.forEach((p) => {
      const moduleName = p.module.name;
      const action = p.name.split('.')[1] || 'access';
      
      if (!rbacPermissions[moduleName]) {
        rbacPermissions[moduleName] = [];
      }
      if (!rbacPermissions[moduleName].includes(action)) {
        rbacPermissions[moduleName].push(action);
      }
    });

    // Format grants into { roleName: ['permission@action'] }
    const grants: Record<string, string[]> = {};
    rolePermissions.forEach((rp) => {
      const roleName = rp.role.name;
      const moduleName = rp.permission.name.split('.')[0];
      const action = rp.permission.name.split('.')[1] || 'access';
      const grant = `${moduleName}@${action}`;

      if (!grants[roleName]) {
        grants[roleName] = [];
      }
      grants[roleName].push(grant);
    });

    return {
      roles: roles.map((r) => r.name),
      permissions: rbacPermissions,
      grants: grants,
      filters: {}, // We can add custom filters if needed later
    };
  }
}
