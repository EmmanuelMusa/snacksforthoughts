const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const reports = await prisma.schoolReport.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
            school: true
        }
    });
    console.log(JSON.stringify(reports, null, 2));

    const schools = await prisma.school.findMany({
        take: 5
    });
    console.log("Sample Schools:", JSON.stringify(schools, null, 2));
}

main()
    .catch(err => {
        console.error(err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
