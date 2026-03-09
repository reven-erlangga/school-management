import { PrismaClient } from '@prisma/client';

export async function seedReligion(prisma: PrismaClient) {
  console.log('Seeding Religions...');
  const religions = [
    { key: 'islam', name: 'Islam', description: 'Islamic Faith', is_active: true },
    { key: 'christian_protestant', name: 'Kristen Protestan', description: 'Protestantism', is_active: true },
    { key: 'christian_catholic', name: 'Katolik', description: 'Catholicism', is_active: true },
    { key: 'hindu', name: 'Hindu', description: 'Hinduism', is_active: true },
    { key: 'buddha', name: 'Buddha', description: 'Buddhism', is_active: true },
    { key: 'konghucu', name: 'Konghucu', description: 'Confucianism', is_active: true },
  ];

  for (const religion of religions) {
    await (prisma as any).religion.upsert({
      where: { key: religion.key },
      update: religion,
      create: religion,
    });
  }
}
