import { Injectable } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class RbacSeederService {
  constructor(private rbacService: RbacService, private prisma: PrismaService) {}

  async seed() {
    // 1. Seed Modules & Permissions
    // ... (rest of the code)
    const modules = [
      {
        name: 'institute',
        group: 'management',
        path: '/institutes',
        icon: 'grad',
        permissions: ['create', 'read', 'update', 'delete'],
      },
      {
        name: 'teacher',
        group: 'management',
        path: '/teachers',
        icon: 'community',
        permissions: ['create', 'read', 'update', 'delete'],
      },
      {
        name: 'student',
        group: 'academic',
        path: '/students',
        icon: 'grad',
        permissions: ['create', 'read', 'update', 'delete'],
      },
    ];

    const createdPermissions: Record<string, string> = {};

    for (const mod of modules) {
      const createdModule = await this.rbacService.createModule({
        name: mod.name,
        slug: mod.name, // Add slug property
        page: 'default', // Add page property
        group: mod.group,
        path: mod.path,
        icon: mod.icon,
      });

      for (const perm of mod.permissions) {
        const slug = `${mod.name}.${perm}`;
        const p = await this.rbacService.createPermission({
          name: slug,
          module_id: createdModule.id,
        });
        createdPermissions[slug] = p.id;
      }
    }

    // 2. Seed Roles
    const roles = [
      {
        name: 'super_admin',
        description: 'Super Admin with all permissions',
        permissions: Object.values(createdPermissions),
      },
      {
        name: 'admin',
        description: 'Admin with management access',
        permissions: Object.keys(createdPermissions)
          .filter(k => k.startsWith('institute') || k.startsWith('teacher'))
          .map(k => createdPermissions[k]),
      },
    ];

    for (const role of roles) {
      const createdRole = await this.rbacService.createRole({
        name: role.name,
        description: role.description,
        permission_ids: role.permissions,
        group: 'management',
      });

      // 3. Seed Users & User-Role Assignments
      const username = role.name === 'super_admin' ? 'superadmin' : 'admin';
      if (role.name === 'super_admin' || role.name === 'admin') {
        const user = await (this.prisma as any).user.upsert({
          where: { username },
          update: {},
          create: {
            username,
            password: 'password123', // In real app, hash this!
          },
        });

        await (this.prisma as any).userRole.upsert({
          where: {
            user_id_role_id: {
              user_id: user.id,
              role_id: createdRole.id,
            },
          },
          update: {},
          create: {
            user_id: user.id,
            role_id: createdRole.id,
          },
        });
      }
    }

    console.log('RBAC Seeding completed successfully');
  }
}
