import { PrismaClient } from '@prisma/client';

export async function seedUsers(prisma: PrismaClient) {
  console.log('Seeding Users and Roles...');

  // 1. Create Sample Users
  const users = [
    { username: 'Combine', password: 'password' },
    { username: 'cc', password: 'password' },
    { username: 'admin', password: 'password' },
  ];

  for (const userData of users) {
    await prisma.user.upsert({
      where: { username: userData.username },
      update: { password: userData.password },
      create: {
        username: userData.username,
        password: userData.password,
      },
    });
  }

  // 2. Assign Super Admin role to 'admin' user
  const adminUser = await prisma.user.findUnique({ where: { username: 'admin' } });
  const superAdminRole = await (prisma as any).role.findUnique({ where: { name: 'Super Admin' } });

  if (adminUser && superAdminRole) {
    await (prisma as any).userRole.upsert({
      where: { 
        user_id_role_id: { 
          user_id: adminUser.id, 
          role_id: superAdminRole.id 
        } 
      },
      update: {},
      create: { 
        user_id: adminUser.id, 
        role_id: superAdminRole.id 
      },
    });
  }
}
