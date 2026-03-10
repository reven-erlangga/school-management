import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting Unit & Stream Seeder...');

  // 1. Get Institutes
  const oxford = await (prisma as any).institute.findFirst({
    where: { name: 'Oxford Polytechnic Institute' },
  });
  const harvard = await (prisma as any).institute.findFirst({
    where: { name: 'Harvard University' },
  });
  const cambridge = await (prisma as any).institute.findFirst({
    where: { name: 'Cambridge International School' },
  });

  if (!oxford || !harvard || !cambridge) {
    console.log('Institutes not found. Please run institute.seeder.ts first.');
    return;
  }

  // 2. Create Units
  const units = [
    {
      name: 'Oxford Technical Unit',
      code: 'OTU',
      description: 'Technical education unit for Oxford Polytechnic Institute',
      status: 'active',
      institute_id: oxford.id,
    },
    {
      name: 'Harvard Business Unit',
      code: 'HBU',
      description: 'Business education unit for Harvard University',
      status: 'active',
      institute_id: harvard.id,
    },
    {
      name: 'Cambridge Primary Unit',
      code: 'CPU',
      description: 'Primary education unit for Cambridge International School',
      status: 'active',
      institute_id: cambridge.id,
    },
  ];

  for (const u of units) {
    const existing = await (prisma as any).unit.findFirst({
      where: { name: u.name },
    });
    if (!existing) {
      await (prisma as any).unit.create({ data: u });
      console.log(`Created Unit: ${u.name}`);
    }
  }

  // 3. Create Streams
  const streams = [
    {
      name: 'Computer Science Stream',
      code: 'CS',
      description: 'Computer Science and IT',
      status: 'active',
      institute_id: oxford.id,
    },
    {
      name: 'Engineering Stream',
      code: 'ENG',
      description: 'Engineering and Technology',
      status: 'active',
      institute_id: oxford.id,
    },
    {
      name: 'Medicine Stream',
      code: 'MED',
      description: 'Medical Sciences',
      status: 'active',
      institute_id: harvard.id,
    },
    {
      name: 'Law Stream',
      code: 'LAW',
      description: 'Legal Studies',
      status: 'active',
      institute_id: harvard.id,
    },
    {
      name: 'MBA Stream',
      code: 'MBA',
      description: 'Master of Business Administration',
      status: 'active',
      institute_id: harvard.id,
    },
  ];

  for (const s of streams) {
    const existing = await (prisma as any).stream.findFirst({
      where: { name: s.name },
    });
    if (!existing) {
      await (prisma as any).stream.create({ data: s });
      console.log(`Created Stream: ${s.name}`);
    }
  }

  console.log('Unit & Stream seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
