import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import { seedModules } from './module.seeder';
import { seedRoles } from './role.seeder';
import { seedUsers } from './user.seeder';
import { seedInstitutes } from './institute.seeder';
import { seedReligion } from './religion.seeder';
import { seedEthnicity } from './ethnicity.seeder';
import { seedGender } from './gender.seeder';
import { seedStaffStudentTeacher } from './staff-student-teacher.seeder';

async function cleanup(prisma: PrismaClient) {
  console.log('Cleaning up existing data...');
  
  // Junction/Link tables first
  await (prisma as any).userRole.deleteMany();
  await (prisma as any).rolePermission.deleteMany();
  await (prisma as any).staffInstitute.deleteMany();
  await (prisma as any).bannerInstitute.deleteMany();
  
  // Child tables
  await (prisma as any).teacher.deleteMany();
  await (prisma as any).student.deleteMany();
  await (prisma as any).staff.deleteMany();
  await (prisma as any).unit.deleteMany();
  await (prisma as any).stream.deleteMany();
  await (prisma as any).invoice.deleteMany();
  await (prisma as any).transaction.deleteMany();
  await (prisma as any).article.deleteMany();
  
  // Parent tables
  await (prisma as any).institute.deleteMany();
  await (prisma as any).user.deleteMany();
  await (prisma as any).role.deleteMany();
  await (prisma as any).permission.deleteMany();
  await (prisma as any).module.deleteMany();
  await (prisma as any).religion.deleteMany();
  await (prisma as any).ethnicity.deleteMany();
  await (prisma as any).gender.deleteMany();
  await (prisma as any).transactionCategory.deleteMany();
  await (prisma as any).articleCategory.deleteMany();
  await (prisma as any).banner.deleteMany();
  await (prisma as any).financeReport.deleteMany();
  await (prisma as any).setting.deleteMany();

  console.log('Cleanup completed.');
}

async function main() {
  console.log('--- STARTING ALL SEEDERS ---');

  try {
    await cleanup(prisma);

    // Order matters if there are foreign key constraints
    await seedModules(prisma);
    await seedRoles(prisma);
    await seedUsers(prisma);
    await seedReligion(prisma);
    await seedEthnicity(prisma);
    await seedGender(prisma);
    await seedInstitutes(prisma);
    await seedStaffStudentTeacher(prisma);

    console.log('--- ALL SEEDERS COMPLETED SUCCESSFULLY ---');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
