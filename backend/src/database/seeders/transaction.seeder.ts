import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting transaction seeder...');

  // 1. Create Transaction Categories
  const tuition = await prisma.transactionCategory.upsert({
    where: { name: 'Tuition Fee' },
    update: {},
    create: {
      name: 'Tuition Fee',
      type: 'INCOME',
      description: 'Student tuition payments',
    },
  });

  const salary = await prisma.transactionCategory.upsert({
    where: { name: 'Teacher Salary' },
    update: {},
    create: {
      name: 'Teacher Salary',
      type: 'EXPENSE',
      description: 'Monthly salary for teachers',
    },
  });

  const operational = await prisma.transactionCategory.upsert({
    where: { name: 'Operational Cost' },
    update: {},
    create: {
      name: 'Operational Cost',
      type: 'EXPENSE',
      description: 'General operational costs',
    },
  });

  console.log('Categories created/verified.');

  // 2. Clean existing transactions to avoid duplicates
  await prisma.transaction.deleteMany({});
  console.log('Existing transactions cleared.');

  // 3. Create Sample Transactions
  const transactions = [
    // Income
    {
      description: 'SPP Bulan Mei - John Doe',
      amount: 500000,
      type: 'INCOME',
      category_id: tuition.id,
      date: new Date('2024-05-01'),
    },
    {
      description: 'SPP Bulan Mei - Jane Smith',
      amount: 500000,
      type: 'INCOME',
      category_id: tuition.id,
      date: new Date('2024-05-02'),
    },
    {
      description: 'SPP Bulan Juni - John Doe',
      amount: 500000,
      type: 'INCOME',
      category_id: tuition.id,
      date: new Date('2024-06-01'),
    },

    // Expenses
    {
      description: 'Gaji Guru - Mr. Budi',
      amount: 3500000,
      type: 'EXPENSE',
      category_id: salary.id,
      date: new Date('2024-05-25'),
    },
    {
      description: 'Gaji Guru - Mrs. Ani',
      amount: 3200000,
      type: 'EXPENSE',
      category_id: salary.id,
      date: new Date('2024-05-25'),
    },
    {
      description: 'Biaya Listrik & Internet - Mei',
      amount: 1200000,
      type: 'EXPENSE',
      category_id: operational.id,
      date: new Date('2024-05-28'),
    },
    {
      description: 'Pembelian ATK',
      amount: 450000,
      type: 'EXPENSE',
      category_id: operational.id,
      date: new Date('2024-06-03'),
    },
  ];

  for (const trans of transactions) {
    await prisma.transaction.create({ data: trans });
  }

  console.log(`${transactions.length} sample transactions created.`);
  console.log('Transaction seeder finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
