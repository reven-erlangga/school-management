import { PrismaClient } from '@prisma/client';

export async function seedRoles(prisma: PrismaClient) {
  console.log('Seeding Roles and Permissions...');

  /**
   * Helper function to generate a clean slug from a string.
   */
  function generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .trim()
      .replace(/\s+/g, '-')     // Replace spaces with -
      .replace(/-+/g, '-');      // Replace multiple - with single -
  }

  const roles = [
    {
      name: 'Super Admin',
      slug: 'super_admin',
      description: 'Full access to everything',
      permissions: '*',
    },
  ];

  for (const roleData of roles) {
    const role = await (prisma as any).role.upsert({
      where: { name: roleData.name },
      update: { slug: roleData.slug, description: roleData.description },
      create: {
        name: roleData.name,
        slug: roleData.slug,
        description: roleData.description,
      },
    });

    let permissionsToAssign;
    if (roleData.permissions === '*') {
      permissionsToAssign = await (prisma as any).permission.findMany();
    } else {
      permissionsToAssign = await (prisma as any).permission.findMany({
        where: { slug: { in: roleData.permissions as unknown as string[] } },
      });
    }

    await (prisma as any).rolePermission.deleteMany({ where: { role_id: role.id } });
    await (prisma as any).rolePermission.createMany({
      data: permissionsToAssign.map((p: any) => ({
        role_id: role.id,
        permission_id: p.id,
      })),
    });
  }
}
