const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const schools = await prisma.school.findMany({
        where: { lga: 'IKEJA' },
        take: 1
    });
    console.log("Ikeja School:", JSON.stringify(schools[0], null, 2));

    const nationalUsers = await prisma.user.findMany({
        where: { role: 'NATIONAL_CMD' }
    });
    console.log("National Users:", JSON.stringify(nationalUsers, null, 2));

    const reporter = await prisma.user.findFirst({
        where: { role: 'SCHOOL_REPORTER' }
    });
    console.log("Sample Reporter:", JSON.stringify(reporter, null, 2));
}

main()
    .catch(console.error)
    .finally(async () => { await prisma.$disconnect(); });
