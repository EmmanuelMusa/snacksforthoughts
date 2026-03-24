import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data...');

  // 1. Create some Farmer users
  const farmersCount = await prisma.user.count({ where: { role: 'FARMER' } });
  if (farmersCount === 0) {
    await prisma.user.createMany({
      data: [
        { name: 'Ibrahim Adamu', email: 'ibrahim@farm.ng', nin: '12345678901', role: 'FARMER', passwordHash: 'hashed_password' },
        { name: 'Olapade John', email: 'olapade@farm.ng', nin: '12345678902', role: 'FARMER', passwordHash: 'hashed_password' },
        { name: 'Chima Obi', email: 'chima@farm.ng', nin: '12345678903', role: 'FARMER', passwordHash: 'hashed_password' },
      ]
    });
    console.log('Created mock farmers.');
  }

  // 2. Create some school reports
  const reportsCount = await prisma.schoolReport.count();
  if (reportsCount === 0) {
    const schools = await prisma.school.findMany({ take: 10 });
    if (schools.length > 0) {
      await prisma.schoolReport.createMany({
        data: schools.map(s => ({
          schoolId: s.id,
          pupilsFedToday: Math.floor(Math.random() * 200) + 100,
          menuServed: 'Jollof Rice and Beans',
          vendorName: 'Local Caterer A',
          qualityScore: 5
        }))
      });
      console.log('Created mock school reports.');
    }
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
