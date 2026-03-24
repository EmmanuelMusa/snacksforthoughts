const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const schools = await prisma.school.findMany({
        take: 50,
        select: { lga: true, state: true }
    });
    
    const users = await prisma.user.findMany({
        where: { role: 'LGA_MONITOR' },
        select: { lga: true, state: true }
    });
    
    console.log('Sample Schools LGA sample:');
    console.table(schools.slice(0, 10));
    
    console.log('LGA Monitor Users:');
    console.table(users);
    
    const distinctLgas = await prisma.school.findMany({
        distinct: ['lga'],
        select: { lga: true }
    });
    console.log('Distinct LGAs in Schools table:', distinctLgas.map(l => l.lga));
}

main().catch(console.error).finally(() => prisma.$disconnect());
