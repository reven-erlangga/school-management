import { PrismaClient } from '@prisma/client';

export async function seedGender(prisma: PrismaClient) {
  console.log('Seeding Genders...');
  const genders = [
    { 
      key: 'male', 
      name: JSON.stringify({ en: 'Male', id: 'Laki-laki' }), 
      description: JSON.stringify({ en: 'Male gender', id: 'Jenis kelamin laki-laki' }) 
    },
    { 
      key: 'female', 
      name: JSON.stringify({ en: 'Female', id: 'Perempuan' }), 
      description: JSON.stringify({ en: 'Female gender', id: 'Jenis kelamin perempuan' }) 
    },
  ];

  for (const gender of genders) {
    await (prisma as any).gender.upsert({
      where: { key: gender.key },
      update: gender,
      create: gender,
    });
  }
}
