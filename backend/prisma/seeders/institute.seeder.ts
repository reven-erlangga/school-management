import { PrismaClient } from '@prisma/client';

export async function seedInstitutes(prisma: PrismaClient) {
  console.log('Seeding Institutes...');

  // 1. Get existing users to assign as admins
  const combineUser = await prisma.user.findUnique({ where: { username: 'Combine' } });
  const ccUser = await prisma.user.findUnique({ where: { username: 'cc' } });

  // 2. Define Sample Institutes
  const institutes = [
    { 
      name: 'aa', 
      type: 'school', 
      admin_id: combineUser?.id, 
      status: 'active', 
      teacher_count: 10, 
      student_count: 150, 
      staff_count: 5,
      address: 'Main Street No. 1'
    },
    { 
      name: 'cc', 
      type: 'school', 
      admin_id: ccUser?.id, 
      status: 'active', 
      teacher_count: 5, 
      student_count: 80, 
      staff_count: 2,
      address: 'Center Road No. 45'
    },
    { 
      name: 'xx', 
      type: 'school', 
      admin_id: combineUser?.id, 
      status: 'active', 
      teacher_count: 8, 
      student_count: 120, 
      staff_count: 3,
      address: 'West Avenue No. 12'
    },
    { 
      name: 'Cambridge International School', 
      type: 'School', 
      address: '123 Education Street, London', 
      admin_id: null, 
      status: 'active', 
      teacher_count: 15, 
      student_count: 200, 
      staff_count: 10 
    },
    { 
      name: 'Oxford Polytechnic Institute', 
      type: 'Mixed', 
      address: '789 Learning Lane, Oxford', 
      admin_id: null, 
      status: 'active', 
      teacher_count: 25, 
      student_count: 500, 
      staff_count: 15 
    },
    { 
      name: 'Harvard University', 
      type: 'University', 
      address: '456 Academic Avenue, Boston', 
      admin_id: null, 
      status: 'active', 
      teacher_count: 40, 
      student_count: 1200, 
      staff_count: 30 
    },
  ];

  for (const inst of institutes) {
    const existing = await (prisma as any).institute.findFirst({
      where: { name: inst.name }
    });

    if (!existing) {
      await (prisma as any).institute.create({
        data: inst
      });
      console.log(`Created institute: ${inst.name}`);
    } else {
      await (prisma as any).institute.update({
        where: { id: existing.id },
        data: inst
      });
      console.log(`Updated institute: ${inst.name}`);
    }
  }
}
