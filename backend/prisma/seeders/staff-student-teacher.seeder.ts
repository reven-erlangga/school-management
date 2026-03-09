import { PrismaClient } from '@prisma/client';

export async function seedStaffStudentTeacher(prisma: PrismaClient) {
  console.log('Seeding Staff, Students, and Teachers...');

  // 1. Get existing institutes
  const institutes = await prisma.institute.findMany();

  if (institutes.length === 0) {
    console.log('No institutes found. Skipping Staff/Student/Teacher seeder.');
    return;
  }

  const inst1 = institutes[0];
  const inst2 = institutes[1] || inst1;

  // 2. Seed Teachers
  console.log('Seeding Teachers...');
  const teachers = [
    { name: 'John Doe', email: 'john.doe@example.com', phone: '123456789', institute_id: inst1.id },
    { name: 'Jane Smith', email: 'jane.smith@example.com', phone: '987654321', institute_id: inst1.id },
    { name: 'Michael Brown', email: 'michael.brown@example.com', phone: '555666777', institute_id: inst2.id },
  ];

  for (const teacher of teachers) {
    await (prisma as any).teacher.upsert({
      where: { email: teacher.email },
      update: teacher,
      create: teacher,
    });
  }

  // 3. Seed Students
  console.log('Seeding Students...');
  const students = [
    { name: 'Alice Johnson', email: 'alice.j@student.com', phone: '111222333', institute_id: inst1.id },
    { name: 'Bob Wilson', email: 'bob.w@student.com', phone: '444555666', institute_id: inst1.id },
    { name: 'Charlie Davis', email: 'charlie.d@student.com', phone: '777888999', institute_id: inst2.id },
  ];

  for (const student of students) {
    await (prisma as any).student.upsert({
      where: { email: student.email },
      update: student,
      create: student,
    });
  }

  // 4. Seed Staff
  console.log('Seeding Staff...');
  const staffMembers = [
    { name: 'Robert Miller', email: 'robert.m@staff.com', phone: '222333444' },
    { name: 'Sarah Connor', email: 'sarah.c@staff.com', phone: '555444333' },
  ];

  for (const staffData of staffMembers) {
    const staff = await (prisma as any).staff.upsert({
      where: { email: staffData.email },
      update: staffData,
      create: staffData,
    });

    // Connect staff to institutes (Many-to-Many)
    await (prisma as any).staffInstitute.upsert({
      where: {
        staff_id_institute_id: {
          staff_id: staff.id,
          institute_id: inst1.id,
        },
      },
      update: {},
      create: {
        staff_id: staff.id,
        institute_id: inst1.id,
      },
    });

    if (staffData.email === 'robert.m@staff.com') {
      await (prisma as any).staffInstitute.upsert({
        where: {
          staff_id_institute_id: {
            staff_id: staff.id,
            institute_id: inst2.id,
          },
        },
        update: {},
        create: {
          staff_id: staff.id,
          institute_id: inst2.id,
        },
      });
    }
  }

  // 5. Update counts in Institute table
  console.log('Updating institute counts...');
  for (const inst of institutes) {
    const teacherCount = await (prisma as any).teacher.count({ where: { institute_id: inst.id } });
    const studentCount = await (prisma as any).student.count({ where: { institute_id: inst.id } });
    const staffCount = await (prisma as any).staffInstitute.count({ where: { institute_id: inst.id } });

    await (prisma as any).institute.update({
      where: { id: inst.id },
      data: {
        teacher_count: teacherCount,
        student_count: studentCount,
        staff_count: staffCount,
      },
    });
  }
}
