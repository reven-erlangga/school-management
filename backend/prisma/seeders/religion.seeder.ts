import { PrismaClient } from '@prisma/client';

export async function seedReligion(prisma: PrismaClient) {
  console.log('Seeding Religions...');
  const religions = [
    {
      key: 'islam',
      name: { en: 'Islam', id: 'Islam' },
      description: { en: 'Islamic Faith', id: 'Agama Islam' },
      is_active: true,
    },
    {
      key: 'christian_protestant',
      name: { en: 'Protestant Christian', id: 'Kristen Protestan' },
      description: { en: 'Protestantism', id: 'Protestan' },
      is_active: true,
    },
    {
      key: 'christian_catholic',
      name: { en: 'Catholic', id: 'Katolik' },
      description: { en: 'Catholicism', id: 'Katolik' },
      is_active: true,
    },
    {
      key: 'hindu',
      name: { en: 'Hindu', id: 'Hindu' },
      description: { en: 'Hinduism', id: 'Hinduisme' },
      is_active: true,
    },
    {
      key: 'buddha',
      name: { en: 'Buddha', id: 'Buddha' },
      description: { en: 'Buddhism', id: 'Buddhisme' },
      is_active: true,
    },
    {
      key: 'konghucu',
      name: { en: 'Confucian', id: 'Konghucu' },
      description: { en: 'Confucianism', id: 'Konghucu' },
      is_active: true,
    },
  ];

  for (const religion of religions) {
    await prisma.religion.upsert({
      where: { key: religion.key },
      update: religion,
      create: religion,
    });
  }
}
