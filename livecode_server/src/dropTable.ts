import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function dropTables() {
  const tables = await prisma.$queryRaw<
    Array<{ table_name: string }>
  >`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';`;

  for (const { table_name } of tables) {
    console.log(`Dropping table: ${table_name}`);
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "${table_name}" CASCADE;`);
  }

  console.log('All tables dropped.');
}

dropTables()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
