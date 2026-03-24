import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const state = 'FCT'; // Example state
  const suppliers = await (prisma.user as any).findMany({
    where: {
        role: 'SUPPLIER',
        state: {
            equals: state,
            mode: 'insensitive'
        },
        isActive: true
    },
    select: {
        id: true,
        name: true,
        companyName: true,
        accountDetails: true,
        contactInfo: true,
        state: true,
        lga: true
    }
  });

  console.log(`Suppliers for ${state}:`, suppliers.length, suppliers);

  const schools = await prisma.school.findMany({ select: { state: true }, take: 5 });
  console.log('Sample schools states:', schools);
}

main().catch(console.error).finally(() => prisma.$disconnect())
