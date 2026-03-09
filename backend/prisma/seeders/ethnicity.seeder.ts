import { PrismaClient } from '@prisma/client';

export async function seedEthnicity(prisma: PrismaClient) {
  console.log('Seeding Ethnicities...');
  const ethnicities = [
    { key: 'javanese', name: 'Jawa', description: 'Suku Jawa', is_active: true },
    { key: 'sundanese', name: 'Sunda', description: 'Suku Sunda', is_active: true },
    { key: 'batak', name: 'Batak', description: 'Suku Batak', is_active: true },
    { key: 'madurese', name: 'Madura', description: 'Suku Madura', is_active: true },
    { key: 'minangkabau', name: 'Minangkabau', description: 'Suku Minang', is_active: true },
    { key: 'bugis', name: 'Bugis', description: 'Suku Bugis', is_active: true },
    { key: 'chinese_indonesian', name: 'Tionghoa', description: 'Chinese Indonesian', is_active: true },
  ];

  for (const ethnicity of ethnicities) {
    await (prisma as any).ethnicity.upsert({
      where: { key: ethnicity.key },
      update: ethnicity,
      create: ethnicity,
    });
  }
}
